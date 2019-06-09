const { prisma } = require('../../generated/prisma-client')
const { responsePrismaPrismaError } = require('./utils')

const months = {
	'01': 'jan',
	'02': 'fev',
	'03': 'mar',
	'04': 'abr',
	'05': 'mai',
	'06': 'jun',
	'07': 'jul',
	'08': 'ago',
	'09': 'set',
	'10': 'out',
	'11': 'nov',
	'12': 'dez',
}

const auctionsTotal = async (req, res) => {
	let { initialDate, finalDate } = req.body
	initialDate = new Date(initialDate).toISOString().split('T')[0]
	finalDate = new Date(finalDate).toISOString().split('T')[0]
	const query = `
    query {
      auctions(where: {
        AND: {
          createdAt_gte: "${initialDate}"
          createdAt_lte: "${finalDate}"
        }
      }){
        createdAt
      }
		}`

	const queryResponse = await prisma.$graphql(query)
	const auctions = queryResponse.auctions
	res.send(generateGraphic(initialDate, finalDate, auctions))
}

const auctionsPerCategories = async (req, res) => {
	let { initialDate, finalDate } = req.body
	initialDate = new Date(initialDate).toISOString().split('T')[0]
	finalDate = new Date(finalDate).toISOString().split('T')[0]
	const query = `
    query {
      auctions(where:{
        AND: {
          createdAt_gte: "${initialDate}"
          createdAt_lte: "${finalDate}"
        }
      }){
        categories {
          name
        }
        createdAt
      }
		}`
	try {
		const queryResponse = await prisma.$graphql(query)
		const auctions = queryResponse.auctions
		res.send(generateGraphicByCategories(initialDate, finalDate, auctions))
	} catch (error) {
		console.log(error)
	}
}

module.exports = {
	auctionsTotal,
	auctionsPerCategories,
}

const generateGraphic = (initialDate, finalDate, auctions) => {
	const datesInterval = getDates(initialDate, finalDate)
	const auctionsByPeriod = countAuctionsByPeriod(auctions, datesInterval)
	const labels = getLabel(datesInterval)
	const data = Object.values(auctionsByPeriod)
	return {
		type: 'line',
		title: 'Quantidade de leilões no ultimo mês',
		labels,
		datasets: [{ data, label: 'Leilões' }],
	}
}

const generateGraphicByCategories = (initialDate, finalDate, auctions) => {
	const datesInterval = getDates(initialDate, finalDate)
	const categories = getCategories(auctions)
	const keys = generateKeys(datesInterval)
	const categoriesCounted = prepareCountCategory(categories, keys);
	countCategories(auctions, categoriesCounted);
	const datasets = generateDatasets(categoriesCounted)
	const labels = getLabel(datesInterval)

	return {
		type: 'line',
		title: 'Quantidade de leilões por categoria',
		labels,
		datasets,
	}
}

function countCategories(auctions, categoriesCounted) {
	auctions.forEach(auction => {
		auction.categories.forEach(category => {
			const date = auction.createdAt.split('T')[0];
			categoriesCounted[category.name][date]++;
		});
	});
}

function prepareCountCategory(categories, keys) {
	const categoriesCounted = {};
	categories.forEach(category => {
		categoriesCounted[category] = Object.assign({}, keys);
	});
	return categoriesCounted;
}

function generateDatasets(categoriesCounted) {
	return Object.entries(categoriesCounted).map(([key, value]) => {
		return {
			label: key,
			data: Object.values(value),
		};
	});
}

function getCategories(auctions) {
	const categories = new Set()
	auctions.forEach(auction => {
		auction.categories.forEach(category => categories.add(category.name))
	})
	return Array.from(categories)
}

function getLabel(datesInterval) {
	return datesInterval.map(date => {
		const [_, month, day] = date.split('-')
		return `${months[month]} ${day}`
	})
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

const generateKeys = datesInterval => {
	const obj = {}
	datesInterval.forEach(date => (obj[date] = 0))
	return obj
}

const countAuctionsByPeriod = (auctions, datesInterval) => {
	const countAuctionsByPeriod = generateKeys(datesInterval)
	auctions.forEach(auction => {
		const createdAt = auction.createdAt.split('T')[0]
		countAuctionsByPeriod[createdAt]++
	})

	return countAuctionsByPeriod
}
