const { prisma } = require('../../generated/prisma-client')
const { responsePrismaError } = require('./utils')

const rules = require('../Rules/wallet')

const getWalletByProfileId = async (req, res) => {
    const { profileId } = req.params
    try {
        const wallet = await prisma.profile({ id: profileId }).wallet()
        res.send({ success: true, ...wallet })
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
        if (newCreditCard) {
            const rulesApplied = await rules.newCardDeposit(req.body)
            if (rulesApplied) {
                return res.send(rulesApplied)
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

        const rulesApplied = await rules.deposit(req.body)
        if (rulesApplied) {
            return res.send(rulesApplied)
        }

        const wallet = await prisma.profile({ id: profileId }).wallet()

        const walletUpdated = await prisma.updateWallet({
            where: { id: wallet.id },
            data: { credits: wallet.credits + parseInt(value) },
        })

        res.send({ success: true, ...walletUpdated })
        return
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
        ownerCpf,
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
            const rulesApplied = await rules.newBankAccountWithdraw(req.body)
            console.log(rulesApplied)
            if (rulesApplied) {
                return res.send(rulesApplied)
            }
            const bankAccount = await prisma.createBankAccount({
                accountNumber,
                agencyNumber,
                ownerCpf,
                bank,
                name,
                ownerName: owner,
                owner: { connect: { id: profileId } },
            })
            console.log(bankAccount)
        } // fechou parte da nova conta bancária

        const rulesApplied = await rules.withdraw(req.body)
        if (rulesApplied) {
            return res.send(rulesApplied)
        }
        const wallet = await prisma.profile({ id: profileId }).wallet()
        console.log(wallet)
        const walletUpdated = await prisma.updateWallet({
            where: { id: wallet.id },
            data: { credits: wallet.credits - parseInt(value) },
        })

        res.send({ success: true, ...walletUpdated })
        return
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
