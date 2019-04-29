const auctionControllers = require('../Controllers/auction')

module.exports = app => {
	app.route('/leilao').post(auctionControllers.createAuction)
	app.route('/leilao-aprovado').get(auctionControllers.getApprovedAcutions)
	app.route('/leilao-lance').post(auctionControllers.bidAuction)
	app.route('/leilao-historico-lance/:auctionId').post(auctionControllers.getHistoricBids)
	app.route('/leilao-transporte').post(auctionControllers.deliveryAuction)

	app.route('/leilao/:auctionId').get(auctionControllers.getAuction)
}
