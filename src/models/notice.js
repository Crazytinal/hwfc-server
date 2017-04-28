module.exports = {
  nickname: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: new Date(),
  },
  deleted: {
    type: String,
    default: false,
  },
};
