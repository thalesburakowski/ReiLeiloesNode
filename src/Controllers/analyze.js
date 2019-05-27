const { prisma } = require('../../generated/prisma-client')
const { responsePrismaPrismaError } = require('./utils')
const groupBy = require('group-by')

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
			title: 'Quantidade de leilões no ultimo mês',
			labels,
			datasets: [{ data, label: 'Leilões' }],
		}

		return res.send(response)
	} catch (error) {
		console.log(error)
	}
}

/*
O resultado deve mostrar a quantidade de 
leilões criado daquela categoria naquele dia
*/
const auctionsPerCategories = async (req, res) => {
	try {
		const today = new Date()
		// const actualMonth = new Date().toISOString().split('T')[0]
		let actualMonth = new Date()
		actualMonth.setDate(today.getDate() + 1)
		actualMonth = actualMonth.toISOString().split('T')[0]
		const lastMonth = new Date(today.setMonth(today.getMonth() - 1))
			.toISOString()
			.split('T')[0]
		const query = `
    query {
      auctions(where:{
        AND: {
          createdAt_gte: "${lastMonth}"
          createdAt_lte: "${actualMonth}"
        }
      }){
        categories {
          name
        }
        createdAt
      }
    }`
		const responsePrisma = await prisma.$graphql(query)
		// console.log(responsePrisma.auctions)
		const categories = [
			...new Set(responsePrisma.auctions.map(res => res.categories[0].name)),
		]
		const auctions = responsePrisma.auctions.map(res => {
			return { date: res.createdAt.split('T')[0], categories: res.categories }
		})

		const auctionsDays = responsePrisma.auctions.map(
			res => res.createdAt.split('T')[0]
		)

		const dates = getDates(lastMonth, actualMonth)
		const labels = dates.map(date => date.split('-')[2])
		const categoryObj = {}

		categories.map(category => {
			categoryObj[category] = [...dates]
		})

		const dataObj = {}

		categories.forEach(category => {
			dataObj[category] = {}
			for (let i = 0; i < dates.length; i++) {
				dataObj[category][dates[i]] = 0
			}
		})

		for (let i = 0; i < auctions.length; i++) {
			auctions[i].categories.forEach(category => {
				dataObj[category.name][auctions[i].date] =
					dataObj[category.name][auctions[i].date] + 1
			})
		}
		const response = {
			type: 'line',
			title: 'Quantidade de leilões por categoria',
			labels,
			datasets: [],
		}
		categories.forEach(category => {
			response.datasets = [
				...response.datasets,
				{ label: category, data: [...Object.values(dataObj[category])] },
			]
		})

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
	auctionsPerCategories,
}
