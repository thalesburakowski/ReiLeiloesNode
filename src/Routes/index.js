const app = require('express').Router()

require('../Routes/user')(app)
require('../Routes/profile')(app)
require('../Routes/address')(app)
require('../Routes/creditCard')(app)
require('../Routes/bankAccount')(app)
require('../Routes/wallet')(app)
require('../Routes/auction')(app)
require('../Routes/category')(app)
require('../Routes/auctionRequest')(app)
require('../Routes/auctionCancellationRequest')(app)
require('../Routes/analyze')(app)


module.exports = app
