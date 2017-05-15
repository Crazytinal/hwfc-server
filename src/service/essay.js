const db = require('../models')

const Essay = db.essay

function getEssays () {
  return Essay.find()
}

function getEssay (id) {
  return Essay.findOne({_id: id})
}

function getHotEssay () {
  return Essay.find().sort('-uploadTime').limit(1)
}

function addEssay (essay) {
  return Essay.create(essay)
}

module.exports = {
  getEssays,
  getEssay,
  getHotEssay,
  addEssay
}
