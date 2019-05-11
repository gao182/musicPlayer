import md5 from './md5.min.js'

const appKey = appKey
const key = key

function resData(q, from, to) {
  return new Promise((resolve, reject) => {
    let salt = Date.now()
    let sign = md5(appKey + q + salt + key)
    wx.request({
      url: 'https://openapi.youdao.com/api',
      data: {
        q,
        from,
        to,
        appKey,
        salt,
        sign,
        ext: "mp3",
        voice: 0
      },
      success(res){
        if (res.data && res.data.translation) {
          resolve(res.data)
        } else {
          reject({ status: 'error', msg: '翻译失败' })
          wx.showToast({
            title: '翻译失败',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail() {
        reject({ status: 'error', msg: '翻译失败' })
        wx.showToast({
          title: '网络异常',
          icon: 'none',
          duration: 2000
        })
      }
    })
  })
}

export {resData}