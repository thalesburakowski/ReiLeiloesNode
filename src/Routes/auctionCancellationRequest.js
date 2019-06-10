const auctionControllers = require('../Controllers/auctionCancellationRequest')

module.exports = app => {
	app
		.route('/leilao-pendente-anulamento')
		.get(auctionControllers.getAuctionAnnulmentRequests)

	app
		.route('/leilao-pendente-anulamento')
		.post(auctionControllers.approveAuctionAnnulment)

	app
		.route('/leilao-criar-anulamento')
		.post(auctionControllers.makeAnnulmentRequest)

	app
		.route('/leilao-criar-cancelamento')
		.post(auctionControllers.makeCancelRequest)

	app
		.route('/leilao-enviando-anulamento')
		.post(auctionControllers.sendingProductAnnulled)

	app
		.route('/leilao-aceitar-anulamento')
		.post(auctionControllers.acceptAuctionAnnuled)
}
