const { prisma } = require('../../generated/prisma-client')
const { responsePrismaError } = require('./utils')

const getProfileByUserId = async (req, res) => {
  const { id } = req.params
  try {
    const profile = await prisma.user({ id }).profile()
    res.json(profile)
  } catch (error) {
    responsePrismaError(res, error)
  }
}

const getProfileByRg = async (req, res) => {
  console.log(req.params)
  const { rg } = req.params
  try {
    const profiles = await prisma.profiles({ where: { rg } })
    if (profiles[0]) res.json(profiles[0])
    res.send(200)
  } catch (error) {
    console.log(error)
    responsePrismaError(res, error)
  }
}

const getProfileByCpf = async (req, res) => {
  const { cpf } = req.params
  try {
    const profiles = await prisma.profiles({ where: { cpf } })
    if (profiles[0]) res.json(profiles[0])
    res.send(200)
  } catch (error) {
    console.log(error)
    responsePrismaError(res, error)
  }
}

const getProfileByNick = async (req, res) => {
  const { nick: nickName } = req.params
  try {
    const profiles = await prisma.profiles({ where: { nickName } })
    if (profiles[0]) res.json(profiles[0])
    res.send(200)
  } catch (error) {
    console.log(error)
    responsePrismaError(res, error)
  }
}

const createProfile = async (req, res) => {
  const {
    UserId: userId,
    Name: name,
    LastName: lastName,
    Cpf: cpf,
    Rg: rg,
    BirthDate: birthDate,
    NickName: nickName,
  } = req.body
  console.log(req.body)

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
    await prisma.createWallet({
      credits: 0,
      pendingCredits: 0,
      owner: { connect: {id: profile.id} },
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
  getProfileByRg,
  getProfileByNick,
}
