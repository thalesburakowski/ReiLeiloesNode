const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const routes = require('./Routes')
const { executeSchedules } = require('./Jobs')

const PORT = 3000

const app = express()

app.use(bodyParser.json())
app.use(cors())

app.use(routes)

executeSchedules()

app.listen(PORT, () => console.log(`Server running at port ${PORT}`))
