const { prisma } = require('../../generated/prisma-client')
const { responsePrismaError } = require('./utils')

const getWalletByProfileId = async (req, res) => {
  const { profileId } = req.params
  try {
    const wallet = await prisma.profile({ id: profileId }).wallet()
    res.send(wallet)
  } catch (error) {
    console.log(error)
    responsePrismaError(res, error)
  }
}

const deposit = async (req, res) => {
  console.log(req.body)
  const {
    profileId,
    value,
    newCreditCard,
    owner,
    number,
    expireDate,
    securityCode,
    name,
  } = req.body

  try {
    if (value < 15) {
      return res.send({
        success: false,
        message: 'O valor tem que ser maior ou igual a 15',
      })
    }

    if (newCreditCard) {
      if (!name) {
        res.send({ success: false, message: 'O nome deve ser preenchido!' })
      }
      if (!number) {
        return res.send({
          success: false,
          message: 'O número do cartão deve ser preenchido',
        })
      }

      if (!expireDate) {
        res.send({
          success: false,
          message: 'A data de expiração deve ser preenchida',
        })
      }

      if (!securityCode) {
        res.send({
          success: false,
          message: 'O código de segurança deve ser preenchido',
        })
      }

      if (
        number[0] != '2' &&
        number[0] != '3' &&
        number[0] != '4' &&
        number[0] != '5' &&
        number[0] != '6'
      ) {
        res.send({
          success: false,
          message: 'Nós não aceitamos essa bandeira',
        })
      }

      const creditCardExists = await prisma.creditCards({
        where: { name_contains: name },
      })

      if (creditCardExists.length) {
        res.send({
          success: false,
          message: 'O nome deve ser unico!',
        })
      }

      await prisma.createCreditCard({
        name,
        expireDate,
        number,
        securityCode,
        holder: owner,
        owner: { connect: { id: profileId } },
      })
    } // fechou parte de novo cartão

    if (!number) {
      return res.send({
        success: false,
        message: 'Nenhum cartão foi selecionado',
      })
    }

    const creditCardExists = await prisma.creditCards({
      where: { name_contains: name },
    })

    if (!creditCardExists.length) {
      return res.send({
        ssuccess: false,
        message: 'Não existe esse cartão de crédito',
      })
    }
    if (value > 3000) {
      res.send({
        success: false,
        message:
          'Você não possui esse valor na sua conta bancária, tente um valor menor!',
      })
    }

    const wallet = await prisma.profile({ id: profileId }).wallet()
    console.log(wallet)

    const walletUpdated = await prisma.updateWallet({
      where: { id: wallet.id },
      data: { credits: wallet.credits + value },
    })

    res.send(walletUpdated)
  } catch (error) {
    responsePrismaError(res, error)
  }
}

const withdraw = async (req, res) => {
  const {
    profileId,
    value,
    newBankAccount,
    owner,
    name,
    accountNumber,
    agencyNumber,
    bank,
  } = req.body

  try {
    if (value <= 0) {
      return res.send({
        success: false,
        message: 'O valor tem que ser maior do que zero',
      })
    }

    if (newBankAccount) {
      if (!owner || !name || !accountNumber || !agencyNumber || !bank) {
        return res.send({
          success: false,
          message: 'Os campos devem ser preenchidos!',
        })
      }
      const bankAccountExists = await prisma
        .profile({ id: profileId })
        .bankAccount()

      if (bankAccountExists.length) {
        return res.send({
          success: false,
          message: 'Já existe uma conta bancária nesse perfil',
        })
      }
    } // fechou parte da nova conta bancária

    const bankAccountExists = await prisma
      .profile({ id: profileId })
      .bankAccount({ where: { name_contains: name } })

    if (bankAccountExists.length) {
      return res.send({
        success: false,
        message: 'Já existe uma conta bancária com esse nome',
      })
    }

    const wallet = await prisma.profile({ id: profileId }).wallet()
    console.log(wallet)

    const walletUpdated = await prisma.updateWallet({
      where: { id: wallet.id },
      data: { credits: wallet.credits - value },
    })

    res.send(walletUpdated)
  } catch (error) {
    console.log(error)
    responsePrismaError(res, error)
  }
}

module.exports = {
  getWalletByProfileId,
  deposit,
  withdraw,
}
