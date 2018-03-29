const host = require('../../config/host')
const api = require('../../config/api')
const utils = require('../../utils/util')
const app = getApp()

// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasId: '',
    canvasUrl: '',
    fileName: '',
    topicName: '',
    topicDescription: '',
    userName: '',
    userAvatarUrl: '',
    respondentName: '',
    respondentAvatarUrl: '',
    openId: '',
    screenWidth: app.globalData.screenWidth,
    disabled: true,
    page: {
      currentPage: 1,
      pageSize: 5,
      totalItem: 0
    },
    params: {
      offset: 0,
      length: 0
    },
    commentList: [],
    commented: false
  },
  // 获取答案列表
  getCommentList: function (offset, length) {
    wx.request({
      url: api.getComment,
      data: {
        canvasId: this.data.canvasId,
        offset,
        length,
        openId: this.data.openId
      },
      success: res => {
        this.setData({
          commented: res.data.commented
        })
        if (res.data.data.length) {
          this.setData({
            commentList: []
          })
          this.setData({
            commentList: [
              ...this.data.commentList,
              ...res.data.data.map(item => {
                return {
                  answer: item.answer,
                  avatarUrl: item.avatarUrl,
                  canvasId: item.canvasId,
                  name: item.name,
                  createTime: utils.formatTime(new Date(item.createTime))
                }
              })
            ],
            page: {
              currentPage: this.data.page.currentPage,
              pageSize: this.data.page.pageSize,
              totalItem: res.data.totalItem
            }
          })
        }
      }
    })
  },
  // 加载更多
  handleLoadMore: function (e) {
    this.setData({
      page: {
        currentPage: this.data.page.currentPage + 1,
        pageSize: this.data.page.pageSize
      },
      params: {
        offset: this.data.page.currentPage * this.data.page.pageSize,
        length: this.data.page.pageSize
      }
    })
    this.getCommentList(this.data.params.offset, this.data.params.length)
  },
  // 处理失焦
  handleInputEvent: function (e) {
    this.setData({
      disabled: !e.detail.value
    })
  },
  //提交答案
  handleSubmitAnswer: function (e) {
    wx.request({
      method: 'POST',
      url: api.saveComment,
      data: {
        answer: e.detail.value.answer,
        name: this.data.respondentName,
        avatarUrl: this.data.respondentAvatarUrl,
        canvasId: this.data.canvasId,
        openId: this.data.openId
      },
      success: res => {
        if (res.data.commented) {
          this.setData({
            commented: true
          })
        }
        // 初始化列表
        this.getCommentList(0, this.data.page.pageSize)
      }
    })
  },
  handleNavigateToDrawPage: function (e) {
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 存参
    this.setData({
      fileName: options.fileName
    })
    wx.request({
      url: api.getDetail,
      data: {
        fileName: this.data.fileName
      },
      success: res => {
        const data = res.data.data
        // 获取回答者用户信息
        app.getUserInfo(() => {
          this.setData({
            // openId: this.data.openId,
            respondentName: app.globalData.userInfo.nickName,
            respondentAvatarUrl: app.globalData.userInfo.avatarUrl
          })
          this.setData({
            topicName: data.topicInfo.name,
            topicDescription: data.topicInfo.description,
            userName: data.userInfo.name,
            userAvatarUrl: data.userInfo.avatarUrl,
            canvasId: data._id,
            canvasUrl: `${host.staticUrl}${data.path}${data.fileName}${data.suffix}`
          })
          // 获取登录信息
          app.login(() => {
            this.setData({
              openId: app.globalData.openId
            })
            // 初始化列表
            this.getCommentList(0, this.data.page.pageSize)
          })
        })
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