const profileControllers = require('../Controllers/profile')

module.exports = app => {
  app.route('/profile').post(profileControllers.createProfile)
  // .put(profileControllers.updatePassword)

  app.route('/profile/:id').get(profileControllers.getProfileByUserId)

  app.route('/profile/get-by-cpf/:cpf').get(profileControllers.getProfileByCpf)

  app.route('/profile/get-by-rg/:rg').get(profileControllers.getProfileByRg)

  app.route('/profile/get-by-nick/:nick').get(profileControllers.getProfileByNick)
  // .delete(profileControllers.deleteprofile)
}
