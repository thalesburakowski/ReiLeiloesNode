const { prisma } = require('../../generated/prisma-client')
const { responsePrismaPrismaError } = require('./utils')

const auctionsTotal = async (req, res) => {
	try {
		const today = new Date()
		const actualMonth = new Date().toISOString().split('T')[0]
		const lastMonth = new Date(today.setMonth(today.getMonth() - 1))
			.toISOString()
			.split('T')[0]
		console.log(actualMonth)
		console.log(lastMonth)
		const query = `
    query {
      auctions(where:{
        AND: {
          createdAt_gte: "${lastMonth}"
          createdAt_lte: "${actualMonth}"
        }
      }){
        createdAt
      }
    }`
		const responsePrisma = await prisma.$graphql(query)
		const auctionsDays = responsePrisma.auctions.map(
			res => res.createdAt.split('T')[0]
		)
		const dates = getDates(lastMonth, actualMonth)
		const labels = dates.map(date => date.split('-')[2])
		let dataObj = {}
		dates.map(label => (dataObj[label] = 0))
		for (let index = 0; index < auctionsDays.length; index++) {
			dataObj[auctionsDays[index]] = dataObj[auctionsDays[index]] + 1
		}

		const data = Object.values(dataObj)

		const response = {
			type: 'line',
			title: 'Quantidade de leilões',
			labels,
			datasets: [{ data, label: 'Leilões' }],
		}

		return res.send(response)
	} catch (error) {
		console.log(error)
	}
}

const getDates = function(startDate, endDate) {
	startDate = new Date(startDate)
	endDate = new Date(endDate)
	var dates = [],
		currentDate = startDate,
		addDays = function(days) {
			var date = new Date(this.valueOf())
			date.setDate(date.getDate() + days)
			return date
		}
	while (currentDate <= endDate) {
		dates.push(currentDate)
		currentDate = addDays.call(currentDate, 1)
	}
	return dates.map(date => date.toISOString().split('T')[0])
}

module.exports = {
	auctionsTotal,
}
