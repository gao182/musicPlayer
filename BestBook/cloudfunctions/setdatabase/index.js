// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    if (event.name === "fan") {
      return await db.collection("userinfo").doc(event.id).update({
        data: { attention: event.data }
      })
    } else if (event.name === "popularity") {
      return db.collection("userinfo").doc(event.id).update({
        data: {
          popularity: event.data
        }
      })
    } else if (event.name === "love") {
      return await db.collection("juzi").doc(event.id).update({
        data: { love: event.data }
      })
    }
  } catch (e) {
    console.error(e)
  }
}