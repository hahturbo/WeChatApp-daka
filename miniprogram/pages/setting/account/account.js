// miniprogram/pages/setting/account/account.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_info: "",

    //弹窗数据
    dialogTitle: '确认执行?该操作不可逆！',
    dialogText: '该操作不可逆',
    dialogShow: false,
    dialogsButton: [{
      text: '取消'
    }, {
      text: '确定'
    }],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.GetUserInfo();
     wx.setNavigationBarTitle({
      title: "账户管理"   

    })
    wx.setNavigationBarColor({
      backgroundColor:"#ffffff",
      frontColor: '#000000'
    })

  },

  GetUserInfo: function () {
    wx.request({
      method: 'POST',
      url: this.$state.apiURL + '/user/info',
      data: {
        login_key: this.$state.login_key,
      },
      success: (res) => {
        console.log("info-p", res.data);
        this.setData({
          user_info: res.data.data,
        })
      }
    })

  },
  tapDialogButton: function (e) {
    if (e.detail.item.text == "确认") {
      if (e.detail.item.dialogTitle == "确认注销账户?操作不可逆!") {
        this.btn_logoff();
      }
      else{
        this.btn_clean();
      }
    } else {  
    }
    this.setData({
      dialogShow: false,
    })

  },

  btn: function (e) {
    console.log(e);
    if (e.currentTarget.dataset.tap == 'btn_logoff') {
      this.setData({
        dialogTitle: "确认注销账户?操作不可逆！",
        dialogsButton: [{
          text: '确认',
          extClass: "btn_go_on"
        }, {
          text: '取消',
          extClass: "btn_cancel"
        }],
        dialogShow: true,
      })

    } else {
      this.setData({
        dialogTitle: "确认清除记录？",
        dialogsButton: [{
          text: '确认',
          extClass: "btn_go_on"
        }, {
          text: '取消',
          extClass: "btn_cancel"
        }],
        dialogShow: true,
      })
    }
  },

  btn_clean: function (e) {
    wx.request({
      method: 'POST',
      url: this.$state.apiURL + '/user/clean',
      data: {
        login_key: this.$state.login_key,
      },
      success: (res) => {
        console.log("info-clean", res);
      }
    })
    setTimeout(() => {
      this.GetUserInfo();
    }, 500)

  },

  btn_logoff: function (e) {
    wx.request({
      method: 'POST',
      url: this.$state.apiURL + '/user/logoff',
      data: {
        login_key: this.$state.login_key,
      },
      success: (res) => {
        console.log("info-clean", res);
      }
    })
    setTimeout(() => {
      this.GetUserInfo();
    }, 500)

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }




})