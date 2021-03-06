// miniprogram/pages/addJu/addJu.js
import { showsucc,showerr, addData, getClassify, addClassify } from "../../src/database"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    isShowjuzi: true,
    juji: [],
    label: [],
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
    if (!app.globalData.userInfo._openid) {
      showerr('请先登录')
    }
    this.getAlltabs()
  },

  //获取标签分类
  getAlltabs(){
    getClassify("classify-tabs").then(res => {
      this.setData({ label: res.data })
    }).catch(err => console.error(err))
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
    if (app.globalData.addsuccess){
      this.getClassifyAuthor()
      this.getClassifyBook()
      app.globalData.addsuccess = false
    }
  },

  //查询是否存在作者分类
  getClassifyAuthor(){
    let data = this.data.addjuzi
    getClassify("classify-authors", data.author)
      .then(res => {
        if (res.data.length < 1) {
          addClassify("classify-authors", data.author)
        }
      })
      .catch(err => console.error(err))
  },

  //查询是否存在作者作品分类
  getClassifyBook() {
    let data = this.data.addjuzi
    getClassify("classify-books", data.from, data.author)
      .then(res => {
        if (res.data.length < 1) {
          addClassify("classify-books", data.from, data.author)
        }
      })
      .catch(err => console.error(err))
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
          showsucc('标签不超过3个', 'none')
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
    if (addjuzi.text.length > 2 && addjuzi.author && addjuzi.label && addjuzi.from) {
      addjuzi.from = addjuzi.from.match('《') !== null ? addjuzi.from : "《" + addjuzi.from
      addjuzi.from = addjuzi.from.match('》') !== null ? addjuzi.from : addjuzi.from + "》"
      wx.showLoading({
        title: '上传中',
      })
      addData(addjuzi)
    } else {
      showsucc('请补充句子信息','none')
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
    if (addjuji.jujiName) {
      addjuji.jujiName = addjuji.jujiName.match('《') !== null ? addjuji.jujiName : "《" + addjuzi.jujiName
      addjuji.jujiName = addjuji.jujiName.match('》') !== null ? addjuji.jujiName : addjuzi.jujiName + "》"
      wx.showLoading({
        title: '上传中',
      })
      addData(addjuji)
    } else {
      showsucc('请补充句子信息', 'none')
    }
  }
})