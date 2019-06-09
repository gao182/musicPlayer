// miniprogram/pages/commentJuzi/commentJuzi.js
import { showsucc, showerr, getcurrentJuzi, getuser, getImginfo } from "../../src/database"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentjuzi:{
      imgUrl: "../../images/noimg.jpg",
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getjuzi(options.jzid)
  },

  /*查询当个句子*/
  getjuzi(id) {
    //查询最热句子
    getcurrentJuzi(id).then(res => {
      let data = res.data
      getImginfo(data).then(res => {
        data[0].imgUrl = res.fileList[0].tempFileURL
        let t = new Date(data[0].time)
        data[0].time = t.toLocaleDateString() + ' ' + t.toLocaleTimeString()
        this.setData({
          currentjuzi: data[0]
        })
      })
    }).catch(err => showerr('查询记录失败'))
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