const app = require('express').Router()

require('../Routes/user')(app)
require('../Routes/profile')(app)
require('../Routes/address')(app)
require('../Routes/creditCard')(app)
require('../Routes/bankAccount')(app)

module.exports = app
