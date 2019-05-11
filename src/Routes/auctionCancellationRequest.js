const auctionControllers = require('../Controllers/auctionCancellationRequest')

module.exports = app => {
	app
		.route('/leilao-pendente-cancelamento')
		.get(auctionControllers.getAuctionCancellationRequests)

	app
		.route('/leilao-pendente-anulamento')
		.get(auctionControllers.getAuctionAnullmentRequests)

	app
		.route('/leilao-pendente-cancelamento')
		.post(auctionControllers.approveAuctionCancellation)

	app
		.route('/leilao-criar-cancelamento')
		.post(auctionControllers.makeCancelationRequest)
}
