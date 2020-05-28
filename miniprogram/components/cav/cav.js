// components/cav/cav.js
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
    shareTempFilePath: '',
    imageFile: ''
  },


  attached: function () {
    console.log("onloadcav");
    setTimeout(() => {
      this.Drawshare();
    }, 50);

  },



  /**
   * 组件的方法列表
   */
  methods: {
    Drawshare: function () {
      let name = this.$state.tick_title;
      console.log("draw", name)
      // res.path='../../images/tick-YES.png'
      const ctx = wx.createCanvasContext("share", this)
      //var ctx = wx.createContext()
      console.log(wx);
      ctx.setFillStyle('white');
      ctx.fillRect(0, 0, 300, 400);
      ctx.setTextAlign('center') // 文字居中
      ctx.setFillStyle('#000000') // 文字颜色：黑色
      ctx.setFontSize(33) // 文字字号：
      ctx.fillText("[达成目标]", 150, 70);
      ctx.fillText(name, 150, 130);
      ctx.setFontSize(20)
      ctx.fillText("我做到了！", 120, 230);
      ctx.drawImage('../../images/tick-YES.png', 15, 200, 250, 200)
      //ctx.draw(true, this.SavePic)
      ctx.draw(true, () => {
        this.canvasToTempFilePath({
          canvasId: 'share',
        }, this).then(({
          tempFilePath
        }) => this.setData({
          imageFile: tempFilePath
        }))
      })
      setTimeout(() => { this.handleSave();
        
      }, 100);
    },
//https://www.jianshu.com/p/7d47e52de73c
    canvasToTempFilePath: function (option, context) {
      console.log("CTTF");
      return new Promise((resolve, reject) => {
        wx.canvasToTempFilePath({
          ...option,
          success: resolve,
          fail: reject,
        }, context)
      })
    },

    saveImageToPhotosAlbum: function (option) {
      console.log("SITPA");
      return new Promise((resolve, reject) => {
        wx.saveImageToPhotosAlbum({
          ...option,
          success: resolve,
          fail: reject,
        })
      })
    },

    handleSave() {
      const {
        imageFile
      } = this.data
      if (imageFile) {
        this.saveImageToPhotosAlbum({
          filePath: imageFile,
        }).then(() => {
          wx.showToast({
            icon: 'none',
            title: '分享图片已保存至相册',
            duration: 2000,
          })
        })
      }
    },

    // SavePic: function () {
    //   console.log("保存ing")
    //   wx.canvasToTempFilePath({
    //     fileType: 'jpg',
    //     canvasId: 'share',
    //     success: (res) => {
    //       if (!res.tempFilePath) {
    //         console.log("fff")
    //       }
    //       console.log("保存ing2")
    //       // wx.saveImageToPhotosAlbum({
    //       //   filePath: res.tempFilePath,
    //       //   success: (res) => {
    //       //     console.log("保存成功")
    //       //   }
    //       // })
    //     },
    //     fail: (res) => {
    //       console.log("保存f：", res)
    //     },
    //     finish: (res) => {
    //       console.log("保存：", res)
    //     }
    //   }, this)
    // }

  }
})