const express = require('express')
const bodyParser = require('body-parser')
const routeUser = require('./Routes/user')
const routeProfile = require('./Routes/profile')

const PORT = 3000

const app = express()

app.use(bodyParser.json())

app.use(routeUser)

app.use(routeProfile)

app.listen(PORT, () => console.log(`Server running at port ${PORT}`))
