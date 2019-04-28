const { prisma } = require('../../generated/prisma-client')
const { responsePrismaError } = require('./utils')

const getAuctionCancellationRequests = async (req, res) => {
	try {
		const query = `
		query {
			auctionCancellationRequests(where:{status: "finalized"}) {
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

const approveAuction = async (req, res) => {}

module.exports = {
	getAuctionCancellationRequests,
	approveAuction,
}
