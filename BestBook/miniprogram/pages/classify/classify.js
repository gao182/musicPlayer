// miniprogram/pages/classify/classify.js
import { getImginfo, getClassify } from "../../src/database"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: {},
    books: {},
    authors: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAlls("classify-tabs")
    this.getAlls("classify-books")
    this.getAlls("classify-authors")
  },

  //获取分类
  getAlls(style){
    wx.showLoading({
      title: '加载中',
    })

    getClassify(style).then(res => {
      let classify = res.data
      getImginfo(classify).then(res => {
        wx.hideLoading()  //隐藏加载

        let imgList = res.fileList
        imgList.forEach(e1 => {
          classify.forEach(e2 => {
            if (e2.imgUrl === e1.fileID) {
              e2.imgUrl = e1.tempFileURL
              return
            }
          })
        })
        if (style === "classify-tabs")
          this.setData({ tabs: classify })
        else if (style === "classify-books")
          this.setData({ books: classify })
        else if (style === "classify-authors")
          this.setData({ authors: classify })
      })
    }).catch(err => console.error(err))
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

  }
})