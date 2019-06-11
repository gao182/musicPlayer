import {
  getImginfo
} from "../../src/database"

// miniprogram/pages/find/find.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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

  /*查询单个随机佳句*/
  getJuzi() {
    wx.showLoading({
      title: '加载中',
    })

    const db = wx.cloud.database()
    db.collection('juzi').orderBy('time', 'desc')
      .limit(10)
      .get().then((res) => {
        let random = Math.floor(Math.random() * res.data.length)
        let juziAry = res.data.splice(random, 1)
        let t = new Date()
        juziAry[0].imgUrl = juziAry[0].imgUrl ? juziAry[0].imgUrl : 
          "cloud://juzi-qf0a0.6a75-juzi-qf0a0/classify/demo1.jpg";
        getImginfo(juziAry).then(res => {
          wx.hideLoading()  //隐藏加载

          juziAry[0].imgUrl = res.fileList[0].tempFileURL
          this.setData({
            juzi: juziAry[0],
            todayM: t.getMonth() + 1,
            todayD: t.getDate()
          })
        })
      })
      .catch(console.error)
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
    this.getJuzi()
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

  }
})