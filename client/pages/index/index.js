//获取应用实例
const app = getApp()
// 工具类
const util = require('../../utils/util.js')
// api
const api = require('../../config/api.js')

Page({
  data: {
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    strokeColor: '#000000',
    colors: [
      {
        key: 'black',
        value: '#000000'
      },
      {
        key: 'pruple',
        value: '#0000FF'
      },
      {
        key: 'green',
        value: '#009933'
      },
      {
        key: 'bule',
        value: '#0099FF'
      },
      {
        key: 'red',
        value: '#CC3300'
      },
      {
        key: 'orange',
        value: '#FF9900'
      },
      {
        key: 'white',
        value: '#ffffff'
      }
    ],
    lineWidthOptions: [1, 5, 9, 13, 17],
    lineWidth: 1,
    topic: '',
    topicDescription: '',
    topicList: [],
    canvasHistory: [],
    currentPath: [],
    screenWidth: app.globalData.screenWidth,
    screenHeight: app.globalData.screenHeight,
    pixelRatio: app.globalData.pixelRatio,
    modalHidden: true,
    userInfo: app.globalData.userInfo,
    openId: ''
  },
  init: function () {
    // 使用 wx.createContext 获取绘图上下文 context
    this.ctx = wx.createCanvasContext('canvas')
    this.handleChangeStrokeStyle()
    this.handleSetLineCap()
  },
  // 设置线条笔触
  handleSetLineCap: function () {
    this.ctx.setLineCap('round')
  },
  // 更新线条颜色
  handleChangeStrokeColor: function(e) {
    this.setData({
      strokeColor: e.currentTarget.dataset.color
    })
  },
  // 更新绘图设置
  handleChangeStrokeStyle: function (e) {
    this.ctx.setStrokeStyle(this.data.strokeColor)
  },
  // 落笔
  handleTouchStart: function (e) {
    this.setData({
      startX: e.touches[0].x,
      startY: e.touches[0].y,
      currentX: e.touches[0].x,
      currentY: e.touches[0].y,
      currentPath: [
        {
          x: e.touches[0].x,
          y: e.touches[0].y,
          color: this.data.strokeColor,
          width: this.data.lineWidth
        }
      ]
    })
    this.ctx.beginPath()
  },
  // 移动笔触
  handleTouchMove: function (e) {
    this.ctx.moveTo(this.data.currentX, this.data.currentY)
    this.setData({
      currentX: e.touches[0].x,
      currentY: e.touches[0].y,
      currentPath: [
        ...this.data.currentPath,
        {
          x: e.touches[0].x,
          y: e.touches[0].y,
          color: this.data.strokeColor,
          width: this.data.lineWidth
        }
      ]
    })
    this.ctx.lineTo(this.data.currentX, this.data.currentY)
    this.handleDraw()
  },
  // 提笔
  handleTouchEnd: function (e) {
    // 如果落笔的坐标等于提笔的坐标 则渲染一个圆点
    if (this.data.startX === e.changedTouches[0].x && this.data.startY === e.changedTouches[0].y) {
      this.ctx.moveTo(this.data.startX, this.data.startY)
      this.ctx.lineTo(this.data.startX, this.data.startY)
      this.handleDraw()
    }
    this.ctx.closePath()
    this.setData({
      canvasHistory: [...this.data.canvasHistory, this.data.currentPath]
    })
  },
  // 路径描边 绘制
  handleDraw: function () {
    this.ctx.stroke()
    this.ctx.draw(true)
  },
  // 改变线条粗细
  handleChangeLineWidth: function (e) {
    this.setData({
      lineWidth: e.currentTarget.dataset.width
    })
    this.ctx.setLineWidth(this.data.lineWidth)
  },
  // 清空画布
  handleClearCanvas: function () {
    this.ctx.draw()
    this.setData({
      canvasHistory: []
    })
  },
  // 改变话题
  handleChangeTopic: function () {
    const topic = this.data.topicList[util.generateRandomNumber(1, this.data.topicList.length) - 1]
    this.setData({
      topic: topic.name,
      topicDescription: topic.description
    })
  },
  // 自己出题
  // handleCustomizeTopic: function () {
    // this.setData({
    //   modalHidden: false
    // })
  // },
  // 橡皮擦
  handleEraseColor: function () {
    this.setData({
      strokeColor: '#ffffff'
    })
    this.handleChangeStrokeStyle()
  },
  // 撤消
  handleUndo: function () {
    // 删除栈中最后一条记录
    const canvasHistory = this.data.canvasHistory
    if (canvasHistory.length) {
      canvasHistory.pop()
      this.setData({
        canvasHistory: canvasHistory
      })
      // 清空画布
      this.ctx.draw()
      // 遍历栈中动作并重绘
      this.data.canvasHistory.forEach(item => {
        let x = null
        let y = null
        item.forEach(child => {
          this.ctx.setStrokeStyle(child.color)
          this.ctx.setLineWidth(child.width)
          this.handleSetLineCap()
          this.ctx.beginPath()
          if (x !== null && y !== null) {
            this.ctx.moveTo(x, y)
          } else {
            this.ctx.moveTo(child.x, child.y)
          }
          this.ctx.lineTo(child.x, child.y)
          x = child.x
          y = child.y
          this.handleDraw()
        })
      })
      // 恢复画布的基本设置
      this.handleChangeStrokeStyle()
      this.ctx.setLineWidth(this.data.lineWidth)
      this.handleSetLineCap()
    }
  },
  // handleConfirmModal: function (e) {
  //   this.setData({
  //     modalHidden: true
  //   })
  // },
  // handleCloseModal: function (e) {
  //   this.setData({
  //     modalHidden: true
  //   })
  // },
  getTopicList: function () {
    wx.request({
      url: api.getTopicList,
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        this.setData({
          topicList: res.data.data,
          topic: res.data.data[0].name,
          topicDescription: res.data.data[0].description,
          topicId: res.data.data[0]._id
        })
      }
    })
  },
  // 生成要分享的图片
  handleGetShareImage: function (e) {
    wx.request({
      url: api.getAccessToken,
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        if (res.data.success) {
          wx.getImageInfo({
            src: api.getQRCode,
            success: qrcode => {
              wx.canvasToTempFilePath({
                canvasId: 'canvas',
                success: canvas => {
                  wx.uploadFile({
                    url: api.saveCanvas,
                    filePath: canvas.tempFilePath,
                    name: 'file',
                    formData: {
                      'name': this.data.userInfo.nickName,
                      'avatarUrl': this.data.userInfo.avatarUrl,
                      'openId': this.data.openId,
                      'topicId': this.data.topicId
                    },
                    success: res => {
                      const path = JSON.parse(res.data)
                      wx.setStorageSync('shareInfo', JSON.stringify({
                        topicDescription: this.data.topicDescription,
                        screenWidth: this.data.screenWidth,
                        qrcodeSrc: qrcode.path,
                        tempFilePath: canvas.tempFilePath,
                        fileName: path.data
                      }))
                      wx.navigateTo({
                        url: '/pages/share/share'
                      })
                    }
                  })
                }
              })
            }
          })
        }
      }
    })
  },
  onReady: function (e) {
    this.getTopicList()
    this.init()
  },
  onLoad: function (e) {
    app.getUserInfo(() => {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    })
    app.login(() => {
      this.setData({
        openId: app.globalData.openId
      })
    })
  }
})
