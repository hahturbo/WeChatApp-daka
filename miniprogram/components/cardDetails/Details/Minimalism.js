// components/cardDetails/Details/Minimalism.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    minimalismhidden: {
      type: Boolean,
      value: true
    },
    item: {
      type: Number,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    carditem: '',
    todaydaka: '',
    todaydaka_bgc: '',
    todaydaka_c: ''
  },
  observers: {
    'item': function (item) {
      this.setData({
        carditem: item,
      })
    }
  },
  lifetimes: {
    ready: function () {
      this.getcarddetail();
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 获取打卡数据
    getcarddetail: function () {
      wx.request({
        method: "POST",
        url: this.$state.apiURL + '/user/getSignedRecord',
        data: {
          from: 0,
          amount: 10,
          login_key: this.$state.login_key,
        },
        success: (res) => {
          console.log('get succsess');
          this.setState({
            aimCardDatadetail: res.data.data,
          })
        },
        fail: () => {
          console.log('get fail');
        },
        complete: () => {
          // console.log(this.$state.aimCardDatadetail);
          // console.log(carditem);
          this.setData({
            todaydaka: (1 & this.$state.aimCardDatadetail[this.data.carditem].canBeSignedNow) ? "今日打卡" : "今日完成",
            todaydaka_bgc: (this.$state.aimCardDatadetail[this.data.carditem].canBeSignedNow & 1) ? 'rgb(255, 153, 102)' : 'transparent',
            todaydaka_c: (this.$state.aimCardDatadetail[this.data.carditem].canBeSignedNow & 1) ? '#fff;' : 'rgb(255,153,102)',
          })
          // console.log('get finish maybe succsee or fail');
        }
      });
    },

    // 今日打卡
    todaydaka: function (e) {
      // console.log('jinridaka');
      // console.log(this.$state.aimCardDatadetail[0].canBeSignedNow & 1);
      if (this.$state.aimCardDatadetail[this.data.carditem].canBeSignedNow & 1) {
        wx.request({
          method: 'POST',
          url: this.$state.apiURL + '/user/goal/get',
          data: {
            goal_id: this.$state.aimCardDatadetail[0].goal_id,
            login_key: this.$state.login_key,
          },
          success: (res) => {
            setTimeout(() => {
              this.getcarddetail();
            }, 100);
            this.triggerEvent('sign', 'sign');
            console.log('sign succsee!');
          },
          fail: (res) => {
            console.log('sign fail');
          },
          complete: (res) => {
            console.log('sign finish');
          }
        })
      } else {
        console.log('signed');
      }
    },
    // 删除打卡
    deletedaka: function () {
      this.setData({
        dialogshow: true,
        dialogtitle: '确定要删除此打卡吗？',
        dialogbutton: [{
            text: "删除",
            extClass: "btn_go_on"
          },
          {
            text: "取消",
            extClass: "btn_cancel"
          },
        ]
      })
      console.log('shanchudaka')
    },
    // dialog-buttontap
    buttontap: function (e) {
      console.log('button tap');
      if (e.detail.item.text == "删除") {
        console.log('删除');
        // 服务器删除
      } else {
        this.setData({
          dialogshow: false,
        })
      }
    },
  }
})