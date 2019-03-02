const { prisma } = require('../../generated/prisma-client')
const { responsePrismaError } = require('./utils')

const getAllAddressesByProfileId = async (req, res) => {
  const { profileId } = req.params
  console.log(profileId)
  try {
    const addresses = await prisma
      .profile({ id: profileId })
      .address({ where: { active: true } })

    res.json(addresses)
  } catch (error) {
    responsePrismaError(res, error)
  }
}

const createAddress = async (req, res) => {
  const {
    profileId,
    name,
    state,
    city,
    neighboorhood,
    street,
    number,
    complement,
    zipCode,
  } = req.body
  try {
    const address = await prisma.createAddress({
      name,
      state,
      city,
      neighboorhood,
      street,
      number,
      complement,
      zipCode,
      owner: { connect: { id: profileId } },
    })
    res.json(address)
  } catch (error) {
    responsePrismaError(res, error)
  }
}

const deleteAddress = async (req, res) => {
  const { id } = req.params
  try {
    const address = await prisma.updateAddress({
      where: { id },
      data: { active: false },
    })
    console.log(address)
    res.json(address)
  } catch (error) {
    responsePrismaError(res, error)
  }
}

const updateName = async (req, res) => {
  const { id, name } = req.body
  try {
    const address = await prisma.updateAddress({
      where: { id },
      data: { name: name },
    })
    res.json(address)
  } catch (error) {
    responsePrismaError(res, error)
  }
}

module.exports = {
  getAllAddressesByProfileId,
  createAddress,
  deleteAddress,
  updateName,
}
