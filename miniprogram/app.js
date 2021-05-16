//app.js
import 'store.js'
import {
  toAsync
} from "./utils/request.js"
App({
  onLaunch: function () {
    wx.toAsync = toAsync
    this.globalData = {}
  },


})