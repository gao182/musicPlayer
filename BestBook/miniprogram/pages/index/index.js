// miniprogram/pages/indexs/index.js
import { showsucc, showerr, getJuzi, getuser, getImginfo } from "../../src/database"
Page({
  data: {
    whoshow: 2,
    isSearch: false,
    hotjuzi: {},
    newjuzi: {},
    attjuzi: {}
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
      wx.hideLoading()
      let data = res.data
      getImginfo(res.data).then(res => {
        let hotimg = res.fileList
        hotimg.forEach(e1 => {
          data.forEach(e2 => {
            if (e2.imgUrl === e1.fileID){
              e2.imgUrl = e1.tempFileURL
              return
            }
          })
        })
        data.forEach(e => {
          let t = new Date(e.time)
          e.time = t.toLocaleDateString() + ' ' + t.toLocaleTimeString()
        })
        if(this.data.whoshow === 1)
          this.setData({ attjuzi: data })
        else if (this.data.whoshow === 2)
          this.setData({ hotjuzi: data })
        else if (this.data.whoshow === 3)
          this.setData({ newjuzi: data })
      })
    }).catch(err => {
      wx.hideLoading()
      showerr('查询记录失败')
      this.getJuzi()
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

  /*显示关注页面*/
  showAttention() {
    this.setData({
      whoshow: 1
    })
  },

  /*显示推荐页面*/
  showHot() {
    this.setData({
      whoshow: 2
    })
  },

  /*显示最新页面*/
  showNew() {
    this.setData({
      whoshow: 3
    })

    //加载数据
    this.getJuzi('desc')
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
  attention(e){
    console.log(e.target.dataset.openid)
  }
})