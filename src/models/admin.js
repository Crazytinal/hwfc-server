const mongoose = require('mongoose');
const validator = require('validator');
const ObjectId = mongoose.Schema.Types.ObjectId;
module.exports = {
  username: {
    type: String,
    required: true,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
  },
  permission: {
    type: Array,
    default: [],
    maxlength: 20,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
};
