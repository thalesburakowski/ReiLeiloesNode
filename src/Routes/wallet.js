const walletControllers = require('../Controllers/wallet')

module.exports = app => {
  app.route('/carteira/:profileId').get(walletControllers.getWalletByProfileId)
  app.route('/carteira/deposito').post(walletControllers.getWalletByProfileId)
  app.route('/carteira/saque').post(walletControllers.getWalletByProfileId)

}
