const _ = require('lodash');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const db = require('../models');
const { hasEvery } = require('../utils');

const User = db.user;
const House = db.house;
const Activity = db.activity;

const config = require('../config');
const rp = require('request-promise');

async function getUsers() {
  return User.find({ deleted: false });
}

async function getUser(userId) {
  return User.findOne(
    {
      _id: userId,
      deleted: false
    }
  );
}

async function getUserByOpenId(openid) {
  return User.findOne(
    {
      openid: openid,
      deleted: false
    }
  );
}

async function getUserByCode(code) {
  return User.findOne(
    {
      code: code,
      deleted: false
    });
}

const userAttr = [
  'nickname',

];

const userFullAttr = [
  'headimgurl',
  'nickname',
  'sex',
  'realname',
  'birthday',
  'phone',
  'income',
  'industry',
  'company',
  'job',
];

async function createUser(user) {
  if (!hasEvery(user, userAttr)) {
    return Promise.reject('incomplete parameters');
  }
  return User.create(user);
}

async function upsertUserByOpenId(openid, user) {
  return User.update(
    { openid: openid},
    user,
    {
      upsert: true,
      setDefaultsOnInsert: true
    });
}

async function updateUser(userId, newUser) {
  newUser = _.pick(newUser, userFullAttr);
  return User.update(
  {
    _id: userId,
    deleted: false
  },
  {
    $set: newUser
  });
}

async function getFavorActivity(userId) {
  return User.findOne({_id: userId})
    .populate('favorActivity', '-members')
    .then(res => {
      return Promise.resolve(res.favorActivity)
    })

}

async function addFavorActivity(userId, activityId) {
  const activity = await Activity.findOne({_id: activityId})
  if (!activity) {
    return Promise.reject('activity not found');
  }

  return User.update(
  {
    _id: userId,
  },
  {
    $addToSet: {
      'favorActivity': ObjectId(activityId)
    }
  });

}

async function cancelFavorActivity(userId, activityId) {
  const activity = await Activity.findOne({_id: activityId})
  if (!activity) {
    return Promise.reject('activity not found');
  }
  return User.update(
  {
    _id: userId,
  },
  {
    $pull: {
      'favorActivity': ObjectId(activityId)
    }
  });
}

async function getRegistedActivity(userId) {

  return User.findOne({_id: userId})
          .populate('registedActivity')
          .then(res => {
            console.log(res.registedActivity);
            return Promise.resolve(res && res.registedActivity)
          });

}

async function addRegistedActivity(userId, activityId) {
  const activity = await Activity.findOne({_id: activityId})
  if (!activity) {
    return Promise.reject('activity not found');
  }

  // if (!ticketTypeId) {
  //   return Promise.reject('please specify ticketTypeId');
  // }

  return User.update(
  {
    _id: userId,
  },
  {
    $addToSet: {
      'registedActivity':  ObjectId(activityId)
    }
  });

}

async function cancelRegistedActivity(userId, activityId) {
  const activity = await Activity.findOne({_id: activityId})
  if (!activity) {
    return Promise.reject('activity not found');
  }

  // if (!ticketTypeId) {
  //   return Promise.reject('please specify ticketTypeId');
  // }

  return User.update(
  {
    _id: userId,
  },
  {
    $pull: {
      'registedActivity':  ObjectId(activityId)
      // 'registedActivity': {
        // activityId: ObjectId(activityId),
        // ticketTypeId: ticketTypeId,
      }
  });
}

async function getFavorHouse(userId) {
    return    User.findOne({_id: userId})
      .populate('house')
      .then(res => {
        return Promise.resolve(res.house)
    })
}

async function addFavorHouse(userId, houseId) {
  const house = await House.findOne({_id: houseId})
  if (!house) {
    return Promise.reject('House not found');
  }

  return User.update(
  {
    _id: userId,
  },
  {
    $addToSet: {
      'house': ObjectId(houseId)
    }
  });

}

async function cancelFavorHouse(userId, houseId) {
  const house = await House.findOne({_id: houseId})
  if (!house) {
    return Promise.reject('House not found');
  }

  return User.update(
  {
    _id: userId,
  },
  {
    $pull: {
      'house': ObjectId(houseId)
    }
  });
}



async function getAccessToken(code) {
  const options = {
    uri: 'https://api.weixin.qq.com/sns/oauth2/access_token',
    qs: {
      appid: config.appid,
      secret: config.secret,
      code: code,
      grant_type: 'authorization_code' 
    },
    json: true
  }
  return rp(options);
}

async function checkAccessToken(access_token, openid) {
  const options = {
    uri: 'https://api.weixin.qq.com/sns/auth',
    qs: {
      openid: openid,
      access_token: access_token,
    },
    json: true
  }
  return rp(options);
}

async function refreshAccessToken(refresh_token) {
  const options = {
    uri: 'https://api.weixin.qq.com/sns/oauth2/refresh_token',
    qs: {
      appid: config.appid,
      refresh_token: refresh_token,
      grant_type: 'refresh_token' 
    },
    json: true
  }
  return rp(options);
}

async function getWechatUserInfo(access_token, openid) {
  const userInfoOptions = {
    uri: 'https://api.weixin.qq.com/sns/userinfo',
    qs: {
      access_token: access_token,
      openid: openid,
      lang: 'zh_CN'
    },
    json: true
  }
  return rp(userInfoOptions);
}


module.exports = {
  getUsers,
  getUser,
  getUserByOpenId,
  getUserByCode,
  createUser,
  updateUser,
  upsertUserByOpenId,
  getFavorActivity,
  addFavorActivity,
  cancelFavorActivity,
  getRegistedActivity,
  addRegistedActivity,
  cancelRegistedActivity,
  getFavorHouse,
  addFavorHouse,
  cancelFavorHouse,
  getAccessToken,
  checkAccessToken,
  refreshAccessToken,
  getWechatUserInfo
};
