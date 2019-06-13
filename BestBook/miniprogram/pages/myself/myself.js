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
        app.globalData.userInfo = res.data[0]  //將用戶信息放入全局app中

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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({sociality: app.globalData.userInfo})
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
  },

  onmyjuzi(){
    if (!app.globalData.userInfo._openid) {
      showsucc('请先登录', 'none')
      return
    }
    wx.navigateTo({
      url: `../myJuzi/myJuzi?openid=${app.globalData.userInfo._openid}`,
    })
  },

  onmyjuji() {
    if (!app.globalData.userInfo._openid) {
      showsucc('请先登录', 'none')
      return
    }
    wx.navigateTo({
      url: `../myJuji/myJuji?openid=${app.globalData.userInfo._openid}`,
    })
  },

  onattList(){
    if (!app.globalData.userInfo._openid) {
      showsucc('请先登录','none')
      return
    }

    wx.navigateTo({
      url: `../userList/userList?att_openid=${app.globalData.userInfo._openid}`,
    })
  },

  onfanList(){
    if (!app.globalData.userInfo._openid) {
      showsucc('请先登录', 'none')
      return
    }
    wx.navigateTo({
      url: `../userList/userList?fan_openid=${app.globalData.userInfo._openid}`,
    })
  }
})