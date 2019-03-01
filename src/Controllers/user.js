const { prisma } = require('../../generated/prisma-client')
const { responsePrismaError } = require('./utils')

const getUserById = async (req, res) => {
  const { id } = req.params
  try {
    const user = await prisma.user({ id })
    res.send(200).json({ ...user, password: null })
  } catch (error) {
    responsePrismaError(res, error)
  }
}

const createUser = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await prisma.createUser({ email, password })
    res.json({ ...user, password: null })
  } catch (error) {
    responsePrismaError(res, error)
  }
}

const deleteUser = async (req, res) => {
  const { id } = req.params
  try {
    const user = await prisma.updateUser({
      where: { id },
      data: { active: false },
    })
    res.json({ ...user, password: null })
  } catch (error) {
    responsePrismaError(res, error)
  }
}

const updatePassword = async (req, res) => {
  const { id, password } = req.body
  try {
    const user = await prisma.updateUser({ where: { id }, data: { password } })
    res.json({ ...user, password: null })
  } catch (error) {
    responsePrismaError(res, error)
  }
}

module.exports = {
  getUserById,
  createUser,
  deleteUser,
  updatePassword,
}
