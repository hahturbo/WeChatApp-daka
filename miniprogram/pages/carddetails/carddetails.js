// miniprogram/pages/carddetails/carddetails.js
const util = require('../../utils/util.js');
// const index = require('../index/index.js');
//把winHeight设为常量，不要放在data里（一般来说不用于渲染的数据都不能放在data里）
const winHeight = wx.getSystemInfoSync().windowHeight

Page({
  defaultValue: {
    type: String,
    value: ''
  },
  data: {
    login_key: '',
    apiUrl: 'http://58.218.198.18:9998',
    CardDetail: '',
    caed_id: 0,
    card_title: '',
    card_type: 0,
    begin_time: "",
    end_time: "",
    frequency_type: 0,
    time_interval: "time_interval",
    notice_time: 0,
    canBesignedNow: 0,
    // 星期
    weektext: ['日', '一', '二', '三', '四', '五', '六'],
    // 上月格子
    lastmonthgrid: [],
    // 当月格子
    thismonthday: [],
    // 下月格子
    nextmonthgrid: [],
    year: 0,
    month: 0,
    date: 0,
    datetitle: '',
    format: '',
    YEAR: 0,
    MONTH: 0,
    DATE: 0,

    dialogShow: false,
    dialogbutton: [{
      text: '删除'
    }, {
      text: '取消'
    }],
    dialogtitle: '',
    dialogtext: '',
    todaydaka: "",
    todaydaka_bgc: '',
    todaydaka_c: '',
  },
  onLoad: function () {
    this.setData({
      winH: wx.getSystemInfoSync().windowHeight,
      opacity: 1
    });
  },
  onShow: function () {
    this.getcarddetail();
    this.hide();
    this.today();
  },
  //核心方法，线程与setData
  hide: function () {
    var vm = this
    var interval = setInterval(function () {
      if (vm.data.winH > 0) {
        //清除interval 如果不清除interval会一直往上加
        clearInterval(interval)
        vm.setData({
          winH: vm.data.winH - 5,
          opacity: vm.data.winH / winHeight
        })
        vm.hide()
      }
    }, 15);
  },

  display: function (year, month, date) {
    this.setData({
      year,
      month,
      date,
      datetitle: year + '年' + this.zero(month) + '月'
    })
    this.createday(year, month);
    this.createmptygrid(year, month);
  },
  // 默认选中当天
  today: function () {
    let DATE = new Date(),
      year = DATE.getFullYear(),
      month = DATE.getMonth() + 1,
      date = DATE.getDate(),
      select = year + "-" + this.zero(month) + "-" + this.zero(date);
    this.setData({
      format: select,
      select: select,
      year: year,
      month: month,
      date: date,
      DATE: date,
      YEAR: year,
      MONTH: month,

    })
    this.display(year, month, date);
    this.triggerEvent('select', select);
  },
  // 选择对应方法
  select: function (e) {
    let date = e.currentTarget.dataset.date,
      select = this.data.year + "-" + this.zero(this.data.month) + "-" + this.zero(date);
    this.setData({
      datetitle: this.data.year + '年' + this.zero(this.data.month) + "月",
      select: select,
      year: this.data.year,
      month: this.data.month,
      date: date
    });
    this.triggerEvent('select', select);
  },
  // 上个月
  lastmonth: function () {
    let month = this.data.month == 1 ? 12 : this.data.month - 1;
    let year = this.data.month == 1 ? this.data.year - 1 : this.data.year;
    this.display(year, month, 0);
  },
  // 下个月
  nextmonth: function () {
    let month = this.data.month == 12 ? 1 : this.data.month + 1;
    let year = this.data.month == 12 ? this.data.year + 1 : this.data.year;
    this.display(year, month, 0);
  },
  // 获取当月天数
  Getthismonthday: function (year, month) {
    return new Date(year, month, 0).getDate();
  },
  zero: function (i) {
    return i >= 10 ? i : '0' + i;
  },
  // 绘制空格
  createday: function (year, month) {
    let thismonthday = [],
      days = this.Getthismonthday(year, month);
    for (let i = 1; i <= days; i++) {
      thismonthday.push({
        date: i,
        dateFormat: this.zero(i),
        monthFormat: this.zero(month),
        week: this.data.weektext[new Date(Date.UTC(year, month - 1, i)).getDay()]
      });
    }
    this.setData({
      thismonthday
    })
  },

  // 获取当月空出天数
  createmptygrid: function (year, month) {
    let week = new Date(Date.UTC(year, month - 1, 1)).getDay(),
      lastmonthgrid = [],
      nextmonthgrid = [],
      emptyday = (week == 0 ? 7 : week);
    var thismonthday = this.Getthismonthday(year, month);
    var lastmonthday = month - 1 < 0 ? this.Getthismonthday(year - 1, 12) : this.Getthismonthday(year, month - 1);
    for (let i = 1; i <= emptyday; i++) {
      lastmonthgrid.push(lastmonthday - (emptyday - i));
    }
    var next = (42 - thismonthday - emptyday) - 7 >= 0 ? (42 - thismonthday - emptyday) - 7 : (42 - thismonthday - emptyday);
    for (let i = 1; i <= next; i++) {
      nextmonthgrid.push(i);
    }
    this.setData({
      lastmonthgrid,
      nextmonthgrid
    })

  },
  // 获取打卡数据
  getcarddetail: function () {
    wx.request({
      method: "POST",
      url: this.data.apiUrl + '/user/goal/get',
      data: {
        from: 0,
        amount: 5,
        login_key: this.$state.login_key,
      },
      success: (res) => {
        console.log('get succsess');
        this.setData({
          CardDetail: res.data,
        })
      },
      fail: () => {
        console.log('get fail');
      },
      complete: () => {
        console.log(this.data.CardDetail);
        // console.log(this.data.CardDetail.data[0].goal_name);
        this.setData({
          card_id: this.data.CardDetail.data[0].goal_id,
          card_title: this.data.CardDetail.data[0].goal_name,
          card_type: this.data.CardDetail.data[0].goal_type,
          begin_time: this.data.CardDetail.data[0].started_at,
          end_time: this.data.CardDetail.data[0].ended_in,
          frequency_type: this.data.CardDetail.data[0].frequency_type,
          notice_time: this.data.CardDetail.data[0].reminder_at,
          canBesignedNow: !this.data.CardDetail.data[0].canBesignedNow,
          todaydaka: !this.data.canBesignedNow ? "今日打卡" : "今日完成",
          todaydaka_bgc: !this.data.canBesignedNow ? 'rgb(255, 153, 102)':'transparent',
          todaydaka_c: !this.data.canBesignedNow ? '#fff;':'rgb(255,153,102)',
        })
        console.log('get finish maybe succsee or fail');
      }
    })
  },
  // 滑动
  upper(e) {
    // console.log('upper')
  },

  lower(e) {
    // console.log('lower')
  },

  scroll(e) {
    // console.log('scroll')
  },

  scrollToTop() {
    this.setAction({
      scrollTop: 0
    })
  },
  // 今日打卡
  todaydaka: function () {
    console.log('jinridaka');
    if (this.data.canBesignedNow) {
      wx.request({
        url: this.data.apiUrl + '/user/goal/sign',
        data: {
          goal_id: this.data.card_id,
          login_key: this.data.login_key,
        },
        method: 'POST',
        success: (res) => {
          this.setData({
            // 只改了本地
            canBesignedNow: 0,
            todaydaka: "今日完成",
            todaydaka_bgc: 'transparent',
            todaydaka_c: 'rgb(255,153,102)',
          })
          // 服务器修改
          // wx.request({
            
          // })
          console.log('sign succsee!');
        },
        fail: (res) => {
          console.log('sign fail');
        },
        complete: (res) => {
          console.log('sign finish');
        },
      })
      console.log(this.data.canBesignedNow);
    } else {
      console.log('signed');
    }
  },
  // 删除打卡
  deletedaka: function () {
    this.setData({
      dialogshow: true,
      dialogtitle: '确定要删除此打卡吗？',
      dialogbutton: [{
          text: "删除",
          extClass: "btn_go_on"
        },
        {
          text: "取消",
          extClass: "btn_cancel"
        },
      ]
    })
    console.log('shanchudaka')
  },
  // dialog-buttontap
  buttontap: function (e) {
    console.log('button tap');
    if (e.detail.item.text == "删除") {
      console.log('删除');
      // 服务器删除
    } else {
      this.setData({
        dialogshow: false,
      })
    }
  },
})