const mongoose = require('mongoose')

// 自定义模块
global.dbHelper = require('./libs/dbHelper')

// 引入配置文件
const config = require('./config')

// 连接数据库
mongoose.connect(`mongodb://${config.mongodb_url}`, function (err) {
  if (err) {
    console.log('数据库连接失败')
  }
})

// const canvasModel = global.dbHelper.getModel('t_canvas')
// const userModel = global.dbHelper.getModel('t_user')
// const commentModel = global.dbHelper.getModel('t_comment')
const listModel = global.dbHelper.getModel('t_list')

listModel.create(
  {
    name: '布娃娃',
    description: '三个字，儿童玩具'
  },
  {
    name: '激光',
    description: '两个字，光学武器'
  },
  {
    name: '餐巾纸',
    description: '三个字，餐具'
  },
  {
    name: ' 大脖子病',
    description: '四个字个字，一种病症'
  },
  {
    name: '仓库',
    description: '两个字，建筑类'
  },
  {
    name: '丁字裤',
    description: '三个字，一种内衣'
  },
  {
    name: '蜂蜜',
    description: '两个字，食品类'
  },
  {
    name: '瓷器',
    description: '两个字，容器类'
  },
  {
    name: '人民币',
    description: '三个字，货币类'
  },
  {
    name: '手纸',
    description: '两个字，日用品'
  },
  {
    name: '草泥马',
    description: '三个字，一种动物'
  },
  {
    name: '司马光',
    description: '三个字，古代小英雄'
  },
  {
    name: 'KTV',
    description: '三个字母，一种场合'
  },
  {
    name: '董存瑞',
    description: '三个字，历史人物'
  }
)
