const auctionControllers = require('../Controllers/auctionCancellationRequest')

module.exports = app => {
	app
		.route('/leilao-pendente-cancelamento')
		.get(auctionControllers.getAuctionCancellationRequests)

	app
		.route('/leilao-pendente-cancelamento')
		.post(auctionControllers.approveAuction)

	app
		.route('/leilao-criar-cancelamento')
		.post(auctionControllers.makeCancelationRequest)
}
