const express = require('express')

const app = express()

const PORT = 8080 || process.env.PORT

app.get('/', (req, res) => {
	res.end('Hello Docker World')
})

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`)
})
