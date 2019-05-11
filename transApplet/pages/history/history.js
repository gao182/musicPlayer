// pages/history/history.js
import { hassave, savehistory, fullall, copytext } from "../../utils/common.js"
const app = getApp()

Page({
  data: {
    history: [],
    audio_id: -1
  },
  onShow: function () {
    this.setData({ history: wx.getStorageSync('history')})
  },
  onplaymp3: function (e) {
    const audio = wx.createInnerAudioContext()
    audio.src = e.currentTarget.dataset.item.url
    audio.play()
    audio.onPlay(() => { this.setData({ audio_id: e.currentTarget.id }) })
    audio.onEnded(() => { this.setData({ audio_id: -1 }) })
  },
  onfullscreen: function (e) {
    let type = "history"
    fullall(type, e.currentTarget.id)
  },
  oncopy: function (e) {
    copytext(e.currentTarget.dataset.text)
  },
  oncollect: function (e) {
    let data = e.currentTarget.dataset.item
    let collect = wx.getStorageSync("collect") || []
    let index = hassave(data)

    if (data.save) {
      collect.splice(index, 1)
      wx.setStorageSync("collect", collect)
      savehistory(data, false)
      this.onShow()
    } else {
      data.save = true
      collect.unshift(data)
      wx.setStorageSync("collect", collect)
      savehistory(data, true)
      this.onShow()
    }
  },
  onclear: function () {
    wx.removeStorageSync("history")
    this.onShow()
  },
  ontoindex: function (e) {
    let data = e.currentTarget.dataset.item
    app.globalData.fromlang = data.from
    app.globalData.tolang = data.to
    wx.reLaunch({
      url: `/pages/index/index?original=${data.query}`
    })
  }
})