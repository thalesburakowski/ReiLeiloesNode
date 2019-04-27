const { prisma } = require('../../generated/prisma-client')
const { responsePrismaError } = require('./utils')

const getAuction = async (req, res) => {
	const { auctionId } = req.params
	try {
		const auction = await prisma.auction({ id: auctionId })
		console.log(auction)
		res.send(auction)
	} catch (error) {
		responsePrismaError(res, error)
	}
}

const createAuction = async (req, res) => {
	const {
		profileId,
		title,
		categories,
		description,
		initialPrice,
		closePrice,
		initialDate,
		closeDate,
	} = req.body

	let { height, width, depth } = req.body
	height = parseFloat(height)
	width = parseFloat(width)
	depth = parseFloat(depth)

	console.log(req.body)

	try {
		if (
			!title ||
			!categories.length ||
			!description ||
			!height ||
			!width ||
			!depth ||
			!initialPrice ||
			!closePrice ||
			!initialDate ||
			!closeDate
		) {
			return res.send({
				success: false,
				message: 'Os campos obrigatórios devem ser preenchidos',
			})
		}
		console.log('teste 0123')

		const auction = await prisma.createAuction({
			title,
			description,
			height,
			width,
			depth,
			initialPrice,
			closePrice,
			initialDate,
			closeDate,
			status: 'created',
			categories: {
				connect: categories.map(category => {
					return { id: category }
				}),
			},
			owner: {
				connect: { id: profileId },
			},
		})
		console.log(auction)
		return res.send(auction)
	} catch (error) {
		console.log(error)
		responsePrismaError(res, error)
	}
}

const approveAuction = async (req, res) => {
	const { auctionId } = req.body
	try {
		const auction = await prisma.updateAuction({
			data: { status: 'approved' },
			where: { id: auctionId },
		})
		console.log(auction)
		return res.send(auction)
	} catch (error) {
		responsePrismaError(res, error)
	}
}

const bidAuction = async (req, res) => {
	const { value, profileId, auctionId } = req.body
	if (!value) {
		return res.send({
			success: false,
			message: 'O valor deve ser preenchido',
		})
	}

	const actualValue = await prisma.bids({ last: 1 })

	if (value > actualValue.value) {
		const bid = await prisma.createBid({
			value,
			auction: { connect: { id: auctionId } },
			owner: { connect: { id: profileId } },
		})
		console.log(bid)
		return res.send(bid)
	} else {
		return res.send({
			success: false,
			message: 'O valor deve ser preenchido',
		})
	}
}

const getApprovedAcutions = async (req, res) => {
	try {
		const auctions = await prisma.auctions({ where: { status: 'approved' } })
		res.send(auctions)
	} catch (error) {

	}
}

module.exports = {
	getAuction,
	getApprovedAcutions,
	createAuction,
	approveAuction,
	bidAuction,
}
