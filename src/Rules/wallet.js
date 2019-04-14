const { prisma } = require('../../generated/prisma-client')
// const { responsePrismaError } = require('../Controllers/utils')

module.exports = {
    newCardDeposit: async ({
        profileId,
        value,
        newCreditCard,
        number,
        expireDate,
        securityCode,
        name,
    }) => {
        if (value < 15) {
            console.log('value < 15')
            return {
                success: false,
                message: 'O valor tem que ser maior ou igual a 15',
            }
        }
        if (newCreditCard) {
            if (!name || !number || !expireDate || !securityCode) {
                return {
                    success: false,
                    message: 'Os campos obrigatórios devem ser preenchidos',
                }
            }

            if (
                number[0] != '2' &&
                number[0] != '3' &&
                number[0] != '4' &&
                number[0] != '5' &&
                number[0] != '6'
            ) {
                return {
                    success: false,
                    message: 'Nós não aceitamos essa bandeira',
                }
            }

            let creditCardExists = await prisma
                .profile({ id: profileId })
                .creditCard({ where: { name } })

            console.log(creditCardExists)
            if (creditCardExists.length) {
                return {
                    success: false,
                    message: 'O nome deve ser unico!',
                }
            }

            creditCardExists = await prisma
                .profile({ id: profileId })
                .creditCard({
                    where: { number },
                })

            if (creditCardExists.length) {
                return {
                    ssuccess: false,
                    message: 'Este número de cartão ja foi cadastrado',
                }
            }

            if (new Date(expireDate) < new Date()) {
                return {
                    success: false,
                    message: 'A data precisa ser superior a data atual',
                }
            }
        }
    },

    deposit: async ({ profileId, value, number, name }) => {
        if (!number) {
            return {
                success: false,
                message: 'Nenhum cartão foi selecionado',
            }
        }

        let creditCardExists = await prisma
            .profile({ id: profileId })
            .creditCard({
                where: { name },
            })

        if (!creditCardExists.length) {
            return {
                ssuccess: false,
                message: 'Não existe esse cartão de crédito',
            }
        }

        if (new Date(creditCardExists[0].expireDate) < new Date()) {
            return {
                success: false,
                message: 'Esse cartão está com a data expirada',
            }
        }
        if (value > 3000) {
            return {
                success: false,
                message:
                    'Você não possui esse valor na sua conta bancária, tente um valor menor!',
            }
        }
    },

    newBankAccountWithdraw: async ({
        profileId,
        owner,
        ownerCpf,
        name,
        accountNumber,
        agencyNumber,
        bank,
    }) => {
        if (
            !owner ||
            !name ||
            !accountNumber ||
            !agencyNumber ||
            !bank ||
            !ownerCpf
        ) {
            return {
                success: false,
                message: 'Os campos devem ser preenchidos!',
            }
        }
        const bankAccountExists = await prisma
            .profile({ id: profileId })
            .bankAccount({ where: { active: true } })

        if (bankAccountExists.length) {
            return {
                success: false,
                message: 'Já existe uma conta bancária nesse perfil',
            }
        }
    },

    withdraw: async ({ profileId, value }) => {
        const bankAccountExists = await prisma
            .profile({ id: profileId })
            .bankAccount({ where: { active: true } })

        if (!bankAccountExists.length) {
            return {
                success: false,
                message: 'Não existe uma conta bancária com esse nome',
            }
        }

        const wallet = await prisma.profile({ id: profileId }).wallet()
        if (wallet.credits < value) {
            return {
                success: false,
                message: 'Você não tem esse valor na sua conta',
            }
        }
    },
}
