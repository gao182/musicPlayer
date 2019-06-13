// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async(event, context) => {
  try {
    switch (event.name) {
      case "fan":
        return await db.collection("userinfo").doc(event.id).update({
          data: { fan: event.data }
        })
      case "popularity":
        return db.collection("userinfo").doc(event.id).update({
          data: { popularity: event.data }
        })
      case "love":
        return await db.collection("juzi").doc(event.id).update({
          data: { love: event.data }
        })
      case "collectCount":
        return await db.collection("juzi").doc(event.id).update({
          data: { collectCount: event.data }
        })
      default:
        return
    }
  } catch (e) {
    console.error(e)
  }
}