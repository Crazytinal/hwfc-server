const _ = require('lodash');
const db = require('../models');
const { hasEvery, handleError } = require('../utils');

const Admin = db.admin;

async function getAdmins() {
  return Admin.find({ deleted: false });
}

async function getOneAdmin(adminId) {
  return Admin.findOne({_id: adminId, deleted: false});
}

async function isAdminExist(username, password) {
  return Admin.findOne(
    {
      username: username,
      password: password,
      deleted: false
    });
}

const adminAttr = [
  'username',
  'password',
  // 'permission',
];

async function addAdmin(admin) {
  if (!hasEvery(admin, adminAttr)) {
    return Promise.reject('incomplete parameters');
  }
  let { permission } = admin;
  
  // console.log(permission.replace(/[\x20\t\r\n\f]+/g ,'').split(','));

  // delete whitespace 
  admin.permission = permission.replace(/[\x20\t\r\n\f]+/g ,'').split(',');

  return Admin.create(admin);
}


async function removeOneAdmin(adminId) {
  return Admin.updateOne(
    { _id: adminId },
    { $set: { deleted: true }, }
  );
}

async function updateOneAdmin(adminId, newAdmin) {
  let { permission } = newAdmin;
  
  // console.log(permission.replace(/[\x20\t\r\n\f]+/g ,'').split(','));
  
  // delete whitespace 
  newAdmin.permission = permission.replace(/[\x20\t\r\n\f]+/g ,'').split(',');
  return Admin.updateOne(
    { _id: adminId },
    { $set: newAdmin}
  );  
}

function requirePermission(permission) {

  return async function(ctx, next) {

    // ignore favicon
    if (ctx.path === '/favicon.ico') return;
    console.log(permission, ctx.session);
    if (ctx.session.role === 'admin' &&
        ctx.session.permission &&
        ctx.session.permission.indexOf(permission) !== -1 ) {
        return next();
    }
    else 
      return handleError(ctx, 'not permitted', 401);
      // return next();
  }
};

module.exports = {
  getAdmins,
  getOneAdmin,
  isAdminExist,
  addAdmin,
  updateOneAdmin,
  removeOneAdmin,
  requirePermission,
};
