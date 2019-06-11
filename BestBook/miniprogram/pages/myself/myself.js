// miniprogram/pages/myself/myself.js
import { showsucc, showerr, adduser, getuser, setuser, setJuzi, getuserallJuzi } from "../../src/database"
const app = getApp()
Page({
  data: {
    logged: false,
    userInfo: {
      avatarUrl: './user-unlogin.png',
      nickName: '点击头像'
    },
    sociality: {}
  },
  onLoad: function (options) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              //设置用户头像
              app.globalData.userInfo = {
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName
              }

              //得到openid
              wx.cloud.callFunction({
                name: 'login',
                data: {}
              }).then(res => {
                app.globalData.userInfo._openid = res.result.openid
                this.getAllQuery()
              }).catch(err => {
                console.error(err.Error)
              })
            }
          })
        }
      }
    })
  },
  getAllQuery() {
    this.setData({ userInfo: app.globalData.userInfo })
    getuser(app.globalData.userInfo._openid).then(res => {
      if (res.data.length <= 0) {
        adduser(this.data.userInfo)
      } else {
        app.globalData.userInfo._id = res.data[0]._id  //將用戶信息放入全局app中
        app.globalData.userInfo.popularity = res.data[0].popularity
        app.globalData.userInfo.attention = res.data[0].attention
        app.globalData.userInfo.fan = res.data[0].fan

        this.setData({ sociality: app.globalData.userInfo })
        showsucc('成功登录')

        if (res.data[0].avatarUrl !== this.data.userInfo.avatarUrl || res.data[0].nickName !== this.data.userInfo.nickName){
          setuser(res.data[0]._id, 'userinfo', this.data.userInfo)
          .then(() => showsucc('更新用户信息')).catch(() => showerr('更新信息失败'))
          getuserallJuzi(res.data[0]._openid).then(res => {
            res.data.forEach(e => {
              setJuzi(e._id, 'user', this.data.userInfo)
            })
          })
        }
      }
    }).catch(()=>showerr('查询用户失败'))
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
    this.setData({sociality: app.globalData.userInfo})
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

  /*点击获取用户信息*/
  onGetUserInfo(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        userInfo: {
          avatarUrl: e.detail.userInfo.avatarUrl,
          nickName: e.detail.userInfo.nickName
        }
      })
    }
    this.onLoad()
  }
})