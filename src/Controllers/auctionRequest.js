const { prisma } = require('../../generated/prisma-client')
const { responsePrismaError } = require('./utils')

const getAuctions = async (req, res) => {
	try {
		const auctions = await prisma.auctions({ where: { status: 'created' } })
		console.log(auctions)
		res.send(auctions)
	} catch (error) {
		responsePrismaError(error)
	}
}

const approveAuction = async (req, res) => {
	const { approved, auctionId } = req.body
	try {
		const auction = await prisma.updateAuction({
			where: { id: auctionId },
			data: { status: approved ? 'approved' : 'disapproved' },
		})
		console.log(auction)
		res.send(auction)
	} catch (error) {
		responsePrismaError(error)
	}
}

module.exports = {
	getAuctions,
	approveAuction,
}
