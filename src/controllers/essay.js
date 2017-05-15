const Router = require('koa-router')
const { sendData, handleError } = require('../utils')
const essayService = require('../service/essay')

const essayRouter = new Router({
  prefix: '/essays'
})

essayRouter.get('/', async function (ctx) {
  try {
    const essayList = await essayService.getEssays()
    sendData(ctx, essayList)
  } catch (err) {
    handleError(ctx, err)
  }
})

essayRouter.get('/hot', async function (ctx) {
  try {
    const hotEssays = await essayService.getHotEssay()
    if (hotEssays.length > 0) {
      sendData(ctx, hotEssays[0])
    } else {
      throw new ReferenceError(`There isn't any essay!`)
    }
  } catch (err) {
    handleError(ctx, err)
  }
})

essayRouter.get('/:id', async function (ctx) {
  const id = ctx.params.id
  try {
    const essay = await essayService.getEssay(id)
    if (essay) {
      sendData(ctx, essay.toObject())
    } else {
      throw new ReferenceError(`There isn't an essay with id ${id}!`)
    }
  } catch (err) {
    handleError(ctx, err)
  }
})

essayRouter.post('/', async function (ctx) {
  try {
    const newEssay = await essayService.addEssay(ctx.request.body)
    sendData(ctx, newEssay.toObject())
  } catch (err) {
    handleError(ctx, err)
  }
})

module.exports = (router) => {
  router.use(essayRouter.routes())
  router.use(essayRouter.allowedMethods())
}
