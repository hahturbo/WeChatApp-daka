//index.js
// data-to:0=主页面 1=新建页面 2=设置页面 3=目标页面 4=打卡详情页面 5=接受邀请页面 6=修改打卡页面

const app = getApp()

Page({
  data: {
    //主页面数据
    // isLogin: false,
    isLogin: true,
    apiUrl: 'http://58.218.198.18:9998',
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    login_key: '',

    error_code: "(。・∀・)ノ",


    // open_animation:'open 1s forwards',
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
  },

  onShow: function (e) {
    console.log("show0",this.$state.isLogin)
    if(this.$state.isLogin){
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
    try {
      var skin = wx.getStorageSync('skin')
      var card_num = wx.getStorageSync('card_num')
      console.log("s card_num out:", card_num)
      this.setState({
        card_num: card_num,
      })
      if (skin) {
        // Do something with return value
        console.log("s skin out:", skin)
        this.setState({
          skin: skin,
        })
        this.ShowSkin();
      }
    } catch (e) {
      console.log(e)
      this.setState({
        skin: 0
      })
      // Do something when catch error
    }
    console.log('options1', options);
    console.log('options2', options.id);
    let invite_goal_id = options.id;

    if (!this.data.isLogin) {
      wx.login({
        success: function (res) {
          wx.request({
            method: 'POST',
            url: this.$state.apiURL + '/user/login',
            data: res.code,
            success: function (res) {
              res = res.data;
              if (res.status == "success") {
                this.setState({
                  login_key: res.data.login_key
                })
                if (login_key) {}
              } else {
                console.log("登陆失败");

              }

            }
          })
        }
      })
    }
    // // 新建界面的日期
    // var DATE = new Date().get
    // this.setData({
    //   date_start: DATE,
    // });    

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })

    if (invite_goal_id) {
      console.log("hasid");
      this.setData({
        nowPage: 5,
      })
      this.setState({
        invite_goal_id: invite_goal_id,
      })
    } else {
      console.log("notgo");
    }


  },
  //分享
  // e.target.dataset.index为传过来的下标（第几个打卡）
  onShareAppMessage: function (e) {
    console.log(e.target.dataset.index);
    console.log("sharing", this.$state.aimCardDatas[e.target.dataset.index].groupData.invite_id);
    console.log('分享成功');
    return {
      title: this.$state.aimCardDatas[e.target.dataset.index].groupData.groupMembers[0].nickname + '邀请您一起和TA打卡',
      desc: '分享页面的内容',
      path: 'pages/index/index?id=' + this.$state.aimCardDatas[e.target.dataset.index].groupData.invite_id,
      // 路径，传递参数到指定页面。
    }

  },
  AcceptInvite: function (e) {
    console.log("invite_id:,", this.$state.invite_goal_id,
      "login_key: ", this.$state.login_key, );
    wx.request({
      method: 'POST',
      url: this.$state.apiURL + '/user/group/join',
      data: {
        invite_id: this.$state.invite_goal_id,
        login_key: this.$state.login_key,
      },
      success: (res) => {
        console.log("加入请求成功");
        console.log(res.data);
        //打卡项加一
        let L = this.$state.card_num;
        L++;
        this.setState({
          card_num: L,
        })
        wx.setStorage({
          key: "card_num",
          data: L,
        })

      }
    })
    this.GetCardData();
    this.changePage(e);
  },

  //获取打卡信息
  GetCardData: function (e) {
    let L = this.$state.card_num;
    if (!L) {
      L = 5;
    }
    console.log(this.$state.card_num, ">>", L);

    wx.request({
      method: 'POST',
      url: this.$state.apiURL + '/user/goal/get',
      data: {
        from: 0,
        amount: L,
        login_key: this.$state.login_key,
      },
      success: (res) => {
        console.log("拉取post成功");
        console.log(res.data);
        this.ClearNewAimData();
        //剔除过期数组项
        let array0 = res.data.data.data;
        let array1 = [];
        for (let i = 0; i < array0.length; i++) {
          if (array0[i].goal_type >= 3) {
            continue;
          } else {
            array1.push(array0[i]);
          }
        }
        this.setState({
          // aimCardDatas: res.data.data.data,
          aimCardDatas: array1,
        })
        console.log("L2:", array0, ">>", this.$state.aimCardDatas, );
        this.setState({
          card_num: this.$state.aimCardDatas.length,
        })
        console.log(" this.$state.aimCardDatas.length", this.$state.aimCardDatas.length)
        wx.setStorage({
          key: "card_num",
          data: this.$state.card_num,
        })
//貌似无用
        // console.log((this.$state.aimCardDatas[0].canBeSignedNow == 1) && (this.$state.aimCardDatas[0].frequency_type[2] == 1));
        // if ((this.$state.aimCardDatas[0].canBeSignedNow == 1) && (this.$state.aimCardDatas[0].frequency_type[2] == 1)) {

        // } else {
        //   this.setData({
        //     error_code: "无法获取或没有打卡信息",
        //   })
        // }

        //自动打卡微信运动
        setTimeout(() => {
          for (let i = 0; i < this.$state.card_num; i++) {
            if (this.$state.aimCardDatas[i].canBeSignedNow == 1 && this.$state.aimCardDatas[i].goal_type == 2) {
              wx.request({
                method: 'POST',
                url: this.$state.apiURL + '/user/goal/sign',
                data: {
                  goal_id: this.$state.aimCardDatas[i].goal_id,
                  login_key: this.$state.login_key,
                },
                success: (res) => {
                  console.log("自动打卡上传成功");
                  console.log(res.data);
                  this.setData({})
                  setTimeout(() => {
                    this.GetCardData();
                  }, 500);
                }
              })
            }
          }
        }, 500);

      }
    })

  },

  //申请微信运动授权
  NeedWerun: function (e) {
    wx.authorize({
      scope: 'scope.werun',
      success() {
        console.log("微信步数已经授权同意 ");
        // 用户已经同意小程序使用微信运动，后续调用  接口不会弹窗询问
        setTimeout(() => {
          run()
        }, 200)
      },
      fail: res => {
        console.log("微信步数授权失败： " + JSON.stringify(res));
        wx.showToast({
          icon: 'none',
          title: '不要拒绝人家微信运动授权嘛qwq',
          duration: 2500,
        })
        wx.showModal({
          title: '温馨提示',
          content: '您需要授权后，才能使用微信运动打卡功能，是否重新授权？',
          confirmColor: '#ff2d4a',
          success(res) {
            if (res.confirm) {
              // 如果用户点了确定，就打开 设置 界面
              wx.openSetting({
                success(res) {
                  // 不管是否开启授权，都执行success
                  // 应该根据 res['scope.XXx'] 是 true 或 false 来确定用户是否同意授权
                  console.log('设置success：', res.authSetting)
                  if (res.authSetting['scope.werun'] === true) {
                    // 套娃获取步数
                    this.GetWeRunData();
                  }
                },
                fail(err) {
                  console.log('授权微信运动失败:', err)
                  wx.showToast({
                    icon: 'none',
                    title: '您终究还是拒绝微信运动授权',
                    duration: 2500,
                  })
                }
              })
              console.log('用户点击确定前往授权')
            } else if (res.cancel) {
              wx.showToast({
                icon: 'none',
                title: '您还是拒绝微信运动授权',
                duration: 1500,
              })
            }
          }
        })
      }
    })
  },


  //微信运动
  GetWeRunData: function () {
    console.log("微信步数授权 ");
    wx.authorize({
      scope: 'scope.werun',
      success() {
        console.log("微信步数授权同意 ");
        // 用户已经同意小程序使用微信运动，后续调用  接口不会弹窗询问
        setTimeout(() => {
          run()
        }, 200)
      },
      fail: res => {
        console.log("微信步数授权失败： " + JSON.stringify(res));
        this.NeedWerun()
        // wx.showToast({
        //   icon: 'none',
        //   title: '您拒绝了微信运动授权',
        //   duration: 2500,
        // })
      },
    })


    let run = () => {
      if (this.$state.login_key) {
        wx.getWeRunData({
          success: (res) => {
            console.log("this.$state.", res.encryptedData);
            console.log("this.$state.api", this.$state.apiURL);
            wx.request({
              method: 'POST',
              url: this.$state.apiURL + '/user/getWeRunData',
              data: {
                encryptedData: res.encryptedData,
                iv: res.iv,
                login_key: this.$state.login_key,
              },
              success: (res) => {
                console.log("22");
                console.log(res.data.stepInfoList);
                this.setData({
                  stepInfoList: res.data.stepInfoList,
                })
                console.log("12");
                console.log(this.data.stepInfoList);
              }
            })

          },
          fail: res => {
            console.log("微信步数获取失败： " + res);
            wx.showToast({
              icon: 'none',
              title: '微信运动步数获取失败',
              duration: 1500,
            })
          }
        })
      } else {
        console.log("nokey" + this.data.login_key);
      }
    }
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
  //
  checkPermission: function (e) {
    console.log(e);
    if (e.detail.userInfo) {

      // 有授权的操作
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.login({
              success: (res) => {
                var code = res.code;
                if (code) {
                  wx.getUserInfo({
                    success: (res) => {
                      console.log(JSON.stringify(res));
                      wx.request({
                        method: 'POST',
                        header: {
                          'content-type': 'application/json'
                        },
                        url: this.data.apiUrl + '/user/login',
                        data: {
                          encryptedData: res.encryptedData,
                          iv: res.iv,
                          code: code
                        },
                        success: (res) => {
                          res = res.data;
                          console.log("this:" + JSON.stringify(res));
                          if (res.status = "success") {
                            this.setState({
                              isLogin: true,
                              login_key: res.data['login_key']
                            })

                            // 获取用户信息。计算使用天数
                            setTimeout(() => {
                              console.log("isLogin2", this.data.isLogin, "key2", this.$state.login_key);
                              wx.request({
                                method: 'POST',
                                url: this.data.apiUrl + '/user/info',
                                data: {
                                  login_key: this.$state.login_key,
                                },
                                success: (res) => {
                                  console.log("info", res.data);
                                  let DATE = new Date();
                                  let DATESU = new Date(res.data.data.signed_up);
                                  DATE = parseInt((DATE - DATESU) / (24 * 60 * 60 * 1000));
                                  console.log("11", DATE);
                                  this.setState({
                                    signed_up: res.data.data.signed_up,
                                    using_day: DATE,
                                  })
                                }
                              })
                            }, 500);

                          } else {
                            // this.setState({
                            //   isLogin: false,
                            // })
                            this.setData({
                              error_code: res.code,
                            })
                          }
                          console.log("this.setData:" + res.data);
                          this.GetCardData();
                          setTimeout(() => {
                            this.GetBoard();
                          }, 500);

                        },

                        fail: () => {
                          console.log("失败");
                          this.setData({
                            error_code: "请重试",
                          })
                        },
                        complete: () => {
                          console.log("完成");
                          this.setData({
                            error_code: "请重试",
                          })
                        },

                      })
                      // this.GetCardData();
                    }
                  })
                }
              }
            })
          }
          this.GetWeRunData();
        }
      })
      console.log(e.detail.userInfo);
      console.log("isLogin", this.data.isLogin, "key", this.$state.login_key);
      // this.setData({
      //   ConsoleText:this.data.isLogin,
      // })

      // // 获取用户信息。计算使用天数 上移
      // setTimeout(() => {
      //   console.log("isLogin2", this.data.isLogin, "key2", this.$state.login_key);
      //   wx.request({
      //     method: 'POST',
      //     url: this.data.apiUrl + '/user/info',
      //     data: {
      //       login_key: this.$state.login_key,
      //     },
      //     success: (res) => {
      //       console.log("info", res.data);
      //       let DATE = new Date();
      //       let DATESU = new Date(res.data.data.signed_up);
      //       DATE = parseInt((DATE - DATESU) / (24 * 60 * 60 * 1000));
      //       console.log("11", DATE);
      //       this.setState({
      //         signed_up: res.data.data.signed_up,
      //         using_day: DATE,
      //       })
      //     }
      //   })
      // }, 3500);
    } else {
      console.log('用户拒绝了授权');
      wx.showToast({
        icon: 'none',
        title: '请您允许授权',
        duration: 2500,
      })
      this.setData({
        error_code: '(○´･д･)ﾉ',
      })
    }


  },




  // onGetOpenid: function () {
  //   // 调用云函数
  //   wx.cloud.callFunction({
  //     name: 'login',
  //     data: {},
  //     success: res => {
  //       console.log('[云函数] [login] user openid: ', res.result.openid)
  //       app.globalData.openid = res.result.openid
  //       wx.navigateTo({
  //         url: '../userConsole/userConsole',
  //       })
  //     },
  //     fail: err => {
  //       console.error('[云函数] [login] 调用失败', err)
  //       wx.navigateTo({
  //         url: '../deployFunctions/deployFunctions',
  //       })
  //     }
  //   })
  // },


  changePage: function (e) {
    // 把 当前页面 设为 按钮中设置的数据的 页面
    //data-to是自定义的    
    // console.log(changedPageCounts);    
    this.setData({
      changedPageCounts: this.data.changedPageCounts + 1,
      nowPage: e.currentTarget.dataset.to,
    })
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
    this.setState({
      aimCardData: [],
    })

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
    console.log("e", e);
    console.log(this.$state.aimCardData);
    console.log(this.$state.aimCardData['needed_be_signed_deadline']);
    if (this.$state.aimCardData['title'] != null && ((this.$state.aimCardData['goal_type'] != 1 && this.$state.aimCardData['goal_type'] != null) || (this.$state.aimCardData['end_time'] != null && this.$state.aimCardData['needed_be_signed_deadline'] != null))) {
      //data.invite_time
      if (this.$state.can_share == false) {
        this.PostCardData();
      } else {
        this.setState({
          can_share: false,
        })
      }
      if (e.from != 'button') {
        setTimeout(() => {
          this.GetCardData();
          this.changePage(e);
        }, 500);
      }
      return true;
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
      return false;
    }
  },

  ChangePageGetBoard: function (e) {
    this.GetBoard();
    //this.changePage(e);
    setTimeout(() => {
      this.changePage(e);
    }, 300);

    // this.setData({
    //   changedPageCounts: this.data.changedPageCounts + 1,
    //   nowPage: e.currentTarget.dataset.to,
    // })
  },

  ChangePagePostBoard: function (e) {
    wx.request({
      method: 'POST',
      url: this.$state.apiURL + '/user/board/change',
      data: {
        login_key: this.$state.login_key,
        data: this.$state.goalsBoardData,
      },
      success: (res) => {
        console.log("上传目标板成功");
        console.log(res.data);
       
      }
    })
    // 换页部分
    this.changePage(e);
    // this.setData({
    //   changedPageCounts: this.data.changedPageCounts + 1,
    //   nowPage: e.currentTarget.dataset.to,
    // })

  },

  PostCardData: function (e) {

   let  CNplus= ()=>{
    var L = this.$state.card_num;
       //打卡项加一      
       L++;
       console.log("新建长度：",L);
       this.setState({
         card_num: L,
       })
       wx.setStorage({
         key: "card_num",
         data: L,
       })
    };



    console.log(e);
    let goal_type, team, num, reminder_at;
    !this.$state.aimCardData['goal_type'] ? goal_type = 1 : goal_type = parseInt(this.$state.aimCardData['goal_type']);
    console.log(this.$state.aimCardData);
    !this.$state.aimCardData['team'] ? team = 0 : team = this.$state.aimCardData['team'];
    !this.$state.aimCardData['reminder_at'] ? reminder_at = 0 : reminder_at = this.$state.aimCardData['reminder_at'];
    console.log("team", team);

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
      console.log(this.$state.aimCardData['reminder_at']);
      wx.request({
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
        success: (res) => {
          console.log("提交成功");
          console.log(res.data);
          if (res.status != "success") {
            this.setData({
              error_code: res.status + res.code,
            })
          }else{
            CNplus();
          }

        }

      })
    } else if (goal_type == 2) {
      let num = this.$state.aimCardData['title'].replace(/[^0-9]/ig, "");
      console.log("步数", num);
      // 微信运动
      wx.request({
        method: 'POST',
        url: this.$state.apiURL + '/user/goal/add',
        data: {
          goal_name: this.$state.aimCardData['title'],
          goal_type: goal_type, //2
          goal_is_a_group: team,
          frequency: num,
          login_key: this.$state.login_key,
        },
        success: (res) => {
          console.log("提交运动成功");
          console.log(res.data);
          this.setData({})
        
            CNplus();
          
        }
      })
    } else if (goal_type == 0) {
      wx.request({
        method: 'POST',
        url: this.$state.apiURL + '/user/goal/add',
        data: {
          goal_name: this.$state.aimCardData['title'],
          goal_type: goal_type,
          goal_is_a_group: team,
          login_key: this.$state.login_key,
        },
        success: (res) => {
          console.log("提交极简成功");
          console.log(res.data);
          this.setData({})
        
            CNplus();
          
        }
      })
    }
    // 提交至目标板
    let data, board_num;
    board_num = this.$state.board_num;
    board_num++;
    console.log(board_num);
    data = [{
      id: board_num,
      icon: 2,
      name: this.$state.aimCardData['title'],
    }]
    wx.request({
      method: 'POST',
      url: this.$state.apiURL + '/user/board/change',
      data: {
        login_key: this.$state.login_key,
        data: data,
      },
      success: (res) => {
        console.log("上传目标板成功");
        console.log(res.data);
        this.setState({
          board_num: board_num,
        })
      }
    })


    //清理全局变量
    this.setState({
      aimCardData: [],
    })
    this.ClearNewAimData(); //测试可注释
    //this.GetCardData();
  },



  GetBoard: function () {
    // 获取目标板
    wx.request({
      method: 'POST',
      url: this.data.apiUrl + '/user/board/get',
      data: {
        login_key: this.$state.login_key,
      },
      success: (res) => {
        let length = 0;
        let title, back = 15;
        console.log("拉取目标板成功");
        console.log(res.data);
        console.log('a', res.data.data[length].title);
        title = res.data.data[0].title;

        while (title) {
          length++;
          if (res.data.data[length]) {
            title = res.data.data[length].title;
          } else {
            break;
          }
        }
        console.log("length", length);
        this.setState({
          goalsBoardData: res.data.data,
          board_num: length,
        })
        console.log("this.$state.goalsBoardData", this.$state.goalsBoardData);
      }
    })
  },

  sign_btn: function (e) {
    let goal_id = e.currentTarget.dataset.id;
    wx.request({
      method: 'POST',
      url: this.$state.apiURL + '/user/goal/sign',
      data: {
        goal_id: goal_id,
        login_key: this.$state.login_key,
      },
      success: (res) => {
        console.log("打卡上传成功");
        console.log(res.data);
        this.setData({})
        setTimeout(() => {
          this.GetCardData();
        }, 500);
      }
    })
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
      carditem: e.currentTarget.dataset.to,
    })
  },
  getsondelete: function (e) {
    console.log('getsondelete');
    this.setData({
      nowPage: e.detail === 'delete' ? 0 : 4,
      changedPageCounts: this.data.changedPageCounts + 1,
    })
  },

  get_storage: function (key) {
    console.log("keyin", key)
    wx.getStorage({
      key: key,
      success(res) {
        console.logkey, (key, "sout:", res.data)
        return res.data;
      },
      complete(res) {
        console.logkey, (key, "out:", res.data)
        return res.data;
      }
    })
  }




  //以上为公共
  // //新建界面
  // bindPickerTypeChange: function (e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   if (e.detail.value == 0) {
  //     this.setData({
  //       normal_card_display: 1,
  //       type: e.detail.value
  //     })
  //   } else {
  //    //this.GetWeRunData();//微信运动函数
  //     this.setData({
  //       normal_card_display: 0,
  //       type: e.detail.value
  //     })
  //   }
  //   console.log(' normal_card_display', this.data.normal_card_display)
  // },

  // //select
  // click_single_btn: function (e) {
  //   if (this.data.team != 0) {
  //     this.setData({
  //       "team": '0'
  //     });
  //   } else {}
  // },
  // click_team_btn: function (e) {
  //   if (this.data.team != 1) {
  //     this.setData({
  //       "team": '1'
  //     });
  //   } else {}
  // },
  // //标题输入
  // TitleInput: function (e) {
  //   if (e.detail.value) {
  //     this.setData({
  //       title: e.detail.value,
  //     })
  //   } else {
  //     this.setData({
  //       title: null,
  //     })
  //   }
  // },

  // //打卡频率
  // bindPickerFrequencyChange: function (e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   var f;
  //   let d = 1;
  //   f = e.detail.value;
  //   console.log(f[0], f[1], f[2], f[3]);
  //   switch (f[2]) {
  //     case 0:
  //       d = 1 * f[1]+1;
  //       break;
  //     case 1:
  //       d = 7 * f[1]+7;
  //       break;
  //     case 2:
  //       d = 1 * f[1]+1;
  //       break;
  //     default:
  //       console.log("error-34");
  //   }

  //   console.log("arrat:", this.data.frequencyArray[e.detail.value]);
  //     this.setData({
  //       frequency: f,
  //       frequencynum: d,
  //       frequencyout: this.data.frequencyArray[0][0] + this.data.frequencyArray[1][f[1]] + this.data.frequencyArray[2][f[2]] + this.data.frequencyArray[3][f[3]],
  //     })
  //   console.log(f);
  // },
  // bindMultiPickerColumnChange: function (e) {
  //   console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
  //   // var data = {
  //   //   frequencyArray: this.data.frequencyArray,
  //   //   frequency: this.data.frequency
  //   // };
  //   // data. frequency[e.detail.column] = e.detail.value;
  //   // switch (e.detail.column) {
  //   //   case 2:
  //   //     console.log(this.data.frequencyArray [3]);
  //   //     switch (data.frequency[2]){
  //   //       case 0:
  //   //         break;
  //   //       case 1:
  //   //         data.frequencyArray [3]= ['任意','周一','周二','周三','周四','周五','周六','周日'];
  //   //         break;
  //   //       case 2:
  //   //         break;
  //   //     }
  //   // }

  // },


  // // 自定义的确认按钮
  // // click_btn: function (e) {
  // //   console.log("当前fre：", this.data.freinputValue, "132");
  // //   if (this.data.freinputValue != '') {
  // //     if (this.data.frequencynum != 0) {
  // //       if (this.data.frequencynum != 1) {
  // //         this.setData({
  // //           "fre_diy_display": 'none',
  // //           freinputValue: '',
  // //         });
  // //       } else {
  // //         this.setData({
  // //           "fre_diy_display": 'none',
  // //           frequencyout: "每天",
  // //           freinputValue: '',
  // //         });
  // //       }
  // //     }
  // //   }
  // //   console.log(this.data.frequency);
  // // },
  // //实时输入
  // // KeyInput: function (e) {

  // //   let num;
  // //   console.log("456:", this.data.frequency[1]);
  // //   switch (this.data.frequency[1]) {
  // //     case 0:
  // //       num = e.detail.value;
  // //       break;
  // //     case 1:
  // //       num = 7 * e.detail.value;
  // //       break;
  // //     case 2:
  // //       num = -1 * e.detail.value;
  // //       break;
  // //     default:
  // //       num = 1;
  // //       console.log("error-diyin");
  // //       break;
  // //   }

  // //   if (num == 1) {
  // //     this.setData({
  // //       freinputValue: e.detail.value,
  // //       frequencynum: num,
  // //       frequency: [0, 0],
  // //       frequencyout: "每天",
  // //     })
  // //   } else if (num == 0) {
  // //     this.setData({
  // //       freinputValue: e.detail.value,
  // //       frequencynum: num,
  // //       frequencyout: "自定义：输入有误",
  // //     })
  // //   } else {
  // //     this.setData({
  // //       freinputValue: e.detail.value,
  // //       frequencynum: num,
  // //       frequencyout: "每" + e.detail.value + this.data.frequencyArray[1][this.data.frequency[1]],
  // //     })
  // //   }
  // //   console.log(this.data.frequency, this.data.frequencynum);
  // // },

  // // 日期选择器
  // bindDatestartChange: function (e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   let start_date_temp = new Date(e.detail.value);
  //   let now_date_temp = new Date().getTime(); //获取时间戳
  //   let now_time = new Date().getHours() * 3600 + new Date().getMinutes() * 60; //当日时间
  //   now_time *= 1000;
  //   console.log(now_time);
  //   if (now_date_temp - now_time > start_date_temp) {
  //     console.log("haha2 ");
  //   } else {
  //     this.setData({
  //       date_start: e.detail.value
  //     })
  //   }

  // },
  // bindDateendChange: function (e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   console.log("started at: " + this.data.date_start);
  //   if (this.data.date_start !== '请选择') {
  //     //  在已选开始日期条件下，不早于开始日期
  //     let start_date_temp = new Date(this.data.date_start);
  //     let end_date_temp = new Date(e.detail.value);
  //     let now_date_temp = new Date().getTime();

  //     console.log(start_date_temp, end_date_temp);
  //     if (start_date_temp > end_date_temp) return;
  //     if (end_date_temp < now_date_temp) return;
  //     this.setData({
  //       date_end: e.detail.value
  //     })
  //   }
  // },
  // bindTimeAim1Change: function (e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     time_aim1: e.detail.value
  //   })
  // },

  // bindTimeAim2Change: function (e) {
  //   console.log('picker发送选择改变，携带值为')
  //   if (this.data.time_aim1 == "请选择") return;
  //   let startTotalMinutes = parseInt(this.data.time_aim1.split(':')[0]) * 60 + parseInt(this.data.time_aim1.split(':')[1]);
  //   let endTotalMinutes = parseInt(e.detail.value.split(':')[0]) * 60 + parseInt(e.detail.value.split(':')[1]);

  //   console.log(e.detail.value);

  //   if (endTotalMinutes < startTotalMinutes) {
  //     return
  //   } else {
  //     this.setData({
  //       time_aim2: e.detail.value
  //     })
  //   }
  // },

  // bindTimeCallChange: function (e) {
  //   console.log('picker发送选择改变，携带值为', e.detail.value)
  //   this.setData({
  //     time_call: e.detail.value
  //   })
  // },

})