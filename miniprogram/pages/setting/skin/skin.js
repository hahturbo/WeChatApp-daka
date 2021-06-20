// miniprogram/pages/setting/skin/skin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 1,
    skinNames: ['柠檬黄', '方格纸']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.setNavigationBarTitle({
      title: "外观设置"

    })
    wx.setNavigationBarColor({
      backgroundColor: "#ffffff",
      frontColor: '#000000'
    })

  },

  btn: function (e) {
    this.setState({
      skin: this.$state.skin == 1 ? 2 : 1,
    })
    wx.setStorage({
      key: "skin",
      data: this.$state.skin,
    })

  },
  handleTouchMove(e) {
    console.log(`touchmove${e}`);
  },
  handleTouchStart(e) {
    console.log(`touchstart${e}`);
  },
  handleTouchEnd(e) {
    console.log(`touchend${e}`);
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