const addressControllers = require('../Controllers/address')

module.exports = app => {
  app
    .route('/address')
    .post(addressControllers.createAddress)
    .put(addressControllers.updateName)

  app
    .route('/address/:profileId')
    .get(addressControllers.getAllAddressesByProfileId)

  app.route('/address/:id').delete(addressControllers.deleteAddress)
}
