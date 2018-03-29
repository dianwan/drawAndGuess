// pages/share/share.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    screenWidth: 0,
    fileName: ''
  },
  /**
   * 初始化
   */
  init: function () {
    wx.getStorage({
      key: 'shareInfo',
      success: res => {
        const data = JSON.parse(res.data)
        this.setData({
          screenWidth: data.screenWidth,
          fileName: data.fileName
        })
        const width = data.screenWidth / 2
        const ctx = wx.createCanvasContext('share')
        ctx.drawImage(data.tempFilePath, 0, 0, width, width)
        ctx.drawImage(data.qrcodeSrc, width, 0, width, width)
        ctx.setFontSize(32)
        ctx.setTextAlign('center')
        ctx.fillText('猜猜看我画的是什么', width, width + 30)
        ctx.setFontSize(20)
        ctx.fillText(`提示：${data.topicDescription}`, width, width + 62)
        ctx.draw()
      }
    })
  },
  onShareAppMessage: function () {
    return {
      path: `/pages/detail/detail?fileName=${this.data.fileName}`
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  }
})