const { prisma } = require('../../generated/prisma-client')
const { responsePrismaError } = require('./utils')

const getAllAddressesByProfileId = async (req, res) => {
  const { profileId } = req.params
  const { name } = req.query
  const { zipCode } = req.query
  console.log('*********')

  try {
    if (name) {
      const addresses = await prisma
        .profile({ id: profileId })
        .address({ where: { active: true, name } })
      if (addresses[0]) {
        res.json(addresses[0])
      } else {
        res.send(200)
      }
    } else {
      const addresses = await prisma
        .profile({ id: profileId })
        .address({ where: { active: true } })
      console.log(addresses)

      res.json(addresses)
    }
  } catch (error) {
    responsePrismaError(res, error)
  }
}

const createAddress = async (req, res) => {
  const {
    ProfileId: profileId,
    Name: name,
    State: state,
    City: city,
    Neighboorhood: neighboorhood,
    Street: street,
    Complement: complement,
    ZipCode: zipCode,
  } = req.body

  let { Number: number } = req.body
  number = parseInt(number)
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
    console.log(address)
    res.json(address)
  } catch (error) {
    console.log(error)
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
    res.json(address)
  } catch (error) {
    console.log(error);    
    responsePrismaError(res, error)
  }
}

const updateName = async (req, res) => {
  const { Id: id, Name: name } = req.body

  try {
    const address = await prisma.updateAddress({
      where: { id },
      data: { name: name },
    })

    res.json(address)
  } catch (error) {
    console.log(error)
    responsePrismaError(res, error)
  }
}

module.exports = {
  getAllAddressesByProfileId,
  createAddress,
  deleteAddress,
  updateName,
}
