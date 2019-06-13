import {
  getImginfo, showerr, showsucc, setuser, getuser
} from "../../src/database"

const app = getApp()
// miniprogram/pages/find/find.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: [],
    juzi: {},
    todayM: "",
    todayD: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getJuzi()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!app.globalData.userInfo._id) { return }
    let userInfo = app.globalData.userInfo
    let juzi = this.data.juzi

    juzi.hascollect = userInfo.collect.indexOf(juzi._id) >= 0 ? true : false
    juzi.isattention = userInfo.attention.indexOf(juzi._openid) >= 0 ? true : false

    this.setData({
      userInfo: userInfo,
      juzi: juzi
    })
  },

  /*查询单个随机佳句*/
  getJuzi() {
    wx.showLoading({
      title: '加载中',
    })

    const db = wx.cloud.database()
    db.collection('juzi').orderBy('time', 'desc').limit(10).get().then((res) => {
      let random = Math.floor(Math.random() * res.data.length)
      let juziAry = res.data.splice(random, 1)
      let t = new Date()
      juziAry[0].imgUrl = juziAry[0].imgUrl ? juziAry[0].imgUrl : 
        "cloud://juzi-qf0a0.6a75-juzi-qf0a0/classify/demo" + random +".jpg";
      getImginfo(juziAry).then(res => {
        wx.hideLoading()  //隐藏加载
        juziAry[0].imgUrl = res.fileList[0].tempFileURL
        juziAry[0].hasatt = false
        juziAry[0].hasunatt = false
        juziAry[0].hascollect = false
        if (app.globalData.userInfo._id) {
          juziAry[0].hascollect = app.globalData.userInfo.collect.indexOf(juziAry[0]._id) >= 0 ? true : false
          juziAry[0].isattention = app.globalData.userInfo.attention.indexOf(juziAry[0]._openid) >= 0 ? true : false
        }
        this.setData({
          juzi: juziAry[0],
          todayM: t.getMonth() + 1,
          todayD: t.getDate()
        })
      })
    }).catch(console.error)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getJuzi()
  },

  //关注
  attention(e){
    let userInfo = app.globalData.userInfo
    if (!userInfo._id) {
      showsucc('请先登录！', 'none')
      return
    }
    if (e.target.dataset.att) {
      return
    }
    let juzi = this.data.juzi
    userInfo.attention.unshift(e.target.dataset.openid)
    
    juzi.hasatt = true
    this.setData({ juzi: juzi })
    app.globalData.userInfo = userInfo
    this.setData({ userInfo: userInfo })

    setuser(userInfo._id, "attention", userInfo.attention).then(res => showsucc("关注成功！"))
    //被关注人粉丝数据更新
    getuser(e.target.dataset.openid).then(res => {
      let fan = res.data[0].fan
      fan.unshift(userInfo._openid)
      wx.cloud.callFunction({
        name: 'setdatabase',
        data: {
          name: 'fan',
          id: res.data[0]._id,
          data: fan
        }
      }).then(res => console.log(res))
    })
  },

  /*取消关注*/
  unsubscribe(e) {
    if (e.target.dataset.unatt) {
      return
    }

    wx.showModal({
      title: '确定不再关注此人',
      confirmColor: "#ff8b40",
      cancelColor: "#7e7d7d",
      success: (res) => {
        if (res.confirm) {
          let userInfo = app.globalData.userInfo
          let index = userInfo.attention.findIndex(e2 => {
            return e2 === e.target.dataset.openid
          })
          userInfo.attention.splice(index, 1)
          app.globalData.userInfo = userInfo
          this.setData({ userInfo: userInfo })

          let data = this.data.juzi
          data.hasunatt = true
          this.setData({ juzi: data })

          setuser(userInfo._id, "attention", userInfo.attention)
            .then(res => showsucc("取消关注！"))

          //被关注人粉丝数据减少
          getuser(e.target.dataset.openid).then(res => {
            let fan = res.data[0].fan
            let idx = fan.findIndex(e => {
              return e === userInfo._openid
            })
            fan.splice(idx, 1)
            wx.cloud.callFunction({
              name: 'setdatabase',
              data: {
                name: 'fan',
                id: res.data[0]._id,
                data: fan
              }
            })
          })
        }
      }
    })
  },

  //喜欢
  onlove(e) {
    let count = e.currentTarget.dataset.love + 1
    let data = this.data.juzi
    data.love = count
    this.setData({ juzi: data})

    //修改数据库此条数据
    wx.cloud.callFunction({
      name: 'setdatabase',
      data: {
        name: 'love',
        id: e.currentTarget.dataset.id,
        data: count
      }
    }).then(res => console.log(res))
  },

  //收藏
  oncollect(e) {
    let userInfo = app.globalData.userInfo
    let count = e.currentTarget.dataset.count
    if (!userInfo._id) {
      showsucc('请先登录！', 'none')
      return
    }
    let data = this.data.juzi

    if (e.currentTarget.dataset.hascollect) {
      let idx = userInfo.collect.indexOf(e.currentTarget.dataset.id)
      userInfo.collect.splice(idx, 1)
      count = count - 1
      data.collectCount = count
      data.hascollect = false
      this.setData({ juzi: data })
    } else {
      userInfo.collect.unshift(e.currentTarget.dataset.id)
      count = count + 1
      data.collectCount = count
      data.hascollect = true
      this.setData({ juzi: data })
    }

    //个人收藏加数据
    setuser(userInfo._id, "collect", userInfo.collect)

    //修改指定句子收藏数
    wx.cloud.callFunction({
      name: 'setdatabase',
      data: {
        name: 'collectCount',
        id: e.currentTarget.dataset.id,
        data: count
      }
    }).then(res => console.log(res))
  },

  //评价
  oncomment(e) {
    wx.navigateTo({
      url: `../commentJuzi/commentJuzi?jzid=${e.currentTarget.dataset.id}`,
    })
  }
})