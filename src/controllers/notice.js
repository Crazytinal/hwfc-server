const Router = require('koa-router');
const { sendData, handleError } = require('../utils');
const noticeService = require('../service/notice');

const noticeRtr = new Router({
  prefix: '/notice',
});

noticeRtr.get('/', getNoticeList);
noticeRtr.post('/', createOneNotice);
noticeRtr.delete('/:noticeId', deleteOneNotice);

async function getNoticeList(ctx) {
  const noticeList = await noticeService.getNotices();
  sendData(ctx, noticeList);
}

async function createOneNotice(ctx) {
  await noticeService.addNotice(ctx.request.body)
    .then(() => ctx.status = 200)
    .catch(err => handleError(ctx, err, 400));
}

async function deleteOneNotice(ctx) {
  const { noticeId } = ctx.params;

  await noticeService.removeOneNotice(noticeId)
    .then(() => ctx.status = 200)
    .catch(err => handleError(ctx, err, 404));
}

module.exports = (router) => {
  router.use(noticeRtr.routes());
  router.use(noticeRtr.allowedMethods());
};
