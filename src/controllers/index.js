const Router = require('koa-router')
const compose = require('koa-compose')

const essayController = require('./essay')

const router = new Router({
  prefix: '/api'
})

essayController(router)

module.exports = () => compose([
  router.routes(),
  router.allowedMethods()
])
