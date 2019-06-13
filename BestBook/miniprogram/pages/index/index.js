// miniprogram/pages/indexs/index.js
import {
  showsucc,
  gethotJuzi,
  getnewJuzi,
  getattJuzi,
  setJuzi,
  getuser,
  setuser,
  getImginfo
} from "../../src/database"

const app = getApp()
Page({
  data: {
    userInfo: app.globalData.userInfo,
    whoshow: 2,
    isSearch: false,
    searchtxt: "",
    hotjuzi: [],
    newjuzi: [],
    attjuzi: [],
    shownewCount: 0,
    showattCount: 0,
    hotpage: 0,
    newpage: 0,
    attpage: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    /*查询最热句子*/
    this.hotJuzi(0)
  },

  //查hot句子
  hotJuzi(n){
    wx.showLoading({ title: '加载中' })
    gethotJuzi(n).then(res => {
      this.getJuzi(res.data)
    }).catch(err => {
      wx.hideLoading()
      showsucc('查询记录失败', 'none')
    })
  },

  //查new句子
  newJuzi(n) {
    wx.showLoading({ title: '加载中' })
    getnewJuzi(n).then(res => {
      this.getJuzi(res.data)
    }).catch(err => {
      wx.hideLoading()
      showsucc('查询记录失败', 'none')
    })
  },

  //查att句子
  attJuzi(data,n) {
    wx.showLoading({ title: '加载中' })
    getattJuzi(data, n).then(res => {
      this.getJuzi(res.data)
    }).catch(err => {
      wx.hideLoading()
      showsucc('查询记录失败', 'none')
    })
  },

  /*正确优化时间和图片*/
  getJuzi(data) {
    getImginfo(data).then(res => {
      wx.hideLoading() //隐藏加载
      let hotimg = res.fileList
      data.forEach(e => {
        let t = new Date(e.time)
        e.time = t.toLocaleDateString() + ' ' + t.toLocaleTimeString()
        e.hasatt = false
        e.hasunatt = false
        e.hascollect = false
        e.imgUrl = hotimg.find(e2 => {
          return e2.fileID === e.imgUrl
        }).tempFileURL

        if(app.globalData.userInfo._id){
          e.hascollect = app.globalData.userInfo.collect.indexOf(e._id) >= 0 ? true : false
          e.isattention = app.globalData.userInfo.attention.indexOf(e._openid) >= 0 ? true : false
        }
        this.setData({ userInfo: app.globalData.userInfo })
      })
      if (this.data.whoshow === 1){
        this.setData({ attjuzi: this.data.attjuzi.concat(data) })
      }
      else if (this.data.whoshow === 2) {
        this.setData({ hotjuzi: this.data.hotjuzi.concat(data) })
      }
      else if (this.data.whoshow === 3) {
        this.setData({ newjuzi: this.data.newjuzi.concat(data) })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (!app.globalData.userInfo._id) { return }

    let userInfo = app.globalData.userInfo
    let hotdata = this.data.hotjuzi
    let newdata = this.data.newjuzi
    let attentionArr = userInfo.attention

    if (hotdata.length) {
      hotdata.forEach(e => {
        e.hascollect = userInfo.collect.indexOf(e._id) >= 0 ? true : false
        e.isattention = userInfo.attention.indexOf(e._openid) >= 0 ? true : false
      })
    }
    if (newdata.length) {
      newdata.forEach(e => {
        e.hascollect = userInfo.collect.indexOf(e._id) >= 0 ? true : false
        e.isattention = userInfo.attention.indexOf(e._openid) >= 0 ? true : false
      })
    }

    this.setData({
      userInfo: userInfo,
      hotjuzi: hotdata,
      newjuzi: newdata
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      attwho: [],
      noattwho: []
    })
    if (this.data.whoshow === 1) {
      let data = app.globalData.userInfo.attention
      this.data.attjuzi = []
      this.data.attpage = 0
      this.attJuzi(data,0)
    } else if (this.data.whoshow === 2) {
      /*查询最热句子*/
      this.data.hotjuzi = []
      this.data.hotpage = 0
      this.hotJuzi(0)
    } else {
      /*查询最新句子*/
      this.data.newjuzi = []
      this.data.newpage = 0
      this.newJuzi(0)
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if(this.data.whoshow === 1){
      const db = wx.cloud.database()
      const _ = db.command
      db.collection('juzi').where({
        _openid: _.in(app.globalData.userInfo.attention)
      }).count().then(res => {
        if (this.data.hotpage >= 0 && res.total - this.data.hotpage > 10) {
          this.data.hotpage += 10
          this.hotJuzi(this.data.hotpage)
        } else {
          showsucc('数据已经到底了！', 'none')
        }
      })
    }
    else if (this.data.whoshow === 2) {
      const db = wx.cloud.database()
      db.collection('juzi').count().then(res => {
        if (this.data.hotpage >= 0 && res.total - this.data.hotpage > 10){
          this.data.hotpage += 10
          this.hotJuzi(this.data.hotpage)
        }else{
          showsucc('数据已经到底了！', 'none')
        }
      })
    }
    else{
      const db = wx.cloud.database()
      db.collection('juzi').count().then(res => {
        if (this.data.newpage >= 0 && res.total - this.data.newpage > 10 ) {
          this.data.newpage += 10
          this.newJuzi(this.data.newpage)
        } else {
          showsucc('数据已经到底了！', 'none')
        }
      })
    }
  },

  /*显示关注页面*/
  showAttention() {
    this.setData({
      whoshow: 1
    })

    if (this.data.showattCount !== 1) {
      if(app.globalData.userInfo._id){
        let data = app.globalData.userInfo.attention
        this.attJuzi(data, 0)
        this.setData({showattCount: 1})
      }
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
      this.newJuzi(0)
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

  /*搜索框输入时改变内容*/
  oninput(e){
    this.setData({
      searchtxt: e.detail.value
    })
  },

  /*关闭搜索框*/
  closeSearch() {
    this.setData({
      isSearch: false
    })
  },

  /*搜索*/
  search() {
    if(!this.data.searchtxt){
      return
    }
    wx.navigateTo({
      url: `../search/search?word=${this.data.searchtxt}`,
    })
  },

  /*关注*/
  attention(e) {
    let userInfo = app.globalData.userInfo
    if (!userInfo._id) {
      showsucc('请先登录！', 'none')
      return
    }
    if (e.target.dataset.att) {
      return
    }
    userInfo.attention.unshift(e.target.dataset.openid)

    if (this.data.whoshow === 2) {
      let data = this.data.hotjuzi
      data[e.target.dataset.index].hasatt = true
      this.setData({
        hotjuzi: data
      })
    } else if (this.data.whoshow === 3) {
      let data = this.data.newjuzi
      data[e.target.dataset.index].hasatt = true
      this.setData({
        newjuzi: data
      })
    }
    app.globalData.userInfo = userInfo
    this.setData({ userInfo: userInfo})

    setuser(userInfo._id, "attention", userInfo.attention)
      .then(res => showsucc("关注成功！"))

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

          if (this.data.whoshow === 2) {
            let data = this.data.hotjuzi
            data[e.target.dataset.index].hasunatt = true
            this.setData({
              hotjuzi: data
            })
          } else if (this.data.whoshow === 3) {
            let data = this.data.newjuzi
            data[e.target.dataset.index].hasunatt = true
            this.setData({
              newjuzi: data
            })
          }else {
            let data = this.data.attjuzi
            data[e.target.dataset.index].hasunatt = true
            this.setData({ attjuzi: data })
          }

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
    }else{
      let data = this.data.attjuzi
      data[e.currentTarget.dataset.index].love = count
      this.setData({
        attjuzi: data
      })
    }

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
    if (e.currentTarget.dataset.hascollect) {
      let idx = userInfo.collect.indexOf(e.currentTarget.dataset.id)
      userInfo.collect.splice(idx, 1)
      if (this.data.whoshow === 2) {
        let data = this.data.hotjuzi
        data[e.currentTarget.dataset.index].collectCount = count - 1
        count = count - 1
        data[e.currentTarget.dataset.index].hascollect = false
        this.setData({
          hotjuzi: data
        })
      } else if (this.data.whoshow === 3) {
        let data = this.data.newjuzi
        data[e.currentTarget.dataset.index].collectCount = count - 1
        count = count - 1
        data[e.currentTarget.dataset.index].hascollect = false
        this.setData({
          newjuzi: data
        })
      } else {
        let data = this.data.attjuzi
        data[e.currentTarget.dataset.index].collectCount = count - 1
        count = count - 1
        data[e.currentTarget.dataset.index].hascollect = false
        this.setData({
          attjuzi: data
        })
      }
    } else {
      userInfo.collect.unshift(e.currentTarget.dataset.id)
      if (this.data.whoshow === 2) {
        let data = this.data.hotjuzi
        data[e.currentTarget.dataset.index].collectCount = count + 1
        count = count + 1
        data[e.currentTarget.dataset.index].hascollect = true
        this.setData({
          hotjuzi: data
        })
      } else if (this.data.whoshow === 3) {
        let data = this.data.newjuzi
        data[e.currentTarget.dataset.index].collectCount = count + 1
        count = count + 1
        data[e.currentTarget.dataset.index].hascollect = true
        this.setData({
          newjuzi: data
        })
      } else {
        let data = this.data.attjuzi
        data[e.currentTarget.dataset.index].collectCount = count + 1
        count = count + 1
        data[e.currentTarget.dataset.index].hascollect = true
        this.setData({
          attjuzi: data
        })
      }
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
  oncomment(e){
    wx.navigateTo({
      url: `../commentJuzi/commentJuzi?jzid=${e.currentTarget.dataset.id}`,
    })
  }
})