const { prisma } = require('../../generated/prisma-client')

const getUserById = async (req, res) => {
    const { id } = req.params
    const user = await prisma.user({ id })
    res.json({ ...user, password: null })
}

const createUser = async (req, res) => {
    const { email, password } = req.body
    const user = await prisma.createUser({ email, password })
    res.json({ ...user, password: null })
}

const deleteUser = async (req, res) => {
    const { id } = req.params
    const user = await prisma.updateUser({ where: { id }, data: { active: false } })
    res.json({ ...user, password: null })
}

const updatePassword = async (req, res) => {
    const { id, password } = req.body
    const user = await prisma.updateUser({ where: { id }, data: { password } })
    res.json({ ...user, password: null })
}

module.exports = {
    getUserById,
    createUser,
    deleteUser,
    updatePassword
}