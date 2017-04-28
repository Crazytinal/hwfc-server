const _ = require('lodash');
const log4js = require('./logger');
const logger = log4js.getLogger('error');


function sendData(ctx, data, statusCode = 200) {
  ctx.status = statusCode;
  ctx.body = {
    data,
  };
}

function hasEvery(obj, attrArr) {
  // console.log(obj, attrArr)
  return attrArr.every(key => _.has(obj, key));
}


/**
 * 检查数据库更新操作的返回值
 * 设定HTTP状态信息
 * @param ctx
 * @param res
 */
function handleUpdateResult(ctx, res) {
  if (res.n === 0) {
      handleError(ctx, 'element not found', 404);
      return 'not found';
    } else if (res.nModified === 0) {
      handleError(ctx, 'data not modified', 200);
      return 'not modified';
    } else {
      sendData(ctx, 'success operation');
      return ' success';
    }
  }


function handleError(ctx, err, statusCode = 500) {
  ctx.status = statusCode;
  if (typeof err === 'string') {
    logger.error(err);
    ctx.body = {err};
  }
  // 日志 todo
  // ctx.message = {err};
  // 用于调试
  if (err instanceof Error && process.env.NODE_ENV !== 'production') {
    ctx.status = 500;
    ctx.body = {
      status: 'error',
      cause: err.name,
      message: err.message
    };
    logger.error(err.message);
  }
}

/**
 * 检查对象缺少哪些必备的属性
 * @param Obj
 * @param neededAttrs
 */
function getMissedAttr(Obj, neededAttrs) {
  return _.filter(neededAttrs, attr => ! _.has(Obj, attr));
}



module.exports = {
  sendData,
  hasEvery,
  handleError,
  getMissedAttr,
  handleUpdateResult
};
