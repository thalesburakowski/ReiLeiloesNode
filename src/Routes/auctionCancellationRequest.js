const auctionControllers = require('../Controllers/auctionCancellationRequest')

module.exports = app => {
	app
		.route('/leilao-pendente-anulamento')
		.get(auctionControllers.getAuctionCancellationRequests)

	app
		.route('/leilao-pendente-anulamento')
		.post(auctionControllers.approveAuctionCancellation)

	app
		.route('/leilao-criar-anulamento')
		.post(auctionControllers.makeCancelationRequest)

	app
		.route('/leilao-criar-cancelamento')
		.post(auctionControllers.makeAnnulmentRequest)
}
