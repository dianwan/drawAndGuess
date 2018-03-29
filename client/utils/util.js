const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  // const minute = date.getMinutes()
  // const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 计算随机数
const generateRandomNumber = (min, max) => {
  if (min && !max) {
    return parseInt(Math.random() * min + 1, 10)
  }
  if (min && max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}

module.exports = {
  formatTime,
  generateRandomNumber
}
