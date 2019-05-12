const { prisma } = require('../../generated/prisma-client')
const { responsePrismaError } = require('./utils')

const getAuctionCancellationRequests = async (req, res) => {
	try {
		const query = `
		query {
			auctionCancellationRequests(where:{active: true}) {
				reasonRequest,
				auction {
					title,
					finalPrice,
					owner {
						name
					},
					winner {
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

const makeCancelationRequest = async (req, res) => {
	const { auctionId, reason } = req.body
	try {
		const auction = await prisma.updateAuction({
			where: { id: auctionId },
			data: { status: 'cancelation-request' },
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

const approveAuctionCancellation = async (req, res) => {
	const { reasonResponse, status, auctionCancellationId } = req.body
	try {
		const auctionCancellationRequest = await prisma.updateAuctionCancellationRequest(
			{
				data: { reasonResponse, status, active: false },
				where: { id: auctionCancellationId },
			}
		)
		const auction = await prisma.updateAuction({
			data: { status: 'finalized' },
			where: { id: auction.id },
		})

		const walletSeller = await prisma
			.auction({ id: auction.id })
			.owner()
			.wallet()

		const walletWinner = await prisma
			.auction({ id: auction.id })
			.winner()
			.wallet()

		const walletWinnerAtualized = await prisma.updateWallet({
			where: { id: walletWinner.id },
			data: {
				pendingCredits: walletWinner.pendingCredits + auction.finalPrice,
			},
		})

		const walletSellerAtualized = await prisma.updateWallet({
			where: { id: walletSeller.id },
			data: { credits: walletSeller.credits - auction.finalPrice },
		})

		res.send(AuctionCancellationRequest)
	} catch (error) {
		responsePrismaError(res, error)
	}
}

const makeAnnulmentRequest = async (req, res) => {
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
			data: { credits: winnerWallet.credits - auction.finalPrice * 0.2 },
			where: { id: winnerWallet.id },
		})

		const sellerBonus = await prisma.updateWallet({
			data: { credits: sellerWallet.credits + auction.finalPrice * 1.15 },
			where: { id: sellerWallet.id },
		})

		const auctionUpdated = await prisma.updateAuction({
			data: { status: 'annulment' },
			where: { id: auctionId },
		})

		res.send(auctionUpdated)
	} catch (error) {
		responsePrismaError(res, error)
	}
}

module.exports = {
	getAuctionCancellationRequests,
	makeCancelationRequest,
	approveAuctionCancellation,
	makeAnnulmentRequest,
}
