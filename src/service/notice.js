const _ = require('lodash');
const db = require('../models');
const { hasEvery } = require('../utils');

const Notice = db.notice;

async function getNotices() {
  return Notice.find({ deleted: false });
}

const noticeAttr = [
  'nickname',
  'text',
];

async function addNotice(notice) {
  if (!hasEvery(notice, noticeAttr)) {
    return Promise.reject('incomplete parameters');
  }

  notice = _.pick(notice, noticeAttr);

  return Notice.create(notice);
}

async function removeOneNotice(noticeId) {
  return Notice.updateOne(
    { _id: noticeId },
    { $set: { deleted: true }, }
  );
}

module.exports = {
  getNotices,
  addNotice,
  removeOneNotice,
};
