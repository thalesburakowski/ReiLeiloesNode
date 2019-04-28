const { prisma } = require('../../generated/prisma-client')
const schedule = require('node-schedule')

const scheduleJobsActive = async () => {
	console.log('active')
	try {
		const auctions = await prisma.auctions({ where: { status: 'approved' } })
		auctions.forEach(auction => {
			const date = new Date(auction.initialDate)

			const job = schedule.scheduleJob(date, async () => {
				await prisma.updateAuction({
					where: { id: auction.id },
					data: { status: 'active' },
				})
			})
		})
	} catch (error) {
		console.log(error)
	}
}

const scheduleJobsFinalize = async () => {
	try {
		const auctions = await prisma.auctions({ where: { status: 'active' } })
		auctions.forEach(auction => {
			const date = new Date(auction.closeDate)

			const job = schedule.scheduleJob(date, async () => {
				await prisma.updateAuction({
					where: { id: auction.id },
					data: { status: 'finalized' },
				})
			})


		})
	} catch (error) {
		console.log(error)
	}
}

const executeSchedules = async () => {
	scheduleJobsActive()
	scheduleJobsFinalize()
}

module.exports = {
	executeSchedules,
}
