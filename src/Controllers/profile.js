const { prisma } = require('../../generated/prisma-client')
const { responsePrismaError } = require('./utils')

const getProfileByUserId = async (req, res) => {
  const { profileId } = req.params
  try {
    const profile = await prisma.user({ id: profileId }).profile()
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
    res.status(200).json(profile)
  } catch (error) {
    responsePrismaError(res, error)
  }
}

module.exports = {
  createProfile,
  getProfileByUserId,
}
