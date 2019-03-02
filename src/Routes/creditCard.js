const creditCardControllers = require('../Controllers/creditCard')

module.exports = app => {
  app.route('/cartao').post(creditCardControllers.createCreditCard)
  // .put(profileControllers.updatePassword)

  app.route('/cartao/:id').delete(creditCardControllers.deleteCreditCard)

  app.route('/cartao/:profileId').get(creditCardControllers.getAllCreditCardByProfileId)
  // .delete(profileControllers.deleteprofile)
}
