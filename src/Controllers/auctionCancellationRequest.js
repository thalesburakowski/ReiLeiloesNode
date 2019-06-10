const { prisma } = require('../../generated/prisma-client')
const { responsePrismaError } = require('./utils')

const getAuctionAnnulmentRequests = async (req, res) => {
	try {
		const query = `
		query {
			auctionCancellationRequests(where:{active: true}) {
				reasonRequest,
				id
				auction {
					id
					title,
					actualPrice,
					owner {
						id
						name
					},
					winner {
						id
						name
					}
				},
			}
		}
		`
		const auctions = await prisma.$graphql(query)
		res.send(auctions)
	} catch (error) {
		responsePrismaError(res, error)
	}
}

const getAuctionSendingRequests = async (req, res) => {
	try {
		const query = `
		query {
			auctionCancellationRequests(where:{active: true}){
				id
				auction{
						 id
						 title
						owner{
							name
						}
						winner{
							name
						}
						actualPrice
					}
				status
			}
		}
		`
		const auctions = await prisma.$graphql(query)
		res.send(auctions)
	} catch (error) {
		responsePrismaError(res, error)
	}
}

const makeAnnulmentRequest = async (req, res) => {
	const { auctionId, reason } = req.body
	try {
		const auction = await prisma.updateAuction({
			where: { id: auctionId },
			data: { status: 'annuledRequest' },
		})

		const auctionCancellationRequest = await prisma.createAuctionCancellationRequest(
			{
				active: true,
				reasonRequest: reason,
				auction: { connect: { id: auctionId } },
			}
		)
		res.send(auctionCancellationRequest)
	} catch (error) {
		responsePrismaError(res, error)
	}
}

const approveAuctionAnnulment = async (req, res) => {
	const { reasonResponse, status, auctionId, auctionCancellationId } = req.body
	try {
		const auctionCancellationRequest = await prisma.updateAuctionCancellationRequest(
			{
				data: { reasonResponse, status, active: false },
				where: { id: auctionCancellationId },
			}
		)

		console.log(auctionCancellationRequest)

		const auction = await prisma.updateAuction({
			data: { status: status ? 'annuled' : 'annulmentRejected' },
			where: { id: auctionId },
		})

		const walletSeller = await prisma
			.auction({ id: auctionId })
			.owner()
			.wallet()

		const walletWinner = await prisma
			.auction({ id: auctionId })
			.winner()
			.wallet()

		const walletWinnerAtualized = await prisma.updateWallet({
			where: { id: walletWinner.id },
			data: {
				pendingCredits: walletWinner.pendingCredits + auction.actualPrice,
			},
		})

		const walletSellerAtualized = await prisma.updateWallet({
			where: { id: walletSeller.id },
			data: { credits: walletSeller.credits - auction.actualPrice },
		})

		res.send(auctionCancellationRequest)
	} catch (error) {
		responsePrismaError(res, error)
	}
}

const makeCancelRequest = async (req, res) => {
	const { auctionId } = req.body

	try {
		const auction = await prisma.auction({ id: auctionId })

		const winnerWallet = await prisma
			.auction({ id: auctionId })
			.winner()
			.wallet()

		const sellerWallet = await prisma
			.auction({ id: auctionId })
			.owner()
			.wallet()

		const winnerPenalty = await prisma.updateWallet({
			data: { credits: winnerWallet.credits - auction.actualPrice * 0.2 },
			where: { id: winnerWallet.id },
		})

		const sellerBonus = await prisma.updateWallet({
			data: { credits: sellerWallet.credits + auction.actualPrice * 1.15 },
			where: { id: sellerWallet.id },
		})

		const auctionUpdated = await prisma.updateAuction({
			data: { status: 'canceled' },
			where: { id: auctionId },
		})

		res.send(auctionUpdated)
	} catch (error) {
		responsePrismaError(res, error)
	}
}

const sendingProductAnnulled = async (req, res) => {
	const { auctionId } = req.body
	try {
		const auction = await prisma.updateAuction({
			data: { status: 'annuledSending' },
			where: { id: auctionId },
		})
		console.log(auction)
		res.send(auction)
	} catch (error) {
		responsePrismaError(res, error)
	}
}

const acceptAuctionAnnuled = async (req, res) => {
	const { auctionId, auctionAnnulmentRequestId } = req.body
	try {
		const auctionAnnulmentRequest = await prisma.updateAuctionCancellationRequest(
			{ where: { id: auctionAnnulmentRequestId }, data: { active: false } }
		)

		const auction = await prisma.updateAuction({
			data: { status: 'annuledAccept' },
			where: { id: auctionId },
		})

		res.send(auction)
	} catch (error) {
		responsePrismaError(res, error)
	}
}

module.exports = {
	getAuctionAnnulmentRequests,
	getAuctionSendingRequests,
	makeAnnulmentRequest,
	sendingProductAnnulled,
	acceptAuctionAnnuled,
	approveAuctionAnnulment,
	makeCancelRequest,
}
