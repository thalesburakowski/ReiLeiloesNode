const app = require('express').Router()
const userControllers = require('../Controllers/user')

app.route('/user')
    .post(userControllers.createUser)
    .put(userControllers.updatePassword)

app.route('/user/:id')
    .get(userControllers.getUserById)
    .delete(userControllers.deleteUser)

module.exports = app
