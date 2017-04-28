const Router = require('koa-router');
const { sendData, handleError, handleUpdateResult } = require('../utils');
const userService = require('../service/user');
const adminService = require('../service/admin');
const activityService = require('../service/activity');
const path = require('path');
const _ = require('lodash');
const config = require('../config');

const multer = require('koa-multer');

const userRtr = new Router({
  prefix: '/user',
});


const avatarsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(config.static, 'avatars'));
  },
  filename: function (req, file, cb) {
    let extname = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + extname);
  }
});

const avatarsUpload = multer({
  storage: avatarsStorage,
  limits: {fileSize: 2000000}
});

userRtr.post('/login', userLogin);

// userRtr.get('/', adminService.requirePermission('user'), getUserList);
userRtr.get('/' , getUserList);
userRtr.get('/:userId', getUserDetail);
userRtr.post('/', avatarsUpload.single('avatar'), createOneUser);
userRtr.put('/:userId', avatarsUpload.single('avatar'), updateOneUser);

userRtr.get('/:userId/favorActivity', getUserFavoriteActivity);
userRtr.post('/:userId/favorActivity', setUserFavoriteActivity);

userRtr.get('/:userId/registedActivity', getUserRegistedActivity);

userRtr.get('/:userId/house', getUserFavoriteHouse);
userRtr.post('/:userId/house', setUserFavoriteHouse);

async function userLogin(ctx) {
  const { code, state, username, password } = ctx.request.body;
  console.log(code, config.appid, config.secret)
  if (state === 'user') {
    let access_token,
        refresh_token,
        openid ;
    console.log('code: ', code);
    if ( code ) {
      // find user by code 
      // if no user, 
      // if exist, CODE SAME? check access_token?? get info : refresh token  ? get token : GET ACCESTOKEN
      let user = await userService.getUserByCode(code);
      console.log(user)
      if ( user ) {

        ({ accessToken: access_token,  refreshToken: refresh_token, openid } = user);
        console.log('session openid', ctx.session.openid);
        console.log('user openid', openid);
        if (ctx.session.openid !== openid) {
          return handleError(ctx, 'not your openid');
        }

        let accessTokenIsValid =  access_token &&  await userService.checkAccessToken(access_token, openid);

        // refresh accessToken if accessToken is invalid
        if ( !accessTokenIsValid || accessTokenIsValid.errcode !== 0) {
          let res = refresh_token && await userService.refreshAccessToken(refresh_token);
          console.log('refresh', refresh_token, res);
          
          // refresh code invalid
          if (res && res.errcode && res.errmsg) {

            let res = await userService.getAccessToken(code);

            if (res.errcode && res.errmsg) {
              console.log(res);
              return  handleError(ctx, 'wechat access_token error', 400);
            }
            
            ( {access_token, openid, refresh_token } = res );

          // successfully refresh token
          } else {
             ({ access_token, refresh_token } = res);
          }
        }
      }
      else {

            let res = await userService.getAccessToken(code);
            if (res.errcode && res.errmsg) {
              console.log(res);
              return  handleError(ctx, 'wechat access_token error', 400);
            }
            ( {access_token, openid, refresh_token } = res );
              console.log(res);
      }

      // console.log(res);
              console.log('access_token: ', access_token);

      res = await userService.getWechatUserInfo(access_token, openid);
      
      if (res.errcode && res.errmsg) {
        console.log(res);
        return  handleError(ctx, 'get wechat userinfo error', 400);
      }

      // console.log(res);
      ctx.session.role = 'user';
      ctx.session.openid = openid;

      res.accessToken = access_token;
      res.refreshToken = refresh_token;
      res.code = code;

      res = await userService.upsertUserByOpenId(openid, res);
      // console.log(res);
      user = await userService.getUserByOpenId(openid);
      sendData(ctx, user);
    }
    else handleError(ctx, 'code incomplete');
  }
  else if (state == 'admin') {
    // if exist user
    let admin = await adminService.isAdminExist(username, password);
    if(admin) {
      ctx.session.role = 'admin';
      ctx.session.permission = admin.permission;
      admin.set('password', undefined, {strict: false});
      sendData(ctx, admin);
    }
    else
      return handleError(ctx, 'admin not exist', 400);

  }
  else handleError(ctx, 'state incomplete', 400); 
}

async function getUserList(ctx) {
  const userList = await userService.getUsers();
  sendData(ctx, userList);
}

async function getUserDetail(ctx) {
  const { userId } = ctx.params;
  if (!userId) return handleError(ctx, 'userId not defined', 400);

  await userService.getUser(userId)
    .then(res => {
      if (!res) {
        handleError(ctx, 'user not found', 404);
      } else {
        sendData(ctx, res);
      }
    })
    .catch(err => handleError(ctx, err));
}

async function createOneUser(ctx) {
  console.log(ctx.req.file);
  if (ctx.req.file) {
    ctx.req.body.headimgurl = path.join('/avatars', path.basename(ctx.req.file.path));
  }
  await userService.createUser(ctx.req.body)
    .then(() => sendData(ctx, ctx.req.file.path))
    .catch(err => handleError(ctx, err, 400));
}

async function updateOneUser(ctx) {
  const {userId} = ctx.params;
  if (!userId) return handleError(ctx, 'userId not defined', 400);
  if (ctx.req.file) {
    ctx.req.body.headimgurl = path.join('/avatars', path.basename(ctx.req.file.path));
  }
    await userService.updateUser(userId, ctx.req.body)
    .then( res => handleUpdateResult(ctx, res))
    .catch(err => handleError(ctx, err, 400));
}

async function getUserFavoriteActivity(ctx) {
  const {userId} = ctx.params;
  if (!userId) return handleError(ctx, 'userId not defined', 400);

  let acts = await userService.getFavorActivity(userId);
  sendData(ctx, acts);

}

async function setUserFavoriteActivity(ctx) {
    const {userId} = ctx.params;
    const {activityId, state} = ctx.request.body
    if (!userId) return handleError(ctx, 'userId not defined', 400);
    if (!activityId) return handleError(ctx, 'activityId not defined', 400);

    if (state == '1') {
      await userService.addFavorActivity(userId, activityId)
        .then(res => handleUpdateResult(ctx, res))
        .catch(err => handleError(ctx, err, 400));
    } else if ( state == '0') {
        await userService.cancelFavorActivity(userId, activityId)
        .then(res => handleUpdateResult(ctx, res))
        .catch(err => handleError(ctx, err, 400));
    } else {
      handleError(ctx, 'state param not correct', 400);
    }
}

async function getUserRegistedActivity(ctx) {
  const {userId} = ctx.params;
  if (!userId) return handleError(ctx, 'userId not defined', 400);
  const activitys =  await userService.getRegistedActivity(userId);

  // let acts = activitys && await Promise.all(activitys.map(async act => {
  //   return activityService.getActvtTicket(act.activityId, act.ticketTypeId, userId);
  // }));
  // let res = _(acts)
  //           .map( act => act.length ? act[0] : '')
  //           .compact()
  //           .value();
  sendData(ctx, activitys);
}

async function setUserRegistedActivity(ctx) {
    const {userId} = ctx.params;
    const {activityId, state} = ctx.request.body;
    if (!userId) return handleError(ctx, 'userId not defined', 400);
    if (!activityId) return handleError(ctx, 'activityId not defined', 400);

    if (state == '1') {
      await userService.addRegistedActivity(userId, activityId)
        .then(res => handleUpdateResult(ctx, res))
        .catch(err => handleError(ctx, err, 400));
    } else if ( state == '0') {
        await userService.cancelRegistedActivity(userId, activityId)
        .then(res => handleUpdateResult(ctx, res))
        .catch(err => handleError(ctx, err, 400));
    } else {
      handleError(ctx, 'state param not correct', 400);
    }
}

async function getUserFavoriteHouse(ctx) {
  const {userId} = ctx.params;
  if (!userId) return handleError(ctx, 'userId not defined', 400);

  return userService.getFavorHouse(userId)
    .then(res => sendData(ctx, res));
}

async function setUserFavoriteHouse(ctx) {
    const {userId} = ctx.params;
    const {houseId, state} = ctx.request.body;
    if (!userId) return handleError(ctx, 'userId not defined', 400);
    if (!houseId) return handleError(ctx, 'houseId not defined', 400);

    if (state == '1') {
      await userService.addFavorHouse(userId, houseId)
        .then(res => handleUpdateResult(ctx, res))
        .catch(err => handleError(ctx, err, 400));
    } else if ( state == '0') {
      await userService.cancelFavorHouse(userId, houseId)
        .then(res => handleUpdateResult(ctx, res))
        .catch(err => handleError(ctx, err, 400));
    } else {
      handleError(ctx, 'state param not correct', 400);
    }
}

module.exports = (router) => {
  router.use(userRtr.routes());
  router.use(userRtr.allowedMethods());
};
