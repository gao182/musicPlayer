// miniprogram/pages/commentJuzi/commentJuzi.js
import { showsucc,  getoneJuzi, getuser, getImginfo } from "../../src/database"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    currentjuzi:{
      imgUrl: "../../images/noimg.jpg",
    },
    jzid: "",
    isfocus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({jzid: options.jzid})
    this.getjuzi(options.jzid)
  },

  /*查询当个句子*/
  getjuzi(id) {
    wx.showLoading({
      title: '加载中',
    })

    //查询一個句子
    getoneJuzi(id).then(res => {
      let data = res.data
      getImginfo(data).then(res => {
        wx.hideLoading()  //隐藏加载
        
        data[0].imgUrl = res.fileList[0].tempFileURL
        let t = new Date(data[0].time)
        data[0].time = t.toLocaleDateString() + ' ' + t.toLocaleTimeString()
        this.setData({
          currentjuzi: data[0]
        })
      })
    }).catch(err => showsucc('查询失败', 'none'))
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getjuzi(this.data.jzid)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


  /*关注*/
  attention(e) {
    let userdata = this.data.userInfo
    if (!userdata._id) {
      showsucc('请先登录！', 'none')
      return
    }
  },

  /*取消关注*/
  unsubscribe(e) {
    if (e.target.dataset.unatt) {
      return
    }
  },

  //喜欢
  onlove(e) {},

  //收藏
  oncollect(e) {
    let userdata = this.data.userInfo
    let count = e.currentTarget.dataset.count
    if (!userdata._id) {
      showsucc('请先登录！', 'none')
      return
    }
  },

  //評價
  oncomment(e) {
    this.setData({ isfocus: true})
  }
})