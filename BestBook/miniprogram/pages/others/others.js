// miniprogram/pages/others/others.js
import { getuser, getusernewJuzi, getImginfo } from "../../src/database"

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowjuzi: true,
    userInfo: {
      popularity: 0,
      attention: [],
      fan: []
    },
    userjuzi: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.uid === app.globalData.userInfo._openid) {
      wx.switchTab({
        url: '../myself/myself'
      })
    }else{
      getuser(options.uid).then(res => {
        this.setData({ userInfo: res.data[0] })
      }).catch(() => showsucc('查询失败','none'))
      this.getuserAll(options.uid,0)
    }
  },

  //查询用户句子
  getuserAll(uid,n){
    wx.showLoading({
      title: '加载中',
    })
    getusernewJuzi(uid,n).then(res => {
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
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
  },

  onattList() {
    wx.navigateTo({
      url: `../userList/userList?att_openid=${this.data.userInfo._openid}`,
    })
  },

  onfanList() {
    wx.navigateTo({
      url: `../userList/userList?fan_openid=${this.data.userInfo._openid}`,
    })
  }
})