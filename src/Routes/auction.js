const auctionControllers = require('../Controllers/auction')

module.exports = app => {
	app.route('/leilao').post(auctionControllers.createAuction)
	app.route('/leilao-lance').post(auctionControllers.bidAuction)

	app.route('/leilao/:profileId').get(auctionControllers.getAuction)
}
