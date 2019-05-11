//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    this.globalData.fromlang = this.globalData.langList[0] || wx.getStorageSync("history")[0].from
    this.globalData.tolang = this.globalData.langList[0] || wx.getStorageSync("history")[0].from
  },
  globalData: {
    fromlang: {},
    tolang: {},
    langList: [
      {
        'chs': '自动检测',
        "lang": 'auto',
        "index": 0
      },
      {
        'chs': '中文',
        "lang": 'zh-CHS',
        "index": 1
      },
      {
        'chs': '英文',
        'lang': 'en',
        "index": 2
      },
      {
        'chs': '日文',
        'lang': 'ja',
        "index": 3
      },
      {
        'chs': '韩文',
        'lang': 'ko',
        "index": 4
      },
      {
        'chs': '法文',
        'lang': 'fr',
        "index": 5
      },
      {
        'chs': '西班牙文',
        'lang': 'es',
        "index": 6
      },
      {
        'chs': '葡萄牙文',
        'lang': 'pt',
        "index": 7
      },
      {
        'chs': '意大利文',
        'lang': 'it',
        "index": 8
      },
      {
        'chs': '俄文',
        'lang': 'ru',
        "index": 9
      },
      {
        'chs': '德文',
        'lang': 'de',
        "index": 10
      }, 
      {
        'chs': '阿拉伯文',
        'lang': 'ar',
        "index": 11
      }
    ]
  }
})