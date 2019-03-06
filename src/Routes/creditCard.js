const creditCardControllers = require('../Controllers/creditCard')

module.exports = app => {
  app
    .route('/cartao')
    .post(creditCardControllers.createCreditCard)
    .put(creditCardControllers.updateName)

  app.route('/cartao/:id').delete(creditCardControllers.deleteCreditCard)

  app
    .route('/cartao/:profileId')
    .get(creditCardControllers.getAllCreditCardByProfileId)
}
