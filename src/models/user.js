const mongoose = require('mongoose');
const validator = require('validator');
const ObjectId = mongoose.Schema.Types.ObjectId;
module.exports = {
  headimgurl: {
    type: String,
  },
  nickname: {
    type: String,
    required: true,
    maxlength: 50
  },
  sex: {
    type: String,
    default: 'unknown',
  },
  realname: {
    type: String,
    default: 'unknown',
  },
  birthday: {
    type: String,
    default: 'unknown',
  },
  phone: {
    type: String,
    default: 'unknown',
    // validate: {
    //   validator: (value) => validator.isMobilePhone(value, 'zh-CN'),
    //   message: '{VALUE} is not a valid phone number!,'
    // }
  },
  income: {
    type: String,
    default: 'unknown',
  },
  industry: {
    type: String,
    default: 'unknown',
  },
  company: {
    type: String,
    default: 'unknown',
  },
  job: {
    type: String,
    default: 'unknown',
  },
  openid: {
    type: String,
  },
  unionid: {
    type: String,
  },
  code: {
    type: String,
  },
  accessToken: {
    type: String
  },
  refreshToken: {
    type: String
  },
  favorActivity: {
    type: [{type: ObjectId, ref: 'activity'}],
    default: []
  },
  registedActivity: {
    // type: [{ 
    //   _id: false,
    //   activityId: {
    //     type: ObjectId, ref: 'activity'
    //   },
    //   ticketTypeId: {
    //     type: ObjectId
    //   }
    // }],
    type: [{type:ObjectId, ref:'activity'}],    
    default: []
  },
  house: {
    type: [{type: ObjectId, ref: 'house'}],
    default: []
  },
  deleted: {
    type: Boolean,
    default: false,
  },
};
