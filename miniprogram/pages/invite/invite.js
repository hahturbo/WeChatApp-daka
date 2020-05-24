// pages/invite/invite.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    invite_data:"",
    i:"1",

  },

  attached: function(){
    console.log("in5");
    setTimeout(()=>{
      this.GetInviteData();
    },200);

  },

  /**
   * 组件的方法列表
   */
  methods: {
//受邀时获取信息
GetInviteData: function(){
  console.log(  "id",this.$state.invite_goal_id, " login_key:",this.$state.login_key,);
  //测试用
  // let cache="RVtKDNuwNICvaKgU";
  // let cacheke="8ecdcd3e340d0bfbf3d6035a6c53acbb";
  console.log("正在拉取邀请信息");
  wx.request({
    method: 'POST',
    url: this.$state.apiURL+ '/user/group/get/data',
    // invite_id:this.$state.invite_id,
    data:{
      t:1,
      p:this.$state.invite_goal_id,
      login_key:this.$state.login_key,
    },
     //tmdblCLxDAJlqqbw
    success: (res)=> {
      console.log("获取邀请信息成功",res);
this.setData({
  invite_data:res.data,
  i:2,
})
      console.log(this.data.invite_data);
      } ,
    fail: function(res){
        console.log("获取邀请失败");
      }
  })
},

  }
})
