const { prisma } = require('../../generated/prisma-client')
const { responsePrismaError } = require('./utils')
const schedule = require('node-schedule')

const getAuction = async (req, res) => {
	const { auctionId } = req.params
	try {
		const auction = await prisma.auction({ id: auctionId })
		const categories = await prisma.auction({ id: auctionId }).categories()
		res.send({ ...auction, categories })
	} catch (error) {
		responsePrismaError(res, error)
	}
}

const createAuction = async (req, res) => {
	const {
		profileId,
		title,
		images,
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
			!images.length ||
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
		console.log(images)

		const auction = await prisma.createAuction({
			title,
			description,
			height,
			width,
			depth,
			initialPrice,
			images: { set: images },
			actualPrice: initialPrice,
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

		// const initialActiveDate = new Date(initialDate)

		// const jobActivate = schedule.scheduleJob(initialActiveDate, async () => {
		// 	await prisma.updateAuction({
		// 		where: { id: auction.id },
		// 		data: { status: 'active' },
		// 	})
		// })

		const closeFinalizedDate = new Date(closeDate)

		const jobFinalize = schedule.scheduleJob(closeFinalizedDate, async () => {
			await prisma.updateAuction({
				where: { id: auction.id },
				data: { status: 'finalized' },
			})
		})
		console.log(auction)
		return res.send(auction)
	} catch (error) {
		console.log(error)
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

	const auction = await prisma.auction({ id: auctionId })
	if (auction.status != 'active') {
		return res.send({
			success: false,
			message:
				'Essa ação não pode ser realizada enquanto o leilão não estiver ativo!',
		})
	}

	const actualValue = await prisma.bids({
		last: 1,
		where: { auction: { id: auctionId } },
	})

	if (value > actualValue.value) {
		let bid

		if (value >= auction.closePrice) {
			//congelar valor do cara atual

		} else {
			bid = await prisma.createBid({
				value,
				auction: { connect: { id: auctionId } },
				owner: { connect: { id: profileId } },
			})

			actualValue

			// descongelar o valor de volta pro ultimo cara que fez o pedido
			const auction = await prisma.updateAuction({
				where: { id: auctionId },
				data: { actualPrice: value },
			})
		}

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
		console.log(error)
	}
}

const deliveryAuction = async (req, res) => {
	const { auctionId, addressId } = req.body
	try {
		const auction = await prisma.updateAuction({
			where: { id: auctionId },
			data: { address: { connect: { id: addressId } } },
		})
		res.send(auction)
	} catch (error) {
		responsePrismaError(res, error)
	}
}
// delivering

module.exports = {
	getAuction,
	getApprovedAcutions,
	createAuction,
	bidAuction,
	deliveryAuction,
}
