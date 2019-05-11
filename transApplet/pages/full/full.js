// pages/full/full.js
Page({
  data: {
    result: {
      query: "",
      translation: "",
      url: ""
    },
    audioicon: ""
  },
  onLoad: function (options) {
    let data = wx.getStorageSync(options.type)[options.index]
    this.setData({ result: {
      query: data.query,
      translation: data.translation,
      url: data.url
    }})
  },
  onplaymp3: function () {
    const audio = wx.createInnerAudioContext()
    audio.src = this.data.result.url
    audio.play()
    audio.onPlay(() => {
      this.setData({ audioicon: "active" })
    })
    audio.onEnded(() => {
      this.setData({ audioicon: "" })
    })
  }
})