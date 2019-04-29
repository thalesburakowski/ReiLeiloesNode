const { prisma } = require('../../generated/prisma-client')
const { responsePrismaError } = require('./utils')

const getAuctionCancellationRequests = async (req, res) => {
	try {
		const query = `
		query {
			auctionCancellationRequests(where:{status: "cancelation-request"}) {
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
	} catch (error) {}
}

const makeCancelationRequest = async (req, res) => {
	const { profileId, auctionId, reason } = req.body
	try {
		const auction = await prisma.updateAuction({
			where: { id: auctionId },
			data: { status: 'cancelation-request' },
		})

		const AuctionCancellationRequest = await prisma.createAuctionCancellationRequest(
			{
				status: true,
				reasonRequest: reason,
				auction: { connect: { id: profileId } },
			}
		)
		res.send(AuctionCancellationRequest)
	} catch (error) {
		responsePrismaError(res, error)
	}
}

const approveAuction = async (req, res) => {}

module.exports = {
	getAuctionCancellationRequests,
	makeCancelationRequest,
	approveAuction,
}
