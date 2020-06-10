//app.js
import 'store.js'
App({
  onLaunch: function () {
    
  

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
