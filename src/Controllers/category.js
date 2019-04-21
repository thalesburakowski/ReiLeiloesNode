const { prisma } = require('../../generated/prisma-client')
const { responsePrismaError } = require('./utils')

const getCategories = async (req, res) => {
	try {
		const categories = await prisma.categories()
		console.log(categories)
		res.send(categories)
	} catch (error) {
		responsePrismaError(error)
	}
}

module.exports = {
	getCategories,
}
