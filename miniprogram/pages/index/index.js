//index.js
// data-to:0=主页面 1=新建页面 2=设置页面

const app = getApp()

Page({
  data: {
    //主页面数据
     isLogin:false,
    // isLogin:true,
    apiUrl: 'http://58.218.198.18:9998',
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    // open_animation:'open 1s forwards',
    nowPage: 0,
    changedPageCounts: 0,

    ConsoleText:'200',

    //弹窗数据
    dialogTitle:'',
    dialogText:'',
    dialogShow:false,
    dialogsButton:[{text: '取消'}, {text: '确定'}],

    //新建打卡页面数据
    team: 0,

    type_array: ['极简', '普通', '微信运动'],
    type: 1,

    title:null,

    date_start: '请选择',
    date_end: '请先选择开始日期',

    frequencytype: 0,
    frequency: [0, 0, 0, 0],
    frequencynum: 1,
    frequencyout: '每天',
    // frequencyArray: [['普通','自定义'],['每天','每周','每月']],
    frequencyArray: [
      ['每'],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
      ['天', '周', '月'],
      ['任意一天', '仅当天'],
    ],
    // freinputValue: "",


    time_aim1: '请选择',
    time_aim2: '请选择',
    time_call: '请选择',

    normal_card_display: 0,
    fre_diy_display: 'none',
  },

  onLoad: function () {
    if (!this.data.isLogin) {
      wx.login({
        success: function (res) {
          wx.request({
            method: 'POST',
            url: 'http://58.218.198.18:9998/user/login',
            data: res.code,
            success: function (res) {
              console.log(JSON.stringify(res));
            }
          })
        }
      })    
    }
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      // 新建界面的日期
      var DATE = new Date().now();
      this.setData({
        date_start: DATE,
      });



      return
    }

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
  },

  // //微信运动
  // GetWeRunData:function (){
  //   wx.getWeRunData({
  //     success (res) {
  //       // 拿 encryptedData 到开发者后台解密开放数据
  //       const encryptedData = res.encryptedData
  //     }
  //   })
  // },


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
                          console.log(JSON.stringify(res));
                          this.setData({
                            isLogin: true,
                            // ConsoleText:this.data.isLogin,
                          })
                          this.setData({
                           
                            ConsoleText:this.data.isLogin,
                          })
                          console.log("this.setData:"+this.data.isLogin);
                        }
                      })
                    }
                  })




                }

              }
            })

          }
        }
      })
      console.log(e.detail.userInfo);
      console.log(this.data.isLogin);
      // this.setData({
      //   ConsoleText:this.data.isLogin,
      // })

    } else {
      console.log('用户拒绝了授权');
      this.setData({
        ConsoleText:'用户拒绝了授权',
      })
    }
  },




  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
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

  ClearNewAimData: function(){
    this.setData({
      team: 0,
      type: 1,
  
      title:null,  
      date_start: '请选择',
      date_end: '请先选择开始日期',
  
      frequencytype: 0,
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
    console.log(this.data.title!=null);
if(this.data.title!=null&&(this.data.type==0)||( this.data.date_end!= '请先选择开始日期'&& this.data.time_aim2!= '请选择')){
  this.setData({
    changedPageCounts: this.data.changedPageCounts + 1,
    nowPage: e.currentTarget.dataset.to,
  })
}else{
  this.setData({
    dialogTitle:"打卡信息未填完哦~",
    dialogsButton:[ {text: '继续填写',extClass:"btn_go_on"},{text: '取消',extClass:"btn_cancel"}],
    dialogShow:true,
})
}
  },

changePage_Back: function (e) {
    console.log(this.data.title!=null);

  this.setData({
    dialogTitle:"打卡未保存，确认退出？",
    dialogsButton:[{text: '退出编辑',extClass:"btn_go_on"},{text: '取消',extClass:"btn_cancel"}],
    dialogShow:true,
})

  },

  tapDialogButton: function (e) {
    console.log(e.detail.item.text); 
    if(e.detail.item.text=="退出编辑"){
    this.ClearNewAimData();
      this.setData({
        changedPageCounts: this.data.changedPageCounts + 1,
        nowPage: 0,  
        dialogShow:false,
      })
      8
    }else{
      this.setData({
        dialogShow:false,
    })
    }

  },

  //以上为公共
  //新建界面
  bindPickerTypeChange: function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    if (e.detail.value == 0) {
      this.setData({
        normal_card_display: 1,
        type: e.detail.value
      })
    } else {
      this.setData({
        normal_card_display: 0,
        type: e.detail.value
      })
    }
    console.log(' normal_card_display', this.data.normal_card_display)
  },

  //select
  click_single_btn: function (e) {
    if (this.data.team != 0) {
      this.setData({
        "team": '0'
      });
    } else {}
  },
  click_team_btn: function (e) {
    if (this.data.team != 1) {
      this.setData({
        "team": '1'
      });
    } else {}
  },
  //标题输入
  TitleInput: function (e) {
    if (e.detail.value) {
      this.setData({
        title: e.detail.value,
      })
    } else {
      this.setData({
        title: null,
      })
    }
  },

  //打卡频率
  bindPickerFrequencyChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var f;
    let d = 1;
    f = e.detail.value;
    console.log(f[0], f[1], f[2], f[3]);
    switch (f[2]) {
      case 0:
        d = 1 * f[1];
        break;
      case 1:
        d = 7 * f[1];
        break;
      case 2:
        d = -1 * f[1];
        break;
      default:
        console.log("error-34");
    }

    console.log("arrat:", this.data.frequencyArray[e.detail.value]);
    if (f[1] != 1) {
      this.setData({
        frequency: f,
        frequencynum: d,
        frequencyout: this.data.frequencyArray[0][0] + this.data.frequencyArray[1][f[1]] + this.data.frequencyArray[2][f[2]] + this.data.frequencyArray[3][f[3]],

      })
    } else {
      this.setData({
        frequency: f,
        fre_diy_display: "block",
        frequencyout: "自定义：" + this.data.frequencyArray[1][f[1]],
      })
    }
    console.log(f);
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    // var data = {
    //   frequencyArray: this.data.frequencyArray,
    //   frequency: this.data.frequency
    // };
    // data. frequency[e.detail.column] = e.detail.value;
    // switch (e.detail.column) {
    //   case 2:
    //     console.log(this.data.frequencyArray [3]);
    //     switch (data.frequency[2]){
    //       case 0:
    //         break;
    //       case 1:
    //         data.frequencyArray [3]= ['任意','周一','周二','周三','周四','周五','周六','周日'];
    //         break;
    //       case 2:
    //         break;
    //     }
    // }

  },


  // 自定义的确认按钮
  // click_btn: function (e) {
  //   console.log("当前fre：", this.data.freinputValue, "132");
  //   if (this.data.freinputValue != '') {
  //     if (this.data.frequencynum != 0) {
  //       if (this.data.frequencynum != 1) {
  //         this.setData({
  //           "fre_diy_display": 'none',
  //           freinputValue: '',
  //         });
  //       } else {
  //         this.setData({
  //           "fre_diy_display": 'none',
  //           frequencyout: "每天",
  //           freinputValue: '',
  //         });
  //       }
  //     }
  //   }
  //   console.log(this.data.frequency);
  // },
  //实时输入
  // KeyInput: function (e) {

  //   let num;
  //   console.log("456:", this.data.frequency[1]);
  //   switch (this.data.frequency[1]) {
  //     case 0:
  //       num = e.detail.value;
  //       break;
  //     case 1:
  //       num = 7 * e.detail.value;
  //       break;
  //     case 2:
  //       num = -1 * e.detail.value;
  //       break;
  //     default:
  //       num = 1;
  //       console.log("error-diyin");
  //       break;
  //   }

  //   if (num == 1) {
  //     this.setData({
  //       freinputValue: e.detail.value,
  //       frequencynum: num,
  //       frequency: [0, 0],
  //       frequencyout: "每天",
  //     })
  //   } else if (num == 0) {
  //     this.setData({
  //       freinputValue: e.detail.value,
  //       frequencynum: num,
  //       frequencyout: "自定义：输入有误",
  //     })
  //   } else {
  //     this.setData({
  //       freinputValue: e.detail.value,
  //       frequencynum: num,
  //       frequencyout: "每" + e.detail.value + this.data.frequencyArray[1][this.data.frequency[1]],
  //     })
  //   }
  //   console.log(this.data.frequency, this.data.frequencynum);
  // },

  // 日期选择器
  bindDatestartChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let start_date_temp = new Date(e.detail.value);
    let now_date_temp = new Date().getTime(); //获取时间戳
    let now_time = new Date().getHours() * 3600 + new Date().getMinutes() * 60; //当日时间
    now_time *= 1000;
    console.log(now_time);
    if (now_date_temp - now_time > start_date_temp) {
      console.log("haha2 ");
    } else {
      this.setData({
        date_start: e.detail.value
      })
    }

  },
  bindDateendChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log("started at: " + this.data.date_start);
    if (this.data.date_start !== '请选择') {
      //  在已选开始日期条件下，不早于开始日期
      let start_date_temp = new Date(this.data.date_start);
      let end_date_temp = new Date(e.detail.value);
      let now_date_temp = new Date().getTime();

      console.log(start_date_temp, end_date_temp);
      if (start_date_temp > end_date_temp) return;
      if (end_date_temp < now_date_temp) return;
      this.setData({
        date_end: e.detail.value
      })
    }
  },
  bindTimeAim1Change: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time_aim1: e.detail.value
    })
  },

  bindTimeAim2Change: function (e) {
    console.log('picker发送选择改变，携带值为')
    if (this.data.time_aim1 == "请选择") return;
    let startTotalMinutes = parseInt(this.data.time_aim1.split(':')[0]) * 60 + parseInt(this.data.time_aim1.split(':')[1]);
    let endTotalMinutes = parseInt(e.detail.value.split(':')[0]) * 60 + parseInt(e.detail.value.split(':')[1]);

    console.log(e.detail.value);

    if (endTotalMinutes < startTotalMinutes) {
      return
    } else {
      this.setData({
        time_aim2: e.detail.value
      })
    }
  },

  bindTimeCallChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time_call: e.detail.value
    })
  },

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },

})