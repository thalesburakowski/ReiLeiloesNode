const profileControllers = require('../Controllers/profile')

module.exports = app => {
	app.route('/profile').post(profileControllers.createProfile)

	app.route('/profile/:id').get(profileControllers.getProfileByUserId)

	app.route('/profile/get-by-cpf/:cpf').get(profileControllers.getProfileByCpf)

	app.route('/profile/get-by-rg/:rg').get(profileControllers.getProfileByRg)

	app
		.route('/profile/get-by-nick/:nick')
		.get(profileControllers.getProfileByNick)

  app.route('/profile/historico/:profileId').get(profileControllers.getHistoric)
  
	app.route('/profile/historico-criados/:profileId').get(profileControllers.getHistoricCreated)

	app.route('/leilao-transporte-informacao').post(profileControllers.getTransportInformation)

}
