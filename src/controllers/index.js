const Router = require('koa-router');
const compose = require('koa-compose');

const userCtrl = require('./user');
const themeCtrl = require('./theme');
const actvtCtrl = require('./activity');
const noticeCtrl = require('./notice');
const houseCtrl = require('./house');
const agentCtrl = require('./agent');
const videoCtrl = require('./video');
const adminCtrl = require('./admin');

const router = new Router({
  prefix: '/api',
});

userCtrl(router);
themeCtrl(router);
actvtCtrl(router);
noticeCtrl(router);
houseCtrl(router);
agentCtrl(router);
videoCtrl(router);
adminCtrl(router);

module.exports = () => compose([
  router.routes(),
  router.allowedMethods(),
]);
