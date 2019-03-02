const { prisma } = require('../../generated/prisma-client')
const { responsePrismaError } = require('./utils')

const getAllCreditCardByProfileId = async (req, res) => {
  const { profileId } = req.params
  try {
    const creditCards = await prisma
      .profile({ id: profileId })
      .creditCard({ where: { active: true } })
    res.json(creditCards)
  } catch (error) {
    responsePrismaError(res, error)
  }
}

const createCreditCard = async (req, res) => {
  const { profileId, number, expireDate, securityCode, name } = req.body
  try {
    const creditCard = await prisma.createCreditCard({
      owner: {
        connect: {
          id: profileId,
        },
      },
      number,
      expireDate,
      securityCode,
      name,
    })
    res.json(creditCard)
  } catch (error) {
    responsePrismaError(res, error)
  }
}

const deleteCreditCard = async (req, res) => {
  const { id } = req.params
  try {
    await prisma.updateCreditCard({
      where: { id },
      data: { active: false },
    })
    res.sendStatus(200)
  } catch (error) {
    responsePrismaError(res, error)
  }
}

const updateName = async (req, res) => {
  const { id, name } = req.body
  console.log(req.body)
  try {
    const creditCard = await prisma.updateCreditCard({
      where: { id },
      data: { name },
    })
    res.json(creditCard)
  } catch (error) {
    responsePrismaError(res, error)
  }
}

module.exports = {
  getAllCreditCardByProfileId,
  createCreditCard,
  deleteCreditCard,
  updateName,
}
