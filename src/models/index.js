const mongoose = require('mongoose').set('debug', true)
const bulk = require('bulk-require')
const dbConfig = require('../config').db

mongoose.Promise = require('bluebird')

mongoose.connect(
  `${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`,
  { promiseLibrary: require('bluebird') }
)

const models = bulk(__dirname, ['./!(*index).js']) // 路由配置文件的集合, 忽略 index.js
const db = {}

// 加载 model
Object.keys(models).forEach((item) => {
  db[item] = mongoose.model(item, models[item])
})

module.exports = db
