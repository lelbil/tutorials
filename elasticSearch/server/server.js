const Koa = require('koa')
const Router = require('koa-router')
const joi = require('joi')
const validate = require('koa-joi-validate')

const search = require('./search')

const app = new Koa()
const router = new Router()

const PORT = process.env.PORT || 3000

router.get('/search', validate({
    query: {
        term: joi.string().max(254).required(),
        offset: joi.number().min(0).default(0),
    }
}), async ctx => {
    const {term, offset} = ctx.request.query

    ctx.body = await search.queryTerm(term, offset)
})

app
    .use(async (ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', '*')
        return next()
    })
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(PORT, err => {
        if (err) console.log('There has been an error, and why the hell am I still using callbacks')
        console.log('app listening on port: ' + PORT)
    })