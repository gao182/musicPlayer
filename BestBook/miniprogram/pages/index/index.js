// miniprogram/pages/indexs/index.js
import { showsucc, showerr, getJuzi, setJuzi, setuser, getImginfo } from "../../src/database"

const app = getApp()
Page({
  data: {
    userInfo: {},
    whoshow: 2,
    isSearch: false,
    hotjuzi: {},
    newjuzi: {},
    attjuzi: {},
    attwho: "",
    noattwho: "",
    shownewCount: 0,
    showattCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    /*查询最热句子*/
    this.getJuzi('asc')
  },

  /*查询句子*/
  getJuzi(str) {
    //查询句子
    wx.showLoading({
      title: '加载中',
    })
    getJuzi(str).then(res => {
      let data = res.data
      getImginfo(res.data).then(res => {
        wx.hideLoading() //隐藏加载
        let hotimg = res.fileList
        data.forEach(e => {
          let t = new Date(e.time)
          e.time = t.toLocaleDateString() + ' ' + t.toLocaleTimeString()
          e.imgUrl = hotimg.find(e2 => {
            return e2.fileID === e.imgUrl
          }).tempFileURL

          if (app.globalData.userInfo._id) {
            e.isattention = this.data.userInfo.attention.find(e2 => {
              return e2 === e._openid
            }) ? true : false
          }
        })
        if (this.data.whoshow === 1)
          this.setData({
            attjuzi: data
          })
        else if (this.data.whoshow === 2)
          this.setData({
            hotjuzi: data
          })
        else if (this.data.whoshow === 3)
          this.setData({
            newjuzi: data
          })
      })
    }).catch(err => {
      wx.hideLoading()
      showerr('查询记录失败')
      this.getJuzi()
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (!app.globalData.userInfo._id) {
      return
    }
    this.setData({
      userInfo: app.globalData.userInfo
    })
    let hotdata = this.data.hotjuzi
    let newdata = this.data.newjuzi
    let attentionArr = this.data.userInfo.attention

    if (hotdata.length) {
      hotdata.forEach(e => {
        e.isattention = attentionArr.find(e2 => {
          return e2 === e._openid
        }) ? true : false
      })
    }
    if (newdata.length) {
      newdata.forEach(e => {
        e.isattention = attentionArr.find(e2 => {
          return e2 === e._openid
        }) ? true : false
      })
    }
    this.setData({
      hotjuzi: hotdata,
      newjuzi: newdata
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    if (this.data.whoshow === 1) {} else if (this.data.whoshow === 2) {
      /*查询最热句子*/
      this.getJuzi('asc')
    } else {
      /*查询最新句子*/
      this.getJuzi('desc')
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /*显示关注页面*/
  showAttention() {
    this.setData({
      whoshow: 1
    })

    if (this.data.showattCount !== 1) {
      this.setData({
        showattCount: 1
      })
    }
  },

  /*显示推荐页面*/
  showHot() {
    this.setData({
      whoshow: 2
    })
  },

  /*显示最新页面*/
  showNew(e) {
    this.setData({
      whoshow: 3
    })

    //加载数据
    if (this.data.shownewCount !== 1) {
      this.getJuzi('desc')
      this.setData({
        shownewCount: 1
      })
    }
  },

  /*显示搜索框*/
  showSearch() {
    this.setData({
      isSearch: true
    })
  },

  /*关闭搜索框*/
  closeSearch() {
    this.setData({
      isSearch: false
    })
  },

  /*关注*/
  attention(e) {
    let userdata = this.data.userInfo
    if (!userdata._id) {
      showerr("请先登录！")
      return
    }
    if (e.target.dataset.id === this.data.attwho) {
      return
    }
    let fan = e.target.dataset.fan.unshift(userdata._openid)
    userdata.attention.unshift(e.target.dataset.openid)

    this.setData({
      userInfo: userdata
    })
    app.globalData.userInfo = userdata
    this.setData({
      attwho: e.target.dataset.id
    })

    setuser(userdata._id, "attention", userdata.attention)
    .then(res => showsucc("关注成功！"))
    //被关注人粉丝数据更新
    wx.cloud.callFunction({
      name: 'setdatabase',
      data: { name: 'fan', id: e.target.dataset.id, data: fan }
    })
  },

  /*取消关注*/
  unsubscribe(e) {
    if (e.target.dataset.id === this.data.noattwho) {
      return
    }

    wx.showModal({
      title: '确定不再关注此人',
      confirmColor: "#ff8b40",
      cancelColor: "#7e7d7d",
      success: (res) => {
        if (res.confirm) {
          let userdata = this.data.userInfo
          let index = userdata.attention.findIndex(e2 => {
            return e2 === e.target.dataset.openid
          })
          let idx = e.target.dataset.fan.findIndex(e2 => {
            return e2 === userdata._openid
          })

          let fan = e.target.dataset.fan.splice(idx, 1)
          userdata.attention.splice(index, 1)
          this.setData({
            userInfo: userdata
          })
          app.globalData.userInfo = userdata
          this.setData({
            noattwho: e.target.dataset.id
          })

          setuser(userdata._id, "attention", userdata.attention)
          .then(res => showsucc("取消关注！"))
          //被关注人粉丝数据更新
          wx.cloud.callFunction({
            name: 'setdatabase',
            data: { name: 'fan', id: e.target.dataset.id, data: fan }
          })
        }
      }
    })
  },

  //喜欢
  onlove(e) {
    let count = e.currentTarget.dataset.love + 1
    if (this.data.whoshow === 2) {
      let data = this.data.hotjuzi
      data[e.currentTarget.dataset.index].love = count
      this.setData({
        hotjuzi: data
      })
    } else if (this.data.whoshow === 3) {
      let data = this.data.newjuzi
      data[e.currentTarget.dataset.index].love = count
      this.setData({
        newjuzi: data
      })
    }

    //修改数据库此条数据
    wx.cloud.callFunction({
      name: 'setdatabase',
      data: { name: 'love', id: e.currentTarget.dataset.id, data: count}
    })
  },

  //评论
  oncomment() {
    let userdata = this.data.userInfo
    if (!userdata._id) {
      showerr("请先登录！")
      return
    }
  },

  //收藏
  oncollect(e) {
    let userdata = this.data.userInfo
    if (!userdata._id) {
      showerr("请先登录！")
      return
    }

    let collect = userdata.collect.unshift(userdata._openid)
    if (this.data.whoshow === 2) {
      let data = this.data.hotjuzi
      data[e.currentTarget.dataset.index].collect = count
      this.setData({
        hotjuzi: data
      })
    } else if (this.data.whoshow === 3) {
      let data = this.data.newjuzi
      data[e.currentTarget.dataset.index].love = count
      this.setData({
        newjuzi: data
      })
    }
  },
})