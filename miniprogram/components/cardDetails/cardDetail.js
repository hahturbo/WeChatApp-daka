// components/cardDetails/cardDetail.js
import moment from 'moment';
const awx = wx.toAsync("request", "login", "getWeRunData", "getUserInfo")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    carditem: {
      type: Number,
      value: "",
    },
    endtime: {
      type: String,
      value: "",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    item: 0,
    reminder_Array: [
      "打卡时",
      "提前5分钟",
      "提前10分钟",
      "提前15分钟",
      "提前30分钟",
      "提前一小时",
    ],
    // 星期
    weektext: ["日", "一", "二", "三", "四", "五", "六"],
    // 上月格子
    lastmonthgrid: [],
    // 当月格子
    thismonthday: [],
    // 下月格子
    nextmonthgrid: [],
    year: 0,
    month: 0,
    date: 0,
    datetitle: "",
    format: "",
    YEAR: 0,
    MONTH: 0,
    DATE: 0,
    secondselect: 0,
    todaysigned: true,
    cardend: false,
    membersnum: 0,
    share: false,
    //微信运动
    stepInfoList: "",
  },

  observers: {
    carditem: function (carditem) {
      this.setData({
        item: carditem,
      })
    },
  },
  attached: function () {
    this.initCardDetail()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    initCardDetail: function () {
      (async () => {
        if (this.$state.CardData[this.data.item].goal_type == 2) {
          this.getWeRunData()
          if (this.$state.CardData[this.data.item].goal_type == 2 && parseInt(this.data.stepInfoList[this.data.stepInfoList.length - 1].step) >= parseInt(this.$state.CardData[this.data.item].goal_name.replace(/[^\d]/g, ""))) {
            await awx.request({
              method: "POST",
              url: this.$state.apiURL + "/user/goal/sign",
              data: {
                goal_id: this.$state.CardData[i].goal_id,
                login_key: this.$state.login_key,
              },
            })
          }
        }
        if (this.$state.CardData[this.data.item].goal_is_a_group) {
          this.setState({
            CardGroupData: this.$state.CardData[this.data.item].groupData,
          })
        } else {
          this.setState({
            CardGroupData: "",
          })
        }
        console.log(this.$state.CardGroupData)
        // 获取打卡记录
        let record = await awx.request({
          method: "POST",
          url: this.$state.apiURL + "/user/getSignedRecord",
          data: {
            goal_id: this.$state.CardData[this.data.item].goal_id,
            login_key: this.$state.login_key,
          },
        })
        if (record.errMsg === "request:fail ") {
          console.log(record.errMsg)
          return
        }
        this.setState({
          CardDetail: record.data.data
        })
        this.today()
        const endflag = this.comparedate()
        if (endflag) {
          this.setData({
            cardend: endflag
          })
        }
      })()
    },
    display: function (year, month, date) {
      this.setData({
        year: year,
        month: month,
        date: date,
        datetitle: year + "年" + this.zero(month) + "月",
      })
      // console.log(JSON.stringify(this.data, null, 2))
      this.createday(year, month)
      this.createmptygrid(year, month)
    },
    // 比较当天和结束时间选择
    comparedate: function () {
      // 对待极简和运动的
      let end = new Date(this.$state.CardData[this.data.item].ended_in)
      let today = new Date(this.data.select)
      if (end < today && this.$state.CardData[this.data.item].goal_type == 4) {
        today = end
      } else if (
        this.$state.CardData[this.data.item].goal_type != 3 && this.$state.CardData[this.data.item].goal_type != 5
      ) {
        return false // false代表还没结束
      }
      this.setData({
        select: this.$state.CardData[this.data.item].ended_in,
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        date: today.getDate(),
        datetitle: today.getFullYear() + "年" + this.zero(today.getMonth() + 1) + "月",
      })
      this.display(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate()
      )
      return true
    },
    // 默认选中当天
    today: function () {
      let DATE = new Date(),
        year = DATE.getFullYear(),
        month = DATE.getMonth() + 1,
        date = DATE.getDate(),
        select = year + "-" + this.zero(month) + "-" + this.zero(date)
      console.log(`DATE:${DATE},year:${year},month:${month},date:${date},select:${select}`)
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
      this.display(year, month, date)
    },
    // 选择对应方法
    select: function (e) {
      let second = this.data.secondselect
      if (second == 0 && this.data.date == e.currentTarget.dataset.date) {
        second = 1
      } else if (second == 1) {
        second = 0
      }
      let date = e.currentTarget.dataset.date,
        select = this.data.year + "-" + this.zero(this.data.month) + "-" + this.zero(date)
      this.setData({
        datetitle: this.data.year + "年" + this.zero(this.data.month) + "月",
        select: select,
        year: this.data.year,
        month: this.data.month,
        date: date,
        secondselect: second,
      })
    },
    // 上个月
    lastmonth: function () {
      let month = this.data.month == 1 ? 12 : this.data.month - 1
      let year = this.data.month == 1 ? this.data.year - 1 : this.data.year
      this.display(year, month, 0)
    },
    // 下个月
    nextmonth: function () {
      let month = this.data.month == 12 ? 1 : this.data.month + 1
      let year = this.data.month == 12 ? this.data.year + 1 : this.data.year
      this.display(year, month, 0)
    },
    // 获取当月天数
    Getthismonthday: function (year, month) {
      return new Date(year, month, 0).getDate()
    },
    zero: function (i) {
      return i >= 10 ? i : "0" + i
    },
    // 绘制空格
    createday: function (year, month) {
      let thismonthday = [],
        days = this.Getthismonthday(year, month)
      for (let i = 1; i <= days; i++) {
        thismonthday.push({
          date: i,
          dateFormat: this.zero(i),
          monthFormat: this.zero(month),
          week: new Date(Date.UTC(year, month - 1, i)).getDay(),
          signed: this.todaysigned(year, month, i),
          signedmembers: this.todaysignedmembers(year, month, i),
          othersigned: this.data.membersnum > 0 ? true : false,
        })
      }
      // console.log(thismonthday);
      this.setData({
        thismonthday,
      })
    },

    // 获取当月空出天数
    createmptygrid: function (year, month) {
      let week = new Date(Date.UTC(year, month - 1, 1)).getDay(),
        lastmonthgrid = [],
        nextmonthgrid = [],
        emptyday = week == 0 ? 7 : week
      let thismonthday = this.Getthismonthday(year, month)
      let lastmonthday = month - 1 < 0 ? this.Getthismonthday(year - 1, 12) : this.Getthismonthday(year, month - 1)
      for (let i = 1; i <= emptyday; i++) {
        lastmonthgrid.push(lastmonthday - (emptyday - i))
      }
      let next = 42 - thismonthday - emptyday - 7 >= 0 ? 42 - thismonthday - emptyday - 7 : 42 - thismonthday - emptyday
      for (let i = 1; i <= next; i++) {
        nextmonthgrid.push(i)
      }
      this.setData({
        lastmonthgrid,
        nextmonthgrid,
      })
    },
    getCardDetail: function () {
      (async () => {
        // 获取打卡详情
        let result = await awx.request({
          method: "POST",
          url: this.$state.apiURL + "/user/goal/get",
          data: {
            login_key: this.$state.login_key,
          },
        })
        if (result.errMsg === "request:fail ") {
          console.log(result.errMsg)
          return
        }
        console.log(result.data)
        this.setState({
          CardData: result.data.data.data
        })
      })()
    },

    getWeRunData: function () {
      (async () => {
        let wWeRun = await awx.getWeRunData()
        if (wWeRun.encryptedData) {
          // 微信获取运动成功
          let weRunData = await awx.request({
            method: 'POST',
            url: this.$state.apiURL + '/user/getWeRunData',
            data: {
              encryptedData: wWeRun.encryptedData,
              iv: wWeRun.iv,
              login_key: this.$state.login_key,
            },
          })
          if (weRunData.errMsg === "request:fail ") {
            wx.showToast({
              icon: 'error',
              title: '微信运动获取失败',
              duration: 1500,
            })
            return
          }
          console.log("werun success")
          this.setData({
            stepInfoList: weRunData.data.stepInfoList
          })
        } else {
          console.log("微信步数获取失败：");
          wx.showToast({
            icon: 'error',
            title: '微信运动获取失败',
            duration: 1500,
          })
        }
        console.log("111")
      })()
    },

    // this.log.data => this.$state.CardDetail[this.properties.carditem]
    // 获取时间戳
    getTimestamp: function (e) {
      let date = e.signed_at
      date = date.substring(0, 19)
      date = date.replace(/-/g, "/")
      return new Date(date)
    },
    // 是否打卡
    todaysigned: function (year, month, date) {
      // console.log(this.$state.CardDetail);
      for (let i = 0; i < this.$state.CardDetail.length; i++) {
        if (this.$state.CardData[this.data.item].goal_id == this.$state.CardDetail[i].goal_id) {
          if (this.getTimestamp(this.$state.CardDetail[i]).getFullYear() == year && this.getTimestamp(this.$state.CardDetail[i]).getMonth() + 1 == month && this.getTimestamp(this.$state.CardDetail[i]).getDate() == date) {
            return true
          }
        }
      }
      return false
    },
    // groupData[i].signed_data -> singned_data
    todaysignedmembers: function (year, month, date) {
      if (!this.$state.CardGroupData || this.$state.CardGroupData == -11)
        return null
      let members = [],
        groupData = this.$state.CardGroupData.groupMembers,
        goal_id = this.$state.CardGroupData.goal_id
      let user_id, img, i, j
      for (i = 0; i < groupData.length; i++) {
        let singned_data = groupData[i].signed_data
        user_id = groupData[i].id
        img = ""
        for (j = 0; j < singned_data.length; j++) {
          if (
            singned_data[j].goal_id == goal_id &&
            user_id == singned_data[j].user_id
          ) {
            if (
              this.getTimestamp(singned_data[j]).getFullYear() == year && this.getTimestamp(singned_data[j]).getMonth() + 1 == month && this.getTimestamp(singned_data[j]).getDate() == date
            ) {
              img = groupData[i].img
              break
            }
          }
        }
        if (1 && img.length) {
          // console.log(img);
          members.push({
            user_id: user_id,
            img: img,
          })
        }
      }
      this.setData({
        membersnum: members.length,
      })
      return members
    },
    todaydaka: function (e) {
      (async () => {
        let result = await awx.request({
          method: "POST",
          url: this.$state.apiURL + "/user/goal/sign",
          data: {
            goal_id: this.$state.CardData[this.data.carditem].goal_id,
            login_key: this.$state.login_key,
          },
        })
        if (result.errMsg === "request:fail ") {
          console.log(result.errMsg)
          return
        }
        console.log(result.data)
        this.getCardDetail()
      })()
      // if (this.$state.CardData[this.data.item].goal_type == 2 && parseInt(this.data.stepInfoList[this.data.stepInfoList.length - 1].step) < parseInt(this.$state.CardData[this.data.item].goal_name.replace(/[^\d]/g, ""))) {
      //   wx.showToast({
      //     title: "您的步数不够哦！",
      //     image: "../../images/Step.png",
      //     duration: 2000,
      //   })
      //   return
      // }
    },
    deletedaka: function () {
      this.setData({
        dialogshow: true,
        dialogtitle: "确定要删除此打卡吗？",
        dialogbutton: [{
            text: "删除",
            extClass: "btn_go_on",
          },
          {
            text: "取消",
            extClass: "btn_cancel",
          },
        ],
      })
      console.log("shanchudaka")
    },
    // dialog-buttontap
    buttontap: function (e) {
      (async () => {
        if (e.detail.item.text == "删除") {
          if (this.$state.CardData[this.data.item].goal_is_a_group) {
            // 是小组
            if (
              !this.$state.CardData[this.data.item].groupData
              .is_group_creator
            ) {
              await wx.showToast({
                title: "您不是组长，没有权限删除！",
                icon: "none",
                duration: 2000,
              })
              this.setData({
                dialogshow: false,
              })
              return
            }
          }
          let result
          if (this.$state.CardData[this.data.item].goal_type == 0) {
            // 极简
            result = await awx.request({
              url: this.$state.apiURL + "/user/goal/edit",
              method: "POST",
              data: {
                goal_id: this.$state.CardData[this.data.item].goal_id,
                login_key: this.$state.login_key,
                now_type: 0,
                goal_type: 3,
                goal_name: this.$state.CardData[this.data.item].goal_name,
              },
            })
          } else if (this.$state.CardData[this.data.item].goal_type == 2) {
            // 运动
            result = await awx.request({
              url: this.$state.apiURL + "/user/goal/edit",
              method: "POST",
              data: {
                goal_id: this.$state.CardData[this.data.item].goal_id,
                login_key: this.$state.login_key,
                now_type: 2,
                goal_type: 5,
                goal_name: this.$state.CardData[this.data.item].goal_name,
                frequency: this.$state.CardData[this.data.item].frequency,
              },
            })
          } else if (this.$state.CardData[this.data.item].goal_type == 1) {
            // 普通
            result = await awx.request({
              url: this.$state.apiURL + "/user/goal/edit",
              method: "POST",
              data: {
                goal_id: this.$state.CardData[this.data.item].goal_id,
                login_key: this.$state.login_key,
                now_type: 1,
                goal_type: 4,
                goal_name: this.$state.CardData[this.data.item].goal_name,
                started_at: this.$state.CardData[this.data.item].started_at,
                ended_in: this.$state.CardData[this.data.item].ended_in,
                frequency: this.$state.CardData[this.data.item].frequency,
                frequency_type: this.$state.CardData[this.data.item].frequency_type,
                reminder_at: this.$state.CardData[this.data.item].reminder_at,
                needed_be_signed_at: this.$state.CardData[this.data.item].needed_be_signed_at,
                needed_be_signed_deadline: this.$state.CardData[this.data.item].needed_be_signed_deadline,
              },
            })
          }
          if (result.errMsg === "request:fail ") {
            console.log(result.errMsg)
            return
          }
          this.setData({
            dialogshow: false,
          })
          this.triggerEvent("deleteEvent", "delete")
        } else {
          this.setData({
            dialogshow: false,
          })
        }
      })()
      console.log("button tap")

    },
  },
})