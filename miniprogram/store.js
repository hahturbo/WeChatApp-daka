
// 全局变量
let store = {
  skin:1, //1初始橙 2网格白
  version:"0.1.0",
  card_num: 0,

  user_Info:'',
  can_share:false,
  invite_goal_id:'',
  msg: 'xxxxx',
  user: {},
   apiURL: "http://58.218.198.18:9998",
  // apiURL: "http://text.rookie-zheng.top:9998",
  isLogin: false,
  signed_up:"" ,
  using_day:0,
  // isLogin: true,
  login_key: null,
  aimCardData: [],
  aimCardDatas: [],
  board_num:0,
  goalsBoardData:[],
  CardData:'',
  CardDetail:'',
  CardGroupData:'',
  GoalType:['极简', '普通', '微信运动'],

  tick_title:'',
}
// 所有已加载的页面和组件
let pcList = []
function initPage() {
  let oldPage = Page
  Page = function(obj) {
    let oldOnLoad = obj.onLoad || function() {}
    let oldOnUnload = obj.onUnload || function() {}
    obj.onLoad = function() {
      // 实现store功能，onLoad的时候将state增加到Page的data中
      loadStore.call(this)
      // 实现store的setState功能
      this.setState = function(obj) {
        setState.call(this, obj)
      }
      oldOnLoad.call(this, ...arguments)
    }
    obj.onUnload = function() {
      // 把this传进function
      unloadStore.call(this)
      oldOnUnload.call(this, ...arguments)
    }
    return oldPage(obj)
  }
}
function initComponent() {
  let oldComponent = Component
  Component = function(obj) {
    let oldAttached = obj.attached || function() {}
    let oldDetached = obj.detached || function() {}
    obj.attached = function() {
      // 实现store功能，onLoad的时候将state增加到Component的data中
      loadStore.call(this)
      // 实现store的setState功能
      this.setState = function(obj) {
        setState.call(this, obj)
      }
      oldAttached.call(this, ...arguments)
    }
    obj.detached = function() {
      // 把this传进function
      unloadStore.call(this)
      oldDetached.call(this, ...arguments)
    }
    return oldComponent(obj)
  }
}
function setState(obj) {
  let keys = Object.keys(obj)
  let newObj = {}
  keys.forEach(key => {
    newObj['$state.' + key] = obj[key]
  })
  // 更新所有的组件和页面
  pcList.forEach(item => {
    item.setData(newObj)
  })
}
function loadStore() {
  // 加入pcList，待setState的时候遍历
  pcList.push(this)
  // 每个页面或组件都在data中储存一份state的引用
  this.$state = store
  this.setData({
    $state: store
  })
}
function unloadStore() {
  // 从pcList中移除
  let index = pcList.findIndex(item => {
    return item === this
  })
  if (index > -1) {
    pcList.splice(index, 1)
  }
}



initPage()
initComponent()
// ：https://blog.csdn.net/milugloomy/java/article/details/102609414

// 然后使用方式，在wxml中使用
//  <view>{{$state.msg}}</view>
// 在js中获取state和更新state
// Page({
//   //...
//   func(){
//     // 获取state中的user
//     let storeUser = this.$state.user
//     storeUser.name = 'Becky'
//     // 更新state中的user
//     this.setState({
//       user:storeUser
//     })
//   }
// })
