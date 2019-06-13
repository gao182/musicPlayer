// miniprogram/pages/myJuzi/myJuzi.js
import { showerr, getuserJuzi, getImginfo } from "../../src/database"

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNew: true,
    newjuzi: {},
    hotjuzi: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!app.globalData.userInfo._openid) {
      showerr('请先登录')
    }
    this.getMyjuzi(app.globalData.userInfo._openid,"desc")
  },


  //查询用户句子
  getMyjuzi(uid,str) {
    wx.showLoading({
      title: '加载中',
    })
    getuserJuzi(uid,str).then(res => {
      wx.hideLoading()
      let data = res.data
      getImginfo(res.data).then(res => {
        let hotimg = res.fileList
        hotimg.forEach(e1 => {
          data.forEach(e2 => {
            if (e2.imgUrl === e1.fileID) {
              e2.imgUrl = e1.tempFileURL
              return
            }
          })
        })
        data.forEach(e => {
          let t = new Date(e.time)
          e.time = t.toLocaleDateString() + ' ' + t.toLocaleTimeString()
        })
        if (this.data.isNew)
          this.setData({ newjuzi: data })
        else
          this.setData({ hotjuzi: data })
      })
    })
  }, 

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

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
    this.getMyjuzi(app.globalData.userInfo._openid, "asc")
  }
})