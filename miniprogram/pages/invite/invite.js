// pages/invite/invite.js
const awx = wx.toAsync("request", "login", "getWeRunData", "getUserInfo")
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
    invite_data: "",
    error_code: 502,

  },

  attached: function () {
    this.GetInviteData();
    let timer = setInterval(() => {
      if (!this.datat.invite_data.length) {
        this.GetInviteData()
      } else {
        clearInterval(timer)
      }
    }, 2500)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //受邀时获取信息
    GetInviteData: function () {
      (async () => {
        console.log("id", this.$state.invite_goal_id, " login_key:", this.$state.login_key, );
        if (this.$state.login_key == null) {
          console.log("无登陆无邀请");
          this.setData({
            error_code: 404,
          })
          return 404;
        }
        let result = awx.request({
          method: 'POST',
          url: this.$state.apiURL + '/user/group/get/data',
          data: {
            t: 1,
            p: this.$state.invite_goal_id,
            login_key: this.$state.login_key,
          },
        })
        if (result.errMsg === "request:fail ") {
          this.setData({
            error_code: 502,
          })
          return
        }
        this.setData({
          invite_data: result.data,
          error_code: 200,
        })
      })()
    },
  }
})