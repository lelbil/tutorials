const Koa = require('koa')

const app = new Koa()
const PORT = process.env.PORT || 3000

app.use(async ctx => {
    ctx.body = "Hello World from the back side (hehe)"
})

app.listen(PORT, err => {
    if (err) console.log('There has been an error, and why the hell am I still using callbacks')
    console.log('app listening on port: ' + PORT)
})