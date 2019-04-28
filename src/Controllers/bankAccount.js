const { prisma } = require('../../generated/prisma-client')
const { responsePrismaError } = require('./utils')

const getBankAccount = async (req, res) => {
	const { profileId } = req.params
	try {
		const bankAccount = await prisma
			.profile({ id: profileId })
			.bankAccount({ where: { active: true } })
		res.json(bankAccount)
	} catch (error) {
		responsePrismaError(res, error)
	}
}

const createBankAccount = async (req, res) => {
	const {
		profileId,
		bank,
		accountNumber,
		agencyNumber,
		ownerName,
		ownerCpf,
		name,
	} = req.body
	try {
		const bankAccount = await prisma.createBankAccount({
			owner: {
				connect: {
					id: profileId,
				},
			},
			bank,
			accountNumber,
			agencyNumber,
			ownerName,
			ownerCpf,
			name,
		})
		res.json(bankAccount)
	} catch (error) {
		responsePrismaError(res, error)
	}
}

const deleteBankAccount = async (req, res) => {
	const { id } = req.params
	console.log(id)
	try {
		await prisma.updateBankAccount({
			where: { id },
			data: { active: false },
		})
		res.sendStatus(200)
	} catch (error) {
		console.log(error)

		responsePrismaError(res, error)
	}
}

const updateName = async (req, res) => {
	const { id, name } = req.body
	try {
		const bankAccount = await prisma.updateBankAccount({
			where: { id },
			data: { name },
		})
		res.json(bankAccount)
	} catch (error) {
		responsePrismaError(res, error)
	}
}

module.exports = {
	getBankAccount,
	createBankAccount,
	deleteBankAccount,
	updateName,
}
