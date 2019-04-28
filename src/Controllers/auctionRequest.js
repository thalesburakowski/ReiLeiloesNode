const { prisma } = require('../../generated/prisma-client')
const { responsePrismaError } = require('./utils')
const schedule = require('node-schedule')

const getAuctions = async (req, res) => {
	try {
		const auctions = await prisma.auctions({ where: { status: 'created' } })
		console.log(auctions)

		// const auctionsPromised = auctions.map(auction => {
		// 	console.log('a')
		// 	return async () => {
		// 		console.log('auction')
		// 		return prisma.auction({ id: auction.id })
		// 	}
		// })
		// console.log(auctionsPromised)

		// let result
		// Promise.all(auctionsPromised).then(res => {
		// 	console.log('entrou aqui')
		// 	console.log(res)
		// })

		// auctions = await auctions.forEach(async auction => {
		// 	return await prisma.auction({ id: auction.id }).owner()
		// })

		console.log(auctions)
		res.send(auctions)
	} catch (error) {
		responsePrismaError(res, error)
	}
}

const approveAuction = async (req, res) => {
	const { approved, reason, auctionId } = req.body
	try {
		const auction = await prisma.updateAuction({
			where: { id: auctionId },
			data: { status: approved ? 'approved' : 'disapproved' },
		})

		if(auction.status == 'approved'){
			const initialActiveDate = new Date(auction.initialDate)
			const jobActivate = schedule.scheduleJob(initialActiveDate, async () => {
				await prisma.updateAuction({
					where: { id: auction.id },
					data: { status: 'active' },
				})
			})
		}

		const obj = {
			approved,
			auction: { connect: { id: auctionId } },
		}

		!approved ? (obj.reason = reason) : ''

		const auctionRequest = await prisma.createAuctionRequest(obj)
		console.log(auctionRequest)
		res.send(auctionRequest)
	} catch (error) {
		responsePrismaError(res, error)
	}
}

module.exports = {
	getAuctions,
	approveAuction,
}
