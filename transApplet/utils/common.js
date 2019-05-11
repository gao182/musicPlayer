/*显示是否收藏*/
function hassave(data) {
  let collect = wx.getStorageSync("collect") || []
  let index = -1
  if(collect.length < 1){
      index = -1
  } else {
    collect.findIndex((e, i, a) => {
      if (e.query === data.query && e.translation === data.translation) {
        index = i
      }
    })
  }
  return index
}

//收藏后历史记录也修改
function savehistory(data,issave) {
  let history = wx.getStorageSync("history")
  history.findIndex((e, i, a) => {
    if (e.query === data.query && e.translation === data.translation) {
      e.save = issave
      wx.setStorageSync("history", a)
    }
  })
}

function fullall(type, index) {
  wx.navigateTo({
    url: `../full/full?type=${type}&index=${index}`
  })
}
function copytext(text) {
  wx.setClipboardData({
    data: text,
    success() {
      wx.showToast({
        title: '复制成功',
      })
    }
  })
}

export { hassave, savehistory, fullall, copytext}