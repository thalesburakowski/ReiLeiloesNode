const bankAccountControllers = require('../Controllers/bankAccount')

module.exports = app => {
  app
    .route('/banco')
    .post(bankAccountControllers.createBankAccount)
    .put(bankAccountControllers.updateName)

  app.route('/banco/:id').delete(bankAccountControllers.deleteBankAccount)

  app.route('/banco/:profileId').get(bankAccountControllers.getBankAccount)
}
