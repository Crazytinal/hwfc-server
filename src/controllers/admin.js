const Router = require('koa-router');
const { sendData, handleError } = require('../utils');
const adminService = require('../service/admin');

const adminRtr = new Router({
  prefix: '/admin',
});

adminRtr.get('/', adminService.requirePermission('admin'), getAdminList);
adminRtr.post('/', adminService.requirePermission('admin'), createOneAdmin);
adminRtr.delete('/:adminId', adminService.requirePermission('admin'), deleteOneAdmin);
adminRtr.put('/:adminId', adminService.requirePermission('admin'), updateOneAdmin);

async function getAdminList(ctx) {
  const adminList = await adminService.getAdmins();
  sendData(ctx, adminList);
}

async function createOneAdmin(ctx) {
  await adminService.addAdmin(ctx.request.body)
    .then(() => ctx.status = 200)
    .catch(err => handleError(ctx, err, 400));
}

async function deleteOneAdmin(ctx) {
  const { adminId } = ctx.params;

  await adminService.removeOneAdmin(adminId)
    .then(() => ctx.status = 200)
    .catch(err => handleError(ctx, err, 404));
}

async function updateOneAdmin(ctx) {
  const { adminId } = ctx.params;

  await adminService.updateOneAdmin(adminId, ctx.request.body)
    .then(() => ctx.status = 200)
    .catch(err => handleError(ctx, err, 404));
}

module.exports = (router) => {
  router.use(adminRtr.routes());
  router.use(adminRtr.allowedMethods());
};
