// pages/newaimcard/newaimcard.js
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
    //弹窗
    dialogTitle: '',
    dialogText: '',
    dialogShow: false,
    dialogsButton: [{
      text: '取消'
    }, {
      text: '确定'
    }],

    can_share: false,
    share_text: ["(新建打卡后可邀请)", "新建打卡"],
    //新建打卡页面数据
    team: 0,
    type_array: ['极简', '普通', '微信运动'],
    type: 1,
    title: null,
    date_start: '请选择',
    date_end: '请先选择开始日期',

    frequencytype: 0,
    frequencytype2: 0, //0天1月目前都没用
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
    reminder_Array: ['打卡时', '提前5分钟', '提前10分钟', '提前15分钟', '提前30分钟', '提前一小时'],
    reminder: 0,
    reminder_num: [0, 5, 10, 15, 30, 60],

  },

  /**
   * 组件的方法列表
   */
  methods: {

    ClearNewAimData: function () {
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
        reminder: 0,

      })

    },
    // 分享

    //   onShareAppMessage: function () {
    //     console.log("share");
    //     return {
    //       title: '弹出分享时显示的分享标题',
    //       desc: '分享页面的内容',
    //       path: 'pages/index/index?id=123' ,
    //       // 路径，传递参数到指定页面。
    //     }
    //     console.log('成功')

    // },

    onLoad: function (options) {
      console.log('options2', options);
    },


    bindPickerTypeChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      if (e.detail.value == 0) {
        this.setData({
          normal_card_display: 1,
          type: e.detail.value
        })
      } else {
        //this.GetWeRunData();//微信运动函数
        this.setData({
          normal_card_display: 0,
          type: e.detail.value
        })
      }
      console.log(' normal_card_display', this.data.normal_card_display)
    },

    //select
    click_single_btn: function (e) {
      let data = this.$state.aimCardData;
      if (this.data.team != 0) {
        data["team"] = 0;
        this.setData({
          "team": '0'
        });
        this.setState({
          aimCardData: data,
        })
      } else {}
    },
    click_team_btn: function (e) {
      let data = this.$state.aimCardData;
      if (this.data.team != 1) {
        data["team"] = 1;
        this.setData({
          "team": '1'
        });
        this.setState({
          aimCardData: data,
        })
      } else {}
    },
    //标题输入
    valueChanged: function (e) {
      console.log(e);
      switch (e.target.dataset.name) {
        case "goal_type":
          if (e.detail.value != 1) {
            this.setData({
              normal_card_display: 1,
              type: e.detail.value
            })
          } else {
            //this.GetWeRunData();//微信运动函数
            this.setData({
              normal_card_display: 0,
              type: e.detail.value
            })
          }
          console.log(' normal_card_display', this.data.normal_card_display)
          break;
        case "start_time":
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
          break;
        case "end_time":
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
          break;
        case "frequency":
          var f = e.detail.value;
          let d = 1;

          console.log(f);

          console.log(f[0], f[1], f[2], f[3]);
          switch (f[2]) {
            case 0:
              d = 1 * f[1] + 1;
              break;
            case 1:
              d = 7 * f[1] + 7;
              break;
            case 2:
              d = 1 * f[1] + 1;
              break;
            default:
              console.log("error-34");
          }

          console.log("arrat:", this.data.frequencyArray[e.detail.value]);

          let data = this.$state.aimCardData;
          data["frequencynum"] = d
          data["frequency"] = f
          console.log(data);

          this.setState({
            aimCardData: data
          })
          this.setData({
            frequency: f,
            frequencynum: d,
            frequencyout: this.data.frequencyArray[0][0] + this.data.frequencyArray[1][f[1]] + this.data.frequencyArray[2][f[2]] + this.data.frequencyArray[3][f[3]],
          })
          console.log(f);
          break;
        case "needed_be_signed_at":
          this.setData({
            time_aim1: e.detail.value
          })
          break;
        case "needed_be_signed_deadline":
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
          break;
        case "reminder_at":
          this.setData({
            reminder: e.detail.value,
          })
          let data2 = this.$state.aimCardData;
          data2["reminder_at"] = this.data.reminder_num[e.detail.value];
          this.setState({
            aimCardData: data2
          })
          break;
        default:
          break;
      }
      if (e.target.dataset.name != "frequency" && e.target.dataset.name != "reminder_at") {
        var data_name = e.target.dataset.name
        let data = this.$state.aimCardData;
        if (e.target.dataset.name == "title" && this.data.type == 2) {
          // 微信步数
          data[data_name] = "每天走" + e.detail.value + "步";
        } else {
          data[data_name] = e.detail.value
        }

        this.setState({
          aimCardData: data
        })
      }
    },


    TitleInput: function (e) {
      console.log(e);
      if (e.detail.value) {
        if (type != 2) {
          this.setData({
            title: e.detail.value,
          })
        } else {
          this.setData({
            title: "每天走" + e.detail.value + "步",
          })
        }
      } else {
        // this.setData({
        //   title: null,
        // })

        // this.setState({
        //   aimCardData: [...this.$state.aimCardData, ]
        // }

        // )
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
          d = 1 * f[1] + 1;
          break;
        case 1:
          d = 7 * f[1] + 7;
          break;
        case 2:
          d = 1 * f[1] + 1;
          break;
        default:
          console.log("error-34");
      }

      console.log("arrat:", this.data.frequencyArray[e.detail.value]);
      this.setData({
        frequency: f,
        frequencynum: d,
        frequencyout: this.data.frequencyArray[0][0] + this.data.frequencyArray[1][f[1]] + this.data.frequencyArray[2][f[2]] + this.data.frequencyArray[3][f[3]],
      })
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

    //分享
    btn_share: function (e) {

      this.setData({
        share_text: ["(共可邀请4人)", "请等待"],
      })
      //!can_share
      if (!this.data.can_share) {
        // console.log("ii");
        if (this.$state.aimCardData['title'] != null &&((this.$state.aimCardData['goal_type'] != 1&&this.$state.aimCardData['goal_type'] != null) || (this.$state.aimCardData['end_time'] != null && this.$state.aimCardData['needed_be_signed_deadline'] != null))) {
          {
            console.log(e);
            let goal_type, team, num, reminder_at;
            !this.$state.aimCardData['goal_type'] ? goal_type = 1 : goal_type = parseInt(this.$state.aimCardData['goal_type']);
            console.log(this.$state.aimCardData);
            !this.$state.aimCardData['team'] ? team = 0 : team = this.$state.aimCardData['team'];
            !this.$state.aimCardData['reminder_at'] ? reminder_at = 0 : reminder_at = this.$state.aimCardData['reminder_at'];
            console.log("team", team);
            console.log("goal_type",goal_type);
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
                  this.setData({
                    
                  })
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
            //end
            //清理全局变量
            // this.setState({
            //   aimCardData: [],
            // })
            //index页面.GetCardData()阉割版;


            setTimeout(()=>{
              wx.request({
                method: 'POST',
                url: this.$state.apiURL + '/user/goal/get',
                data: {
                  from: 0,
                  amount: 5,
                  login_key: this.$state.login_key,
                },
                success: (res) => {
                  console.log("拉取邀请码成功");
                  console.log(res.data);
                  //尝试修复前后端变量名不一致导致邀请后无法完成
                  let buffer =  res.data.data.data
                  buffer[0]['title']=buffer[0]['goal_name']
                  this.setState({
                    aimCardDatas: buffer,
                  })
                  console.log(this.$state.aimCardDatas[0]);
                }
              })
              this.setState({
                can_share: true,
              })
                  //index页面.GetCardData()end
            this.setData({
              can_share: true,
              share_text: ["(共可邀请4人)", "发送邀请"],
            })
            },50);    
            
            setTimeout(()=>{
              this.setData({
                can_share: true,
                share_text: ["(共可邀请4人)", "发送邀请"],
              }) 
            },1000);
       
        
   

          }
       
        } else {
          // console.log("22");
          //未填完弹窗
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
          this.setData({
            can_share: false,
            share_text: ["(新建打卡后可邀请)", "新建打卡"],
          }) 
return
        }
      }
      setTimeout(()=>{
        this.setData({
          can_share: true,
          share_text: ["(共可邀请4人)", "发送邀请"],
        }) 
      },800);
    },


    
    tapDialogButton: function () {
      this.setData({
        dialogShow: false,
      })
    },

  },


})