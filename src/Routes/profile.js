const app = require('express').Router()
const profileControllers = require('../Controllers/profile')

app.route('/profile')
    .post(profileControllers.createProfile)
    // .put(profileControllers.updatePassword)

app.route('/profile/:id')
    .get(profileControllers.getProfileByUserId)
    // .delete(profileControllers.deleteprofile)

module.exports = app
