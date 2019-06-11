// miniprogram/pages/myJuji/myJuji.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNew: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!app.globalData.userInfo._openid) {
      wx.showToast({
        icon: 'none',
        title: '请先登录',
        success() {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      })
    }
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

  },

  /*显示最新*/
  showNew() {
    this.setData({
      isNew: true
    })
  },

  /*显示最热*/
  showHot() {
    this.setData({
      isNew: false
    })
  }
})