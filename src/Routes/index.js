const app = require('express').Router()

require('../Routes/user')(app)
require('../Routes/profile')(app)

module.exports = app
