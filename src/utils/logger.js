const log4js = require('log4js');
const config = require('../config');

log4js.configure(config.log);

module.exports = log4js;
