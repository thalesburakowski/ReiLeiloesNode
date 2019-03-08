const { prisma } = require('../../generated/prisma-client')
const { responsePrismaError } = require('./utils')

const getUserById = async (req, res) => {
  const { id } = req.params
  try {
    const user = await prisma.user({ id })
    res.json({ ...user, password: null })
  } catch (error) {
    responsePrismaError(res, error)
  }
}

const Login = async (req, res) => {
  const { Email, Password } = req.body
  try {
    const user = await prisma.user({ email: Email })
    if (user.password == Password) {
      res.json({ ...user, password: null })
      return
    }
    res.json({ message: 'Email ou senha incorretas!' })
  } catch (error) {
    responsePrismaError(res, error)
  }
}

const verifyEmail = async (req, res) => {
  console.log('verifyEmail')

  const { Email } = req.body
  try {
    const user = await prisma.user({ email: Email })
    if (!user) {
      res.json({ response: "inexistente" })
    } else if (!user.active) {
      res.json({ response: "ativo" })
    } else if (user.active) {
      res.json({ response: "inativo" })
    }
  } catch (error) {
    responsePrismaError(res, error)
  }
}

const reactivateUser = async (req, res) => {
  const { Email, Password } = req.body
  try {
    const user = await prisma.updateUser({
      where: { email: Email },
      data: { password: Password, active: true },
    })

    res.json(user)
  } catch (error) {}
}

const createUser = async (req, res) => {
  const { Email, Password } = req.body
  try {
    const user = await prisma.createUser({ email: Email, password: Password })
    res.json({ ...user, password: null })
  } catch (error) {
    responsePrismaError(res, error)
  }
}

const createAdmin = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await prisma.createUser({ email, password, flgAdmin: true })
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
  const { Id, Password } = req.body
  try {
    const user = await prisma.updateUser({
      where: { id: Id },
      data: { password: Password },
    })
    res.json({ ...user, password: null })
  } catch (error) {
    responsePrismaError(res, error)
  }
}

module.exports = {
  Login,
  getUserById,
  verifyEmail,
  reactivateUser,
  createUser,
  createAdmin,
  deleteUser,
  updatePassword,
}
