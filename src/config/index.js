const dev = require('./dev.env');
const prod = require('./prod.env');

const config = process.env.NODE_ENV === 'production' ? prod : dev;

module.exports = config;
