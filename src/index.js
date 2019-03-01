const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./Routes/user')

const PORT = 3000

const app = express()

app.use(bodyParser.json())

app.use(routes)

app.listen(PORT, () => console.log(`Server running at port ${PORT}`))
