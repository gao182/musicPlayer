// miniprogram/pages/addJu/addJu.js
import {addData} from "../../src/database"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    isShowjuzi: true,
    juji: [],
    label: ["随笔", "歌词", "古诗", "宋词", "诗歌", "歌词", "古诗", "宋词", "诗歌", "古诗", "宋词", "诗歌", "歌词", "古诗", "宋词", "诗歌"],
    addjuzi: {
      text: "",
      imgUrl: "../../images/img.png",
      label: "",
      author: "",
      from: "",
      juji: ""
    },
    addjuji: {
      jujiName: "",
      jujidesc: "",
      imgUrl: "../../images/img.png"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!app.globalData.openid) {
      wx.showToast({
        icon: 'none',
        title: '请先登录',
        success() {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
  /*显示句子表单*/
  showJuzi() {
    this.setData({
      isShowjuzi: true
    })
  },
  /*显示句集表单*/
  showJuji() {
    this.setData({
      isShowjuzi: false
    })
  },
  /*改变句集*/
  pickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },
  /*选择标签*/
  selectLabel(e) {
    let newlabel
    let labelstr = this.data.addjuzi.label
    if (labelstr === "") {
      newlabel = e.target.dataset.value
    } else {
      newlabel = e.target.dataset.value
      if (labelstr.match(newlabel)) {
        if (labelstr.match(newlabel).index === 0 && labelstr.match(/,/g) === null)
          newlabel = labelstr.replace(newlabel, "")
        else if (labelstr.match(newlabel).index === 0 && labelstr.match(/,/g) !== null)
          newlabel = labelstr.replace(newlabel + ",", "")
        else if (labelstr.match(newlabel).index > 0)
          newlabel = labelstr.replace("," + newlabel, "")
      } else {
        if (labelstr.match(/,/g) === null || labelstr.match(/,/g).length < 2) {
          newlabel = this.data.addjuzi.label + ',' + newlabel
        } else {
          wx.showToast({
            title: '标签不超过3个',
            icon: 'none',
            duration: 2000
          })
          return
        }
      }
    }
    this.data.addjuzi.label = newlabel
    this.setData({
      addjuzi: this.data.addjuzi
    })
  },
  /*选择本地图片*/
  selectImg() {
    wx.chooseImage({
      count: 1,
      sizeType: "compressed",
      success: (res) => {
        const filePath = res.tempFilePaths[0]
        if (this.data.isShowjuzi) {
          this.data.addjuzi.imgUrl = filePath
          this.setData({
            addjuzi: this.data.addjuzi
          })
        } else {
          this.data.addjuji.imgUrl = filePath
          this.setData({
            addjuji: this.data.addjuji
          })
        }
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  /*输入句子*/
  inputJuzi(e) {
    this.data.addjuzi.text = e.detail.value
    this.setData({
      addjuzi: this.data.addjuzi
    })
  },
  /*输入作者*/
  inputAuthor(e) {
    this.data.addjuzi.author = e.detail.value
    this.setData({
      addjuzi: this.data.addjuzi
    })
  },
  /*输入出处*/
  inputFrom(e) {
    this.data.addjuzi.from = e.detail.value
    this.setData({
      addjuzi: this.data.addjuzi
    })
  },
  /*发布句子*/
  publishJuzi() {
    let addjuzi = this.data.addjuzi
    console.log(addjuzi.from.match('《'))
    addjuzi.from = addjuzi.from.match('《') !== null ? addjuzi.from : "《" + addjuzi.from
    addjuzi.from = addjuzi.from.match('》') !== null ? addjuzi.from : addjuzi.from + "》"
    if (addjuzi.text.length > 2 && addjuzi.author && addjuzi.label && addjuzi.from) {
      wx.showLoading({
        title: '上传中',
      })
      addData(addjuzi)
    } else {
      wx.showToast({
        title: '请补充句子信息',
        icon: 'none',
        duration: 2000
      })
    }
  },
  /*输入句集名称*/
  inputJujiname(e) {
    this.data.addjuji.jujiName = e.detail.value
    this.setData({
      addjuji: this.data.addjuji
    })
  },
  /*输入句集*/
  inputJuji(e) {
    this.data.addjuji.jujidesc = e.detail.value
    this.setData({
      addjuji: this.data.addjuji
    })
  },
  /*发布句集*/
  publishJuji() {
    let addjuji = this.data.addjuji
    addjuji.jujiName = addjuji.jujiName.match('《') !== null ? addjuji.jujiName : "《" + addjuzi.jujiName
    addjuji.jujiName = addjuji.jujiName.match('》') !== null ? addjuji.jujiName : addjuzi.jujiName + "》"
    if (addjuji.jujiName) {
      wx.showLoading({
        title: '上传中',
      })
      addData(addjuji)
    } else {
      wx.showToast({
        title: '请补充句集信息',
        icon: 'none',
        duration: 2000
      })
    }
  }
})