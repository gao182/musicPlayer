// miniprogram/pages/search/search.js
import { showerr, getJuziByword,getImginfo } from "../../src/database"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    juzidata: [],
    word: "",
    whoshow: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.word = "人"
    this.setData({word: options.word})
    this.searchJz(options.word, 0)
  },

  /*搜索句子*/
  showJuzi() { 
    this.setData({ whoshow: 0 })
  },

  //开始搜索句子
  searchJz(word, n){
    wx.showLoading({ title: '加载中' })
    getJuziByword(word, n).then(res => {
      this.getJuzi(res.data)
    }).catch(err => showerr('查询失败'))
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
      })
      if (this.data.whoshow === 0)
        this.setData({ juzidata: data })
    })
  },

  /*搜索句集*/
  showJuji() {
    this.setData({ whoshow: 1 })
  },

  /*搜索用户*/
  showUser() {
    this.setData({ whoshow: 2 })
  },

  /*搜索作者*/
  showAuthor() {
    this.setData({ whoshow: 3 })
  },

  /*搜索作品*/
  showBook() {
    this.setData({ whoshow: 4 })
  }
})