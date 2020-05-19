// pages/tick/tick.js
Component({
      /**
       * 组件的属性列表
       */
      properties: {

      },

      /**
       * 组件的初始数据
       */
      data: {
        null_flag: 1, //目标数

        movableViewInfo: {
          y: 0,
          showClass: 'none',
          data: {}
        },

        pageInfo: {
          rowHeight: 40,
          startIndex: null,
          scrollY: true,
          readyPlaceIndex: null,
          startY: 0,
          selectedIndex: null,
        },

        tick_num: 0,
        now_y: 0,
        // MoveableViewID: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        // MoveableViewY: ['0rpx', '0', '0', '0', '0', '0', '0', '0', '0', '0', ], //一个70
        goalsBoard: [{
          id: 1,
          name: "",
          disabled:false,
          icon:0,
        }, {
          id: 2,
          name: "",
          disabled:true,
          icon:0,
        }, {
          id: 3,
          name: "",
          disabled:true,
          icon:0,
        }, {
          id: 4,
          name: "",
          disabled:true,
          icon:0,
        }, {
          id: 5,
          name: "",
          disabled:true,
          icon:0,
        }, {
          id: 6,
          name: "",
          disabled:true,
          icon:0,
        }, {
          id: 7,
          name: "",
          disabled:true,
          icon:0,
        }, {
          id: 8,
          name: "",
          disabled:true,
          icon:0,
        }, {
          id: 9,
          name: "",
          disabled:true,
          icon:0,
        }, {
          id: 10,
          name: "",
          disabled:true,
          icon:0,
        }]
      },

      /**
       * 组件的方法列表
       */
      methods: {
        dragStart: function (event) {
          var pageInfo = this.data.pageInfo;
          let h = 80;
          h = h / 2;
          wx.getSystemInfo({
            success(res) {
              // console.log(res.windowWidth)
              h = h * res.windowWidth / 750;
              h = h * 2;
            }
          })
          pageInfo.rowHeight = h,
            this.setData({
              pageInfo: pageInfo
            })

          var startIndex = event.target.dataset.index
          console.log('获取到的元素为', this.data.goalsBoard[startIndex])
          // 初始化页面数据

          pageInfo.startY = event.touches[0].clientY
          pageInfo.readyPlaceIndex = startIndex
          pageInfo.selectedIndex = startIndex
          pageInfo.scrollY = false
          pageInfo.startIndex = startIndex

          this.setData({
            'movableViewInfo.y': pageInfo.startY - (pageInfo.rowHeight / 2)
          })
          // 初始化拖动控件数据
          var movableViewInfo = this.data.movableViewInfo
          movableViewInfo.data = this.data.goalsBoard[startIndex]
          movableViewInfo.showClass = "inline"

          this.setData({
            movableViewInfo: movableViewInfo,
            pageInfo: pageInfo
          })
        },

        dragMove: function (event) {
          var goalsBoard = this.data.goalsBoard
          var pageInfo = this.data.pageInfo
          // 计算拖拽距离
          var movableViewInfo = this.data.movableViewInfo
          var movedDistance = event.touches[0].clientY - pageInfo.startY
          movableViewInfo.y = pageInfo.startY - (pageInfo.rowHeight / 2) + movedDistance
          console.log('移动的距离为', movedDistance)

          // 修改预计放置位置
          var movedIndex = parseInt(movedDistance / pageInfo.rowHeight)
          var readyPlaceIndex = pageInfo.startIndex + movedIndex
          if (readyPlaceIndex < 0) {
            readyPlaceIndex = 0
          } else if (readyPlaceIndex >= goalsBoard.length) {
            readyPlaceIndex = goalsBoard.length - 1
          }

          if (readyPlaceIndex != pageInfo.selectedIndex) {
            var selectedData = goalsBoard[pageInfo.selectedIndex]

            goalsBoard.splice(pageInfo.selectedIndex, 1)
            goalsBoard.splice(readyPlaceIndex, 0, selectedData)
            pageInfo.selectedIndex = readyPlaceIndex
          }
          // 移动movableView
          pageInfo.readyPlaceIndex = readyPlaceIndex
          // console.log('移动到了索引', readyPlaceIndex, '选项为', optionList[readyPlaceIndex])

          this.setData({
            movableViewInfo: movableViewInfo,
            goalsBoard: goalsBoard,
            pageInfo: pageInfo
          })
        },

        dragEnd: function (event) {
          // 重置页面数据
          var pageInfo = this.data.pageInfo
          pageInfo.readyPlaceIndex = null
          pageInfo.startY = null
          pageInfo.selectedIndex = null
          pageInfo.startIndex = null
          pageInfo.scrollY = true
          let ExgoalsBoard = this.data.goalsBoard;
          let null_flag = 10;
          for (let i = 0; i < 10; i++) {
            if (ExgoalsBoard[i].name == "" && null_flag == 10) {
              null_flag = i;
            } //当获取到目标数后，可删除？
            console.log(ExgoalsBoard[i].name);
            if (null_flag != 10 &&(ExgoalsBoard[i].name != ""||ExgoalsBoard[i].icon != 0) ) {
              ExgoalsBoard[i].id = null_flag + 1;
              ExgoalsBoard[null_flag].id = i + 1;
              let temp;
              temp = ExgoalsBoard[i];
              console.log(null_flag, ExgoalsBoard[i], temp);
              ExgoalsBoard[i] = ExgoalsBoard[null_flag];
              ExgoalsBoard[null_flag] = temp;
            } else {
               ExgoalsBoard[i].id = i + 1;
            }
          }
          // 隐藏movableView
          var movableViewInfo = this.data.movableViewInfo
          movableViewInfo.showClass = 'none'

          this.setData({
            pageInfo: pageInfo,
            movableViewInfo: movableViewInfo,
            goalsBoard: ExgoalsBoard,
          })
          console.log(JSON.stringify(this.data.goalsBoard));

        },
        pxTorpx: function (px) {
          px = px * 2; //默认乘2，防止无法获取屏幕宽度
          wx.getSystemInfo({
            success(res) {
              // console.log(res.windowWidth)
              px = px / res.windowWidth * 750;
              px = px / 2;
            }
          })
          return px;
        },

        FindID: function (num) {
          let i = 0;
          for (i = 0; i < 10; i++) {
            console.log(i + ":" + JSON.stringify(this.data.goalsBoard[i]));
            if (this.data.goalsBoard[i].id == num) {

              return i;
            }
          }
          return -1;
        },

        // {"type":"change","timeStamp":6292,"target":{"id":"","offsetLeft":8,"offsetTop":5,"dataset":{}},"currentTarget":{"id":"","offsetLeft":8,"offsetTop":5,"dataset":{}},"mark":{},"detail":{"x":0,"y":161.2,"source":"touch"}
        bindKeyInput: function (e) {
          let input_index = e.target.dataset.index;
          console.log(JSON.stringify(e));
          let goalsBoard = this.data.goalsBoard;
          console.log(JSON.stringify(goalsBoard));
          let i = parseInt(e.currentTarget.dataset.index);
          goalsBoard[i].name = e.detail.value;
          this.setData({
            goalsBoard: goalsBoard,
          })
        },
        FinshInput: function (e) {
          let ExgoalsBoard = this.data.goalsBoard;
          let null_flag = 10;
          for (let i = 0; i < 10; i++) {
            ExgoalsBoard[i].disabled=false;
            if (ExgoalsBoard[i].name == "" && null_flag == 10) {
              null_flag = i;
              ExgoalsBoard[i].disabled=false;
            }else if(i>null_flag){
              ExgoalsBoard[i].disabled=true;
              if( ExgoalsBoard[i].icon!=2){
                ExgoalsBoard[i].icon=0;
              }              
            }      
          }
          this.setData({
            null_flag:null_flag,
            goalsBoard: ExgoalsBoard,
          })
        },
        ImgTap:function(e){
          // console.log("TAP");
          // console.log(JSON.stringify(e));
          let ExgoalsBoard = this.data.goalsBoard;
          ExgoalsBoard[e.currentTarget.dataset.index].icon=ExgoalsBoard[e.currentTarget.dataset.index].icon^1;
       this.setData({
        goalsBoard:ExgoalsBoard,
       })

        }



        },
      })