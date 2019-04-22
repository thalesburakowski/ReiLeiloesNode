const auctionControllers = require('../Controllers/auctionRequest')

module.exports = app => {
	app.route('/leilao-pendente').get(auctionControllers.getAuctions)

	app.route('/leilao-pendente').post(auctionControllers.approveAuction)
}
