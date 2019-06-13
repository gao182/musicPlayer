// miniprogram/pages/classify/classify.js
import { showsucc,getImginfo, getClassify } from "../../src/database"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [],
    books: [],
    authors: [],
    tabPage: 0,
    bookPage: 0,
    authorPage: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAlls("classify-tabs",0)
    this.getAlls("classify-books",0)
    this.getAlls("classify-authors",0)
  },

  //获取分类
  getAlls(style, n){
    wx.showLoading({
      title: '加载中',
    })

    getClassify(style, n).then(res => {
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
        if (style === "classify-tabs"){
          this.setData({ tabs: this.data.tabs.concat(classify) })
        }
        else if (style === "classify-books"){
          this.setData({ books: this.data.books.concat(classify) })
        }
        else if (style === "classify-authors"){
          this.setData({ authors: this.data.authors.concat(classify) })
        }
      })
    }).catch(err => console.error(err))
  },

  loadTab(){
    const db = wx.cloud.database()
    db.collection('classify-tabs').count().then(res => {
      if (this.data.tabPage >= 0 && res.total - this.data.tabPage > 10) {
        this.data.tabPage += 10
        console.log(this.data.tabPage)
        this.getAlls("classify-tabs", this.data.tabPage)
      } else {
        showsucc('数据已经到底了', 'none')
      }
    })
  },
  loadBook() {
    const db = wx.cloud.database()
    db.collection('classify-books').count().then(res => {
      if (this.data.bookPage >= 0 && res.total - this.data.bookPage > 10) {
        this.data.bookPage += 10
        this.getAlls("classify-books", this.data.bookPage)
      } else {
        showsucc('数据已经到底了', 'none')
      }
    })
  },
  loadAuthor() {
    const db = wx.cloud.database()
    db.collection('classify-authors').count().then(res => {
      if (this.data.authorPage >= 0 && res.total - this.data.authorPage > 10) {
        this.data.authorPage += 10
        this.getAlls("classify-authors", this.data.authorPage)
      } else {
        showsucc('数据已经到底了', 'none')
      }
    })
  }
})