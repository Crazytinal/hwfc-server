const Schema = require('mongoose').Schema
const essaySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  uploadTime: {
    type: Date
  },
  author: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, {
  toObject: {
    transform: function (doc, ret, options) {
      ret.id = ret._id
      delete ret.__v
      delete ret._id
      return ret
    }
  },
  toJSON: {
    virtuals: true,
    transform: function (doc, ret, options) {
      delete ret.content
      delete ret.__v
      delete ret._id
      return ret
    }
  }
})
/**
 * 默认情况，直接返回查询后的结果，只有brief，没有content。
 * 对查询后的结果调用toObject并返回，则只有content，没有brief。
 * 另外2种方式都删除了丑陋的的__v和_id
 */

// 保存时自动添加上传时间
essaySchema.pre('save', function (next) {
  this.uploadTime = new Date()
  next()
})

// 虚拟属性brief
essaySchema.virtual('brief').get(function () {
  return this.content.substr(0, 120)
})

module.exports = essaySchema
