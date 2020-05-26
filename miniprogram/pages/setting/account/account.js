// miniprogram/pages/setting/account/account.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_info:"",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
this.GetUserInfo();
  },

  GetUserInfo: function(){
    wx.request({
      method: 'POST',
      url: this.$state.apiURL+ '/user/info',
      data: {
        login_key: this.$state.login_key,
      },
      success: (res) => {
        console.log("info-p", res.data);
this.setData({
  user_info:res.data.data,
})
      }
    })

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