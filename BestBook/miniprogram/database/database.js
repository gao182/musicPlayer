const app = getApp()
const db = wx.cloud.database()
//新增用户
function adduser(userinfo) {
  db.collection('userinfo').add({
    data: {
      name: userinfo.name,
      avatarUrl: userinfo.avatarUrl,
      fan: 0,
      attention: 0,
      popularity: 0
    },
    success: res => {
      wx.showToast({
        title: '加入美句集成功',
      })
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '加入美句集失败'
      })
      console.error('[数据库] [新增记录] 失败：', err)
    }
  })
}

//新增照片
function addData(data) {
  if (data.imgUrl.match('images/img.png') === null) {
    const urlArray = data.imgUrl.split('.')
    const path = urlArray[urlArray.length - 2] + "." + urlArray[urlArray.length - 1]
    wx.cloud.uploadFile({
      cloudPath: path,
      filePath: data.imgUrl,
    }).then(res => {
      data.imgUrl = res.fileID
      if (data.text)
        addJz(data)
      else
        addJj(data)
    }).catch(err => {
      console.error(err)
    })
  } else {
    data.imgUrl = ""
    if (data.text)
      addJz(data)
    else
      addJj(data)
  }

}

//新增句子
function addJz(data) {
  db.collection('juzi').add({
    data: {
      text: data.text,
      imgUrl: data.imgUrl,
      label: data.label,
      author: data.author,
      from: data.from,
      juji: data.juji,
      time: db.serverDate()
    },
    success: function (res) {
      wx.showToast({
        title: '新增记录成功',
        success() {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      })
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '新增记录失败'
      })
      console.error('[数据库] [新增记录] 失败：', err)
    }
  })
}

//新增句集
function addJj(data) {
  db.collection('juji').add({
    data: {
      jujiName: data.jujiName,
      jujidesc: data.jujidesc,
      imgUrl: data.imgUrl
    },
    success: function (res) {
      wx.showToast({
        title: '新增记录成功',
        success() {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      })
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '新增记录失败'
      })
      console.error('[数据库] [新增记录] 失败：', err)
    }
  })
}

export {
  adduser,
  addData
}