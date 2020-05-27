// miniprogram/pages/cardrecord/cardrecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carddatas:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(){
    this.GetCardData();
},
slideButtonTap(e) {
    console.log('slide button tap', e.detail)
},

GetCardData: function (e) {
  wx.request({
    method: 'POST',
    url: this.$state.apiURL + '/user/goal/get',
    data: {
      from: 0,
      amount: 20,
      login_key: this.$state.login_key,
    },
    success: (res) => {
      console.log("拉取30打卡成功");
      console.log(res.data);
      this.setData({
        carddatas: res.data.data.data,
      }) 
      console.log("L30:", this.data.carddatas);      
    },
    fail: (res) => {
      console.log("获取失败： " + res);
    },
    finish:()=>{
      console.log("获取完成： ");
    }
  })
},
slideButtonTap: function(e){
console.log(e);
let gid=e.detail.data;
wx.request({
  method: 'POST',
  url: this.$state.apiURL + '/user/goal/delete',
  data: {
    login_key: this.$state.login_key,
    goal_id:gid,
  },
  success: (res) => {
    console.log("删除操作成功");
    console.log(res);
    this.onLoad();   
  },
  fail: (res) => {
    console.log("删除失败： " + res);
  },
  finish:()=>{
    console.log("删除完成： ");
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