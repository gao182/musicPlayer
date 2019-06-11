const app = getApp()
const db = wx.cloud.database()

//成功
function showsucc(text) {
  wx.showToast({
    title: text
  })
}

//失败
function showerr(text) {
  wx.showToast({
    icon: 'none',
    title: text,
    success() {
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      }, 1000)
    }
  })
}


//查询用户信息
function getuser(uid) {
  return db.collection('userinfo').where({
    _openid: uid
  }).get()
}

//新增用户
function adduser(userinfo) {
  db.collection('userinfo').add({
    data: {
      nickName: userinfo.nickName,
      avatarUrl: userinfo.avatarUrl,
      fan: [],
      attention: [],
      popularity: 0
    }
  }).then(res => {
    app.globalData.userInfo._id = res._id
    showsucc('加入美句集成功')
  }).catch(err => showerr('加入美句集失败'))
}

//修改用户数据信息
function setuser(id, name, data) {
  if (name === "attention") {
    return db.collection("userinfo").doc(id).update({
      data: {
        attention: data
      }
    })
  } else if (name === "collect") {
    return db.collection("userinfo").doc(id).update({
      data: {
        collect: data
      }
    })
  } else {
    return db.collection("userinfo").doc(id).update({
      data: {
        nickName: data.nickName,
        avatarUrl: data.avatarUrl
      }
    })
  }
}

//新增含图片数据
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
      showerr('新增失败')
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
      avatarUrl: app.globalData.userInfo.avatarUrl,
      nickName: app.globalData.userInfo.nickName,
      text: data.text,
      imgUrl: data.imgUrl,
      label: data.label,
      author: data.author,
      from: data.from,
      juji: data.juji,
      time: db.serverDate(),
      love: 0,
      comment: [],
      collect: []
    },
    success: function(res) {
      wx.showToast({
        title: '新增记录成功',
        success() {
          app.globalData.addsuccess = true
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      })
    },
    fail: err => {
      showerr('新增记录失败')
    }
  })
}

//新增句集
function addJj(data) {
  db.collection('juji').add({
    data: {
      avatarUrl: app.globalData.userInfo.avatarUrl,
      nickName: app.globalData.userInfo.nickName,
      jujiName: data.jujiName,
      jujidesc: data.jujidesc,
      imgUrl: data.imgUrl
    },
    success: function(res) {
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
      showerr('新增记录失败')
    }
  })
}

//查询最新句子信息
function getJuzi(str) {
  return db.collection('juzi').orderBy('time', str).get()
}

//查询单个句子信息
function getcurrentJuzi(id) {
  return db.collection('juzi').where({
    _id: id
  }).get()
}

//查询用户句子信息
function getuserJuzi(userid, str) {
  return db.collection('juzi').where({
    _openid: userid
  }).orderBy('time', str).get()
}

//查询用户句子信息
function getuserallJuzi(userid) {
  return db.collection('juzi').where({
    _openid: userid
  }).get()
}

//修改句子信息
function setJuzi(id, name, data) {
  if (name === "user") {
    return db.collection("juzi").doc(id).update({
      data: {
        nickName: data.nickName,
        avatarUrl: data.avatarUrl
      }
    })
  } else if (name === "love") {
    console.log(id,data)
    return db.collection("juzi").doc(id).update({
      data: {
        love: data
      }
    })
  } else if (name === "collect") {
    return db.collection("juzi").doc(id).update({
      data: {
        collect: data
      }
    })
  }
}


//显示服务端存储图片
function getImginfo(imgurl) {
  let fileid = []
  imgurl.forEach(e => {
    fileid.push(e.imgUrl)
  })
  return wx.cloud.getTempFileURL({
    fileList: fileid
  })
}

//查询分类
function getClassify(style, name) {
  return db.collection(style).where({
    name: name
  }).get()
}

//增加分类
function addClassify(style, name, author) {
  db.collection(style).add({
    data: {
      name: name,
      author: author,
      imgUrl: "",
      description: "",
      count: 1
    }
  })
}

//修改分类
function setClassify(style, id, data) {
  return db.collection(style).doc(id).update({
    data: { count: data }
  })
}

export {
  showsucc,
  showerr,
  getuser,
  adduser,
  setuser,
  addData,
  getJuzi,
  getcurrentJuzi,
  getuserJuzi,
  getuserallJuzi,
  setJuzi,
  getImginfo,
  getClassify,
  addClassify,
  setClassify
}