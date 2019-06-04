// miniprogram/pages/indexs/index.js
Page({
  data: {
    whoshow: 2,
    isSearch: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    this.setData({ whoshow: 1 })
  },

  /*显示推荐页面*/
  showHot() {
    this.setData({ whoshow: 2 })
  },

  /*显示最新页面*/
  showNew() {
    this.setData({ whoshow: 3 })
  },

  /*显示搜索框*/
  showSearch(){
    this.setData({ isSearch: true })
  },

  /*关闭搜索框*/
  closeSearch(){
    this.setData({ isSearch: false })
  }
})