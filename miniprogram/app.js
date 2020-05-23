//app.js
import 'store.js'
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    this.globalData = {}
  },

  
  //获取打卡信息
  GetCardData: function (e) {
    wx.request({
      method: 'POST',
      url: this.data.apiUrl + '/user/goal/get',
      data: {
        from: 0,
        amount: 5,
        login_key: this.$state.login_key,
      },
      success: (res) => {
        console.log("拉取post成功");
        console.log(res.data);

        this.ClearNewAimData();
        this.setState({
          aimCardDatas: res.data.data,
        })
        console.log((this.$state.aimCardDatas[1].canBeSignedNow == 1) && (this.$state.aimCardDatas[1].frequency_type[2] == 1));
        if ((this.$state.aimCardDatas[1].canBeSignedNow == 1) && (this.$state.aimCardDatas[1].frequency_type[2] == 1)) {} else {
          this.setData({
            error_code: "无法获取打卡信息",
          })
        }
        this.setData({
          card_num: this.$state.aimCardDatas.length,
        })
//自动打卡微信运动
        for(let i=0;i<this.data.card_num;i++){
            if(this.$state.aimCardDatas[i].canBeSignedNow == 1&&this.$state.aimCardDatas[i].goal_type == 2){
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
                    if(i==this.data.card_num-1)
                    {
                      this.GetCardData();
                    }
                  }, 500);
                }
              })
            }
        }
      }
    })

  },



})
