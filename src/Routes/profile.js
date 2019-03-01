const profileControllers = require('../Controllers/profile')

module.exports = app => {
  app.route('/profile').post(profileControllers.createProfile)
  // .put(profileControllers.updatePassword)

  app.route('/profile/:id').get(profileControllers.getProfileByUserId)
  // .delete(profileControllers.deleteprofile)
}
