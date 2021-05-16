//index.js
// data-to:0=主页面 1=新建页面 2=设置页面 3=目标页面 4=打卡详情页面 5=接受邀请页面 6=修改打卡页面

const app = getApp()
const awx = wx.toAsync("request", "login", "getWeRunData", "getUserInfo")
Page({
  data: {
    //主页面数据
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    login_key: '',

    error_code: "(。・∀・)ノ",

    nowPage: 0,
    changedPageCounts: 0,

    ConsoleText: '200',

    //新建打卡数据：邀请次数，不重复post
    invite_time: 0,

    //弹窗数据
    dialogTitle: '',
    dialogText: '',
    dialogShow: false,
    dialogsButton: [{
      text: '取消'
    }, {
      text: '确定'
    }],

    //微信运动
    "stepInfoList": [{
      "timestamp": 0,
      "step": 0,
    }, ],

    goals: [],

    //新建打卡页面数据
    carditem: '',
    card_index: '',
  },

  onShow: function (e) {
    console.log("show0", this.$state.isLogin)
    if (this.$state.isLogin) {
      this.GetCardData();
    }

    this.ShowSkin();
  },

  ShowSkin: function () {
    console.log("skin", this.$state.skin, "TT", typeof (this.$state.skin));
    switch (this.$state.skin) {
      case "1":
      case 1:
        console.log("skin1")
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: '#FFCC66',
          complete: () => {
            console.log("换1完成")
          }
        })
        break;
      case "2":
      case 2:
        console.log("skin2")
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: '#ffffff',
          complete: () => {
            console.log("换2 完成")
          }
        })
        break;
      default:
        console.log("skin1")
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: '#FFCC66',
          complete: () => {
            console.log("换d 完成")
          }
        })
        break;
    }

  },



  onLoad: function (options) {
    (async () => {
      try {
        let skin = wx.getStorageSync('skin')
        let card_num = wx.getStorageSync('card_num')
        let IFT = wx.getStorageSync('IFT')
        console.log("s card_num out:", card_num)
        if (IFT == null) {
          IFT = true;
        }
        this.setState({
          card_num: card_num,
        })
        if (skin) {
          // Do something with return value
          console.log("s skin out:", skin)
          this.setState({
            skin: skin,
            ifFirstTime: IFT,
          })
          this.ShowSkin();
        }
      } catch (e) {
        console.log(e)
        this.setState({
          skin: 0
        })
      }
      console.log('options1', options);
      console.log('options2', options.id);
      let invite_goal_id = options.id;
      if (invite_goal_id) {
        console.log("invite_goal_id");
        this.setData({
          nowPage: 5,
        })
        this.setState({
          invite_goal_id: invite_goal_id,
        })
      } else {
        console.log("not invite_goal_id");
      }
      this.AutoCheckP(); //自动登陆授权
    })()
  },

  imageError: function (e) {
    console.log('image发生error事件，携带值为', e.detail.errMsg)
  },

  //分享
  // e.target.dataset.index为传过来的下标（第几个打卡）
  onShareAppMessage: function (e) {
    let shareGoal = this.$state.aimCardDatas[0] ? this.$state.aimCardDatas[0] : this.$state.CardData[e.target.dataset.index];
    console.log('shoreGoal', shareGoal);
    console.log(e.target.dataset.index);
    console.log("sharing", shareGoal.groupData.invite_id);
    console.log('分享成功');

    return {
      title: shareGoal.groupData.groupMembers[0].nickname + '邀请您一起和TA打卡',
      desc: '分享页面的内容',
      path: 'pages/index/index?id=' + shareGoal.groupData.invite_id,
      // 路径，传递参数到指定页面。
    }

  },
  AcceptInvite: function (e) {
    (async () => {
      console.log("invite_id:,", this.$state.invite_goal_id, "login_key: ", this.$state.login_key, );
      let result = await awx.request({
        method: 'POST',
        url: this.$state.apiURL + '/user/group/join',
        data: {
          invite_id: this.$state.invite_goal_id,
          login_key: this.$state.login_key,
        },
      })
      if (result) {
        console.log(`join success${result.data}`)
        this.setState({
          card_num: this.$state.card_num + 1,
        })
        await wx.setStorage({
          key: "card_num",
          data: this.$state.card_num
        })
        this.GetCardData()
        this.changePage(e)
      }
    })()
  },
  getindex: function (show) {
    let cardindex = [];
    (async () => {
      let res = await awx.request({
        method: 'POST',
        url: this.$state.apiURL + '/user/goal/get',
        data: {
          login_key: this.$state.login_key,
        },
      })
      this.setState({
        CardData: res.data.data.data,
      })
      console.log(this.$state.CardData, show.length);
      for (let i = 0; i < show.length; i++) {
        for (let j = 0; j < this.$state.CardData.length; j++) {
          if (show[i].goal_id == this.$state.CardData[j].goal_id) {
            cardindex.push(j);
            break;
          }
        }
      }
      this.setData({
        card_index: cardindex,
      })
    })()
  },
  //获取打卡信息
  GetCardData: function () {
    (async () => {
      let result = await awx.request({
        method: 'POST',
        url: this.$state.apiURL + '/user/goal/Bget',
        data: {
          amount: 5,
          login_key: this.$state.login_key,
        },
      })
      this.ClearNewAimData()
      this.setState({
        aimCardDatas: result.data.data.data,
        card_num: result.data.data.data.length,
      })
      this.getindex(this.$state.aimCardDatas);
      console.log(" this.$state.aimCardDatas.length", this.$state.aimCardDatas.length)
      wx.setStorage({
        key: "card_num",
        data: this.$state.card_num,
      })
      console.log(this.$state.aimCardDatas);
      // 自动打卡微信运动
      // ()()
    })()
  },

  //申请微信运动授权
  NeedWerun: function (e) {
    (async () => {
      let authorize = await wx.authorize({
        scope: 'scope.werun',
      })
      if (authorize) {
        console.log("WeRun authorize success")

      } else {
        console.log("WeRun authorize failure")
        wx.showToast({
          icon: 'none',
          title: '不要拒绝人家微信运动授权嘛qwq',
          duration: 2500,
        })
        let modal = await wx.showModal({
          title: '温馨提示',
          content: '您需要授权后，才能使用微信运动打卡功能，是否重新授权？',
          confirmColor: '#ff2d4a',
        })
        if (modal.confirm) {
          let opensetting = await wx.openSetting()
          if (opensetting["scope.werun"] === true) {
            this.GetWeRunData()
          } else {
            console.log("user refuse werun authorize again")
            wx.showToast({
              icon: 'none',
              title: '您终究还是拒绝微信运动授权',
              duration: 2500,
            })
          }
        } else if (modal.cancel) {
          wx.showToast({
            icon: 'none',
            title: '您还是拒绝微信运动授权',
            duration: 1500,
          })
        }
      }
    })()
  },


  //微信运动
  GetWeRunData: function () {
    (async () => {
      let authorize = await wx.authorize({
        scope: 'scope.werun'
      })
      if (authorize) {
        console.log("WeRun authorize success")
        if (!this.$state.login_key) {
          console.log("no key")
          return
        }
        let wWeRun = await awx.getWeRunData()
        if (wWeRun.encryptedData) {
          // 微信获取运动成功
          let weRunData = await awx.request({
            method: 'POST',
            url: this.$state.apiURL + '/user/getWeRunData',
            data: {
              encryptedData: wWeRun.encryptedData,
              iv: wWeRun.iv,
              login_key: this.$state.login_key,
            },
          })
          this.setData({
            stepInfoList: weRunData.data.stepInfoList
          })
        } else {
          console.log("微信步数获取失败：");
          wx.showToast({
            icon: 'none',
            title: '微信运动步数获取失败',
            duration: 1500,
          })
        }
      } else {
        console.log("user refuse werun authorize")
        this.NeedWerun()
      }
    })()
  },


  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  btn_nologin: function (e) {
    this.setState({
      isTry: true,
    })
  },
  ToLogin: function (e) {
    this.setState({
      isTry: false,
    })
  },
  //自动登陆
  AutoCheckP: function (e) {
    (async () => {
      if (this.$state.ifFirstTime != true) {
        let result = await awx.getUserInfo({})
        if (result.hasOwnProperty("userInfo")) {
          this.checkPermission()
        } else {
          console.log("user refuse userInfo authorize")
          wx.showToast({
            icon: 'none',
            title: '请您允许授权',
            duration: 2500,
          })
          this.setData({
            error_code: '(○´･д･)ﾉ',
          })
        }
      }
    })()
  },

  //手动登陆
  BtnCheckP: function (e) {
    console.log("user bindtap login")
    this.checkPermission()
  },

  //总登陆
  checkPermission: function (e) {
    (async () => {

      let wxLogin = await awx.login()
      if (!wxLogin.hasOwnProperty("code")) {
        console.log("wx.login failure");
        return
      }
      wx.setStorageSync("IFT", false)
      let userInfo = await awx.getUserInfo({
        withCredentials: true
      })
      let result = await awx.request({
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        url: this.$state.apiURL + '/user/login',
        data: {
          encryptedData: userInfo.encryptedData,
          iv: userInfo.iv,
          code: wxLogin.code
        },
      })
      if (!result.hasOwnProperty("data")) {
        this.setData({
          error_code: "请重试,code:2",
        })
        return
      } else if (result.data.status !== "success") {
        this.setData({
          error_code: result.data.code,
        })
        return
      }
      this.setState({
        isLogin: true,
        login_key: result.data.data['login_key']
      })
      let info = await awx.request({
        method: 'POST',
        url: this.$state.apiURL + '/user/info',
        data: {
          login_key: this.$state.login_key,
        },
      })
      console.log("info", info.data);
      let DATE = new Date();
      let DATESU = new Date(info.data.data.signed_up.replace(/-/g, '/'));
      DATE = parseInt((DATE - DATESU) / (24 * 60 * 60 * 1000));
      if (DATE == null) {
        DATE = 0;
      }
      this.setState({
        user_info: info.data.data,
        signed_up: info.data.data.signed_up,
        using_day: DATE,
      })
      console.log("isLogin", this.$state.isLogin, "key", this.$state.login_key);
      this.GetCardData()
      this.GetWeRunData()
    })()

  },

  changePage: function (e) {
    // 把 当前页面 设为 按钮中设置的数据的 页面
    //data-to是自定义的    
    // console.log(changedPageCounts);    
    this.setData({
      changedPageCounts: this.data.changedPageCounts + 1,
      nowPage: e.currentTarget.dataset.to,
    })
  },
  // 打卡详情返回
  DetailEnd: function (e) {
    this.GetCardData();
    this.changePage(e);
  },

  changeNewAimPage: function (e) {
    console.log(this.$state.card_num);
    if (this.$state.card_num >= 5) {
      wx.showToast({
        icon: 'none',
        title: '不能创建超过五个打卡哦|･ω･｀)',
        duration: 2500,
      })
    } else {
      this.changePage(e);
    }


  },

  modifycard: function (e) {
    if (e.currentTarget.dataset.to == 4) {
      this.selectComponent('#modifycard').modify();
      this.setData({
        changedPageCounts: this.data.changedPageCounts + 1,
        nowPage: e.currentTarget.dataset.to,
      })
    }
  },
  ClearNewAimData: function () {
    //清理全局变量impoant！
    if (!this.$state.can_share) {
      this.setState({
        aimCardData: [],
      })

    }
    this.setData({
      team: 0,
      type: 1,
      title: null,
      date_start: '请选择',
      date_end: '请先选择开始日期',

      frequencytype: 0,
      frequencytype2: 0,
      frequency: [0, 0, 0, 0],
      frequencynum: 1,
      frequencyout: '每天',

      time_aim1: '请选择',
      time_aim2: '请选择',
      time_call: '请选择',
      normal_card_display: 0,
    })
  },
  //弹窗
  changePage_Finish: function (e) {
    if (this.$state.aimCardData['title'] != null &&
      ((this.$state.aimCardData['goal_type'] != 1 && this.$state.aimCardData['goal_type'] != null) ||
        (this.$state.aimCardData['end_time'] != null && this.$state.aimCardData['needed_be_signed_deadline'] != null))) {
      //data.invite_time
      if (this.$state.can_share == false) {
        this.PostCardData();
      } else {
        this.setState({
          can_share: false,
        })
      }
      this.GetCardData();
      this.changePage(e);
    } else {
      this.setData({
        dialogTitle: "打卡信息未填完哦~",
        dialogsButton: [{
          text: '继续填写',
          extClass: "btn_go_on"
        }, {
          text: '取消',
          extClass: "btn_cancel"
        }],
        dialogShow: true,
      })
    }
  },

  ChangePageGetBoard: function (e) {
    this.GetBoard();
    this.changePage(e);
  },

  ChangePagePostBoard: function (e) {
    (async () => {
      let result = await awx.request({
        method: 'POST',
        url: this.$state.apiURL + '/user/board/change',
        data: {
          login_key: this.$state.login_key,
          data: this.$state.goalsBoardData,
        },
      })
      console.log(`上传目标板成功${result}`)
    })()
    this.changePage(e);
  },

  PostCardData: function (e) {
    (async () => {
      let goal_type, team, num, reminder_at;
      !this.$state.aimCardData['goal_type'] ? goal_type = 1 : goal_type = parseInt(this.$state.aimCardData['goal_type']);
      console.log(this.$state.aimCardData);
      !this.$state.aimCardData['team'] ? team = 0 : team = this.$state.aimCardData['team'];
      !this.$state.aimCardData['reminder_at'] ? reminder_at = 0 : reminder_at = this.$state.aimCardData['reminder_at'];
      let result
      if (goal_type == 1) {
        // 普通打卡提交  
        if (!this.$state.aimCardData['frequency']) {
          f = [0, 0, 0, 0];
          num = 1;
        } else {
          f = this.$state.aimCardData['frequency'];
          num = this.$state.aimCardData['frequencynum'];
        }
        let fre;
        if (f[2] == 2) {
          fre = f[3] + '|' + 1;
        } else {
          fre = f[3] + '|' + 0;
        }
        result = await awx.request({
          method: 'POST',
          url: this.$state.apiURL + '/user/goal/add',
          data: {
            goal_name: this.$state.aimCardData['title'],
            goal_type: 1,
            started_at: this.$state.aimCardData['start_time'],
            ended_in: this.$state.aimCardData['end_time'],
            frequency: num,
            frequency_type: fre,
            goal_is_a_group: team,
            reminder_at: reminder_at,
            needed_be_signed_at: this.$state.aimCardData['needed_be_signed_at'],
            needed_be_signed_deadline: this.$state.aimCardData['needed_be_signed_deadline'],
            signed_type: 1,
            signed_day: 0,
            login_key: this.$state.login_key,
          },
        })
      } else if (goal_type == 2) {
        let num = this.$state.aimCardData['title'].replace(/[^0-9]/ig, "");
        result = await awx.request({
          method: 'POST',
          url: this.$state.apiURL + '/user/goal/add',
          data: {
            goal_name: this.$state.aimCardData['title'],
            goal_type: goal_type, //2
            goal_is_a_group: team,
            frequency: num,
            login_key: this.$state.login_key,
          },
        })
      } else {
        result = awx.request({
          method: 'POST',
          url: this.$state.apiURL + '/user/goal/add',
          data: {
            goal_name: this.$state.aimCardData['title'],
            goal_type: goal_type,
            goal_is_a_group: team,
            login_key: this.$state.login_key,
          },
        })
      }
      if (result.errMsg === "request:fail ") {
        this.setData({
          error_code: '/user/goal/add' + result.errMsg,
        })
        return
      }
      this.setState({
        card_num: this.$state.card_num + 1
      })
      wx.setStorageSync("card_num", this.$state.card_num)

      // 提交目标板
      let data = [{
        id: this.$state.board_num + 1,
        icon: 2,
        name: this.$state.aimCardData["title"]
      }]
      let boardResult = await awx.request({
        method: 'POST',
        url: this.$state.apiURL + '/user/board/change',
        data: {
          login_key: this.$state.login_key,
          data: data,
        },
      })
      if (boardResult.errMsg === "request:fail ") {
        this.setData({
          error_code: '/user/board/change' + result.errMsg,
        })
        return
      }
      this.setState({
        board_num: this.$state.board_num + 1
      })
      this.setState({
        aimCardData: []
      })
      this.ClearNewAimData()
    })()
  },
  GetBoard: function () {
    // 获取目标板
    (async () => {
      let result = await awx.request({
        method: 'POST',
        url: this.$state.apiURL + '/user/board/get',
        data: {
          login_key: this.$state.login_key,
        },
      })
      this.setState({
        goalsBoardData: result.data.data
      })
      console.log("this.$state.goalsBoardData", this.$state.goalsBoardData);
    })()
  },

  sign_btn: function (e) {
    (async () => {
      let goal_id = e.currentTarget.dataset.id;
      let result = await awx.request({
        method: 'POST',
        url: this.$state.apiURL + '/user/goal/sign',
        data: {
          goal_id: goal_id,
          login_key: this.$state.login_key,
        },
      })
      console.log(`sign post ${result.data}`)
      this.GetCardData()
    })()
  },

  changePage_Back: function (e) {
    console.log(this.data.title != null);
    if (e.currentTarget.dataset.to == 0) {
      this.setData({
        dialogTitle: "打卡未保存，确认退出？",
        dialogsButton: [{
          text: '退出编辑',
          extClass: "btn_go_on"
        }, {
          text: '取消',
          extClass: "btn_cancel"
        }],
        dialogShow: true,
      })
    } else if (e.currentTarget.dataset.to == 4) {
      this.setData({
        dialogTitle: "修改未保存，确认退出？",
        dialogsButton: [{
          text: '退出修改',
          extClass: "btn_go_on"
        }, {
          text: '取消',
          extClass: "btn_cancel"
        }],
        dialogShow: true,
      })
    }
  },

  tapDialogButton: function (e) {
    console.log(e.detail.item.text);
    if (e.detail.item.text == "退出编辑") {
      this.ClearNewAimData();
      this.setData({
        changedPageCounts: this.data.changedPageCounts + 1,
        nowPage: 0,
        dialogShow: false,
      })
    } else if (e.detail.item.text === '退出修改') {
      this.setData({
        changedPageCounts: this.data.changedPageCounts + 1,
        nowPage: 4,
        dialogShow: false,
      })
    } else {
      this.setData({
        dialogShow: false,
      })
    }
  },
  // 跳转打卡详情页面
  gotodetails: function (e) {
    // wx.navigateTo({url:'../carddetails/carddetails',})
    this.setData({
      nowPage: 4,
      carditem: this.data.card_index[e.currentTarget.dataset.to],
    })
  },
  getsondelete: function (e) {
    console.log('getsondelete');
    let page;
    if (e.detail === 'delete') {
      page = 0;
    } else if (e.detail === 'modify') {
      page = 4;
    }
    this.setData({
      nowPage: page,
      changedPageCounts: this.data.changedPageCounts + 1,
    })
    this.GetCardData();
  },


})