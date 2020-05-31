// miniprogram/pages/cardrecord/cardrecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carddatas: [],
    user_info: '',
    cardend: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.GetUserInfo();
    wx.setNavigationBarTitle({
      title: "打卡记录"

    })
    wx.setNavigationBarColor({
      backgroundColor: "#ffffff",
      frontColor: '#000000'
    })
  },
  endjudge: function (item) {
    if (this.data.carddatas[item].goal_type >= 3) {
      return 2;
    }
    let date = new Date();
    date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    date = new Date(date);
    let end = new Date(this.data.carddatas[item].ended_in);
    if (date > end) {
      return 1;
    }
    return 0;
  },
  gotocarddetail: function (e) {
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: './detail/detail?id=' + e.currentTarget.dataset.item,
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
        this.GetCardData();
      }
    })
  },
  GetCardData: function (e) {
    wx.request({
      method: 'POST',
      url: this.$state.apiURL + '/user/goal/get',
      data: {
        from: 0,
        amount: this.data.user_info.goal_num,
        login_key: this.$state.login_key,
      },
      success: (res) => {
        console.log("拉取30打卡成功");
        console.log(res.data);
        this.setData({
          carddatas: res.data.data.data,
        })
        console.log("L30:", this.data.carddatas);
        let cardend = [];
        for (let i = 0; i < this.data.user_info.goal_num; i++) {
          cardend[i] = this.endjudge(i)
        }
        console.log(cardend);
        this.setData({
          cardend: cardend
        })
      },
      fail: (res) => {
        console.log("获取失败： " + res);
      },
      finish: () => {
        console.log("获取完成： ");
      }
    })
  },
  slideButtonTap: function (e) {
    console.log(e);
    let gid = e.detail.data;
    wx.request({
      method: 'POST',
      url: this.$state.apiURL + '/user/goal/delete',
      data: {
        login_key: this.$state.login_key,
        goal_id: gid,
      },
      success: (res) => {
        console.log("删除操作成功");
        console.log(res);
        this.onLoad();
      },
      fail: (res) => {
        console.log("删除失败： " + res);
      },
      finish: () => {
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