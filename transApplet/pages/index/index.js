//index.js
//获取应用实例
import {resData} from "../../utils/api.js"
import { hassave, savehistory, fullall, copytext} from "../../utils/common.js"
const app = getApp()

Page({
  data: {
    original : "",
    hiddenclose: true,
    fromlang: {},
    tolang: {},
    hiddenoutput: true,
    result: {
      query: "",
      translation: "",
      url: ""
    },
    animate: "",
    langArry: [],
    audioicon: "",
    collecticon: ""
  },
  onLoad: function (options) {
    if (options.original) {
      this.setData({ original: options.original, hiddenclose: false, hiddenoutput: false })
    }
    else{
      this.setData({ original: "" })
    }
    if(this.data.langArry.length < 1) {
      let arry = []
      app.globalData.langList.forEach((x) => {
        arry.push(x.chs)
      })
      this.setData({ langArry: arry })
    }
  },
  onShow: function () {
    if (this.data.fromlang !== app.globalData.fromlang) {
      this.setData({ fromlang: app.globalData.fromlang, tolang: app.globalData.tolang })
      this.onconfirm()
    }
  },
  oninput: function (e) {
    this.setData({ "original": e.detail.value })
    if(this.data.original.length > 0)
      this.setData({ "hiddenclose": false })
    else
      this.setData({ "hiddenclose": true })
  },
  onclose: function () {
    this.setData({ original: "", hiddenclose: true, hiddenoutput: true })
  },
  onconfirm: function () {
    if(!this.data.original) return
    let q = this.data.original.trim()
    resData(q, this.data.fromlang.lang, this.data.tolang.lang ).then( (res) => {
      this.getlang(res.l)
      let data = {
        query: this.data.original,
        translation: res.translation[0],
        url: res.tSpeakUrl,
        from: this.data.fromlang,
        to: this.data.tolang,
        save: false
      }
      this.setData({ hiddenoutput: false, result: { query: data.query, translation: data.translation, url: data.url }})
      let index = hassave(data)
      this.setData({ collecticon: index > -1 ? "fill" : "" })
      data.save = index > -1 ? true : false
      this.savehistory(data)
    })
  },
  /*判断是否重复上一个历史*/
  savehistory: function(data) {
    let history = wx.getStorageSync("history") || []
    if (history.length < 1) {
      history.unshift(data)
      wx.setStorageSync('history', history)
    } else if (history[0].query !== data.query || history[0].translation !== data.translation){
      history.unshift(data)
      history.length = history.length > 20 ? 20 : history.length
      wx.setStorageSync('history', history)
    }
  },
  /*判断检测到的语言*/
  getlang: function (data) {
    let lang = data.split('2')
    app.globalData.langList.forEach((e, i) => {
      if (e.lang === lang[0]) {
        this.setData({ fromlang: e })
      }
    })
    app.globalData.langList.forEach((e, i) => {
      if (e.lang === lang[1]) {
        this.setData({ tolang: e })
      }
    })
  },
  onchange : function () {
    this.setData({ animate: "scale" ,fromlang: this.data.tolang, tolang: this.data.fromlang})
    setTimeout(()=>{
      this.setData({animate: ""})
    },600)
    if (this.data.original)
      this.onconfirm()
  },
  onpickerfrom: function (e) {
    this.setData({ fromlang: app.globalData.langList[e.detail.value] })
    if(this.data.original){
      this.onconfirm()
    }
  },
  onpickerto: function (e) {
    this.setData({ tolang: app.globalData.langList[e.detail.value ] })
    if (this.data.original) {
      this.onconfirm()
    }
  },
  onplaymp3: function () {
    const audio = wx.createInnerAudioContext()
    audio.autoplay = true
    audio.src = this.data.result.url
    audio.onPlay(() => { this.setData({ audioicon: "active" }) })
    audio.onEnded(() => { this.setData({ audioicon: "" }) })
  },
  onfullscreen: function () {
    fullall('history',0)
  },
  oncopy: function () {
    copytext(this.data.result.translation)
  },
  oncollect: function () {
    let data = { 
      query: this.data.result.query, 
      translation: this.data.result.translation, 
      url: this.data.result.url, 
      from: this.data.fromlang, 
      to: this.data.tolang,
      save: true
    }
    let collect = wx.getStorageSync("collect") || []
    let index = hassave(data)
    let b = ""
    if (index > -1){
      collect.splice(index, 1)
      wx.setStorageSync("collect", collect)
      savehistory(data, false)
      b = ""
    }else {
      collect.unshift(data)
      wx.setStorageSync("collect", collect)
      savehistory(data, true)
      b = "fill"
    }
    this.setData({ collecticon: b })
  }
})