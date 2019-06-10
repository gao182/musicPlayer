// miniprogram/pages/others/others.js
import { showerr, getuser, getuserJuzi, getImginfo } from "../../src/database"

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowjuzi: true,
    userInfo: {
      popularity: 0,
      attention: 0,
      fan: 0
    },
    userjuzi: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.uid === app.globalData.openid) {
      wx.switchTab({
        url: '../myself/myself'
      })
    }else{
      getuser(options.uid).then(res => {
        this.setData({ userInfo: res.data[0] })
      }).catch(() => showerr('查询失败'))
      this.getuserAll(options.uid,"desc")
    }
  },

  //查询用户句子
  getuserAll(uid,str){
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
        this.setData({userjuzi: data})
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
  /*显示句子表单*/
  showJuzi() {
    this.setData({
      isShowjuzi: true
    })
  },
  /*显示句集表单*/
  showJuji() {
    this.setData({
      isShowjuzi: false
    })
  }
})