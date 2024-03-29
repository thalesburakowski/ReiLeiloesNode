const userControllers = require('../Controllers/user')

module.exports = app => {
  app
    .route('/user')
    .post(userControllers.createUser)
    .put(userControllers.updatePassword)

  app.route('/login').post(userControllers.Login)

  app.route('/verifyEmail').post(userControllers.verifyEmail)

  app.route('/reactivateUser').put(userControllers.reactivateUser)

  app.route('/admin').post(userControllers.createAdmin)

  app
    .route('/user/:id')
    .get(userControllers.getUserById)
    .delete(userControllers.deleteUser)

  // app
  //   .route('/admin/:id')
  //   .get(userControllers.getUserById)
  //   .delete(userControllers.deleteUser)
}
