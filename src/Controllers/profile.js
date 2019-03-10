const { prisma } = require('../../generated/prisma-client')
const { responsePrismaError } = require('./utils')

const getProfileByUserId = async (req, res) => {
  const { id } = req.params
  try {
    const profile = await prisma.user({ id }).profile()
    res.send(200).json(profile)
  } catch (error) {
    responsePrismaError(res, error)
  }
}

const getProfileByRg = async (req, res) => {
  const { profileRg } = req.params
  try {
    const profile = await prisma.user({ rg: profileRg }).profile()
    res.send(200).json(profile)
  } catch (error) {
    responsePrismaError(res, error)
  }
}

const getProfileByCpf = async (req, res) => {
  const { profileCpf } = req.params
  try {
    const profile = await prisma.user({ cpf: profileCpf }).profile()
    res.send(200).json(profile)
  } catch (error) {
    responsePrismaError(res, error)
  }
}

const createProfile = async (req, res) => {
  const { userId, name, lastName, cpf, rg, birthDate, nickName } = req.body
  try {
    const profile = await prisma.createProfile({
      name,
      lastName,
      cpf,
      rg,
      birthDate,
      nickName,
      owner: {
        connect: {
          id: userId,
        },
      },
    })
    res.json(profile)
  } catch (error) {
    responsePrismaError(res, error)
  }
}

module.exports = {
  createProfile,
  getProfileByUserId,
  getProfileByCpf,
  getProfileByRg
}
