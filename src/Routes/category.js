const categoryControllers = require('../Controllers/category')

module.exports = app => {
	app.route('/categorias/').get(categoryControllers.getCategories)
}
