// components/cardDetails/cardDetail.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    carditem: {
      type: Number,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    item: 0,
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
    secondselect: 0,
    todaysigned: true,
    todaydaka: '',
    todaydaka_bgc: '',
    todaydaka_c: '',
  },

  observers: {
    'carditem': function (carditem) {
      this.setData({
        item: carditem,
      })
    }
  },
  lifetimes: {
    ready: function () {
      this.getcarddetail();
      this.today();
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
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
      // this.triggerEvent('select', select);
    },
    // 选择对应方法
    select: function (e) {
      let second = this.data.secondselect;
      if (second == 1 && this.data.date == e.currentTarget.dataset.date) {
        if (!this.$state.CardGroupData) {
          this.getGroupdata();
        }
        second = 2;
      } else {
        second = 1;
      }
      let date = e.currentTarget.dataset.date,
        select = this.data.year + "-" + this.zero(this.data.month) + "-" + this.zero(date);
      this.setData({
        datetitle: this.data.year + '年' + this.zero(this.data.month) + "月",
        select: select,
        year: this.data.year,
        month: this.data.month,
        date: date,
        secondselect: second
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
          week: new Date(Date.UTC(year, month - 1, i)).getDay(),
          signed: this.todaysigned(year, month, i),
        });
      }
      // console.log(thismonthday);
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
    getcarddetail: function () {
      wx.request({
        method: "POST",
        url: this.$state.apiURL + '/user/getSignedRecord',
        data: {
          from: 0,
          amount: 50,
          login_key: this.$state.login_key,
        },
        success: (res) => {
          console.log('get succsess');
          this.setState({
            CardDetail: res.data.data,
          })
        },
        complete: () => {
          console.log(this.$state.CardDetail);
        }
      });
      wx.request({
        method: "POST",
        url: this.$state.apiURL + '/user/goal/get',
        data: {
          from: 0,
          amount: 10,
          login_key: this.$state.login_key,
        },
        success: (res) => {
          console.log('get succsess');
          this.setState({
            aimCardDatadetail: res.data.data.data,
          })
          console.log(this.$state.aimCardDatadetail);
        },
        fail: () => {
          console.log('get aimcarddetail fail');
        },
        complete: () => {
          // console.log(this.$state.aimCardDatadetail);
          this.setData({
            todaydaka: (1 & this.$state.aimCardDatadetail[this.data.item].canBeSignedNow) ? "今日打卡" : "今日完成",
            todaydaka_bgc: (this.$state.aimCardDatadetail[this.data.item].canBeSignedNow & 1) ? 'rgb(255, 153, 102)' : 'transparent',
            todaydaka_c: (this.$state.aimCardDatadetail[this.data.item].canBeSignedNow & 1) ? '#fff;' : 'rgb(255,153,102)',
          })
          // console.log('get finish maybe succsee or fail');
        }
      })
    },
    getGroupdata: function () {
      wx.request({
        url: this.$state.apiURL + '/user/group/get/data',
        method: 'POST',
        data: {
          t: 0,
          p: this.$state.aimCardDatadetail[this.data.item].goal_id,
          login_key: this.$state.login_key,
        },
        success: (res) => {
          this.setState({
            CardGroupData: res.data,
          })
          console.log(this.$state.CardGroupData);
        },
        fail: (res) => {
          console.log(res.code);
        }
      })
    },
    // this.log.data => this.$state.CardDetail[this.properties.carditem]
    // 获取时间戳
    getTimestamp: function (e) {
      var date = e.signed_at;
      date = date.substring(0, 19)
      date = date.replace(/-/g, '/');
      return new Date(date);
    },
    // 是否打卡
    todaysigned: function (year, month, date) {
      // console.log(this.$state.CardDetail);
      for (let i = 0; i < this.$state.CardDetail.length; i++) {
        if (this.$state.aimCardDatadetail[this.data.item].goal_id == this.$state.CardDetail[i].goal_id) {
          if (this.getTimestamp(this.$state.CardDetail[i]).getFullYear() == year &&
            this.getTimestamp(this.$state.CardDetail[i]).getMonth() + 1 == month &&
            this.getTimestamp(this.$state.CardDetail[i]).getDate() == date) {
            return true;
          }
        }
      }
      return false;
    },
    todaydaka: function (e) {
      if (this.$state.aimCardDatadetail[this.data.item].canBeSignedNow & 1) {
        wx.request({
          method: 'POST',
          url: this.$state.apiURL + '/user/goal/sign',
          data: {
            goal_id: this.$state.aimCardDatadetail[this.data.carditem].goal_id,
            login_key: this.$state.login_key,
          },
          success: (res) => {
            this.getcarddetail();
            console.log('sign succsee!');
          },
          fail: () => {
            console.log('sign fail');
          },
        })
      } else {
        console.log('signed');
      }
    },
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
    // sonsign: function (e) {
    //   if (e.detail === 'sign') {
    //     console.log('get sign');
    //     this.getcarddetail();
    //     this.today();
    //   } else {
    //     console.log('get sign fail');
    //   }
    // },
  }
})