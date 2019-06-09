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
	} = req.body.auctionData

	let { height, width, depth } = req.body.auctionData
	height = parseFloat(height)
	width = parseFloat(width)
	depth = parseFloat(depth)

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
		return res.send(auction)
	} catch (error) {
		console.log(error)
		responsePrismaError(res, error)
	}
}

const bidAuction = async (req, res) => {
	const { value, profileId, auctionId } = req.body
	try {
		if (!value) {
			return res.send({
				success: false,
				message: 'O valor deve ser preenchido',
			})
		}

		const auctionLastTime = await prisma.auction({ id: auctionId })
		if (auctionLastTime.status != 'active') {
			return res.send({
				success: false,
				message:
					'Essa ação não pode ser realizada enquanto o leilão não estiver ativo!',
			})
		}

		const lastOwner = await prisma
			.bids({
				last: 1,
				where: { auction: { id: auctionId } },
			})
			.owner()

		if (value > auctionLastTime.actualPrice) {
			const bid = await prisma.createBid({
				value,
				auction: { connect: { id: auctionId } },
				owner: { connect: { id: profileId } },
			})

			const auction = await prisma.updateAuction({
				where: { id: auctionId },
				data: { actualPrice: value },
			})
			const walletWinner = await prisma.profile({ id: profileId }).wallet()
			const wallet = await prisma.updateWallet({
				where: { id: walletWinner.id },
				data: { credits: walletWinner.credits - value },
			})

			if (value >= auction.closePrice) {
				// Leilão finalizado
				const auction = await prisma.updateAuction({
					where: { id: auctionId },
					data: { status: 'finalized', winner: { connect: { id: profileId } } },
				})
			} else {
				// descongelar o valor de volta pro ultimo cara que fez o pedido
				const wallet = await prisma
					.profile({ id: lastOwner[0].owner.id })
					.wallet()
				await prisma.updateWallet({
					where: { id: wallet.id },
					data: { credits: wallet.credits + auctionLastTime.actualPrice },
				})
			}

			return res.send(bid)
		} else {
			return res.send({
				success: false,
				message: 'O valor deve ser maior do que o antigo',
			})
		}
	} catch (error) {
		responsePrismaError(res, error)
	}
}

const getHistoricBids = async (req, res) => {
	const { auctionId } = req.params
	try {
		// const historic = await prisma.auction({ id: auctionId }).historic()
		const query = `
		query {
			auction(where:{id: "${auctionId}"}){
				historic {
					value
					owner {
						nickName
						id
					}
				}
			}
		}
		`
		const auctions = await prisma.$graphql(query)
		// historic = auction.historic
		const bids = auctions.auction.historic

		const response = bids.map(bid => {
			return {
				username: bid.owner.nickName,
				usernameId: bid.owner.id,
				price: bid.value,
			}
		})
		// { id: 1, username: '@mariazinha', price: 'R$ 150,00' },
		// const response = historic.map(history => {
		// 	const obj = {
		// 		username:
		// 	}
		// })
		return res.send(response)
	} catch (error) {
		responsePrismaError(res, error)
	}
}

const getApprovedAcutions = async (req, res) => {
	let { title, categories } = req.query
	categories = JSON.parse(categories)

	try {
		const auctions = await prisma.auctions({
			where: {
				AND: [
					{ OR: [{ status: 'approved' }, { status: 'active' }] },
					{
						categories_some: {
							OR: categories.map(category => {
								return {
									id: category,
								}
							}),
						},
					},
					{
						title_contains: title
					}
				],
			},
		})

		return res.send(auctions)
	} catch (error) {
		console.log(error)
	}
}

const addAddressToAuction = async (req, res) => {
	const { auctionId, addressId } = req.body
	try {
		const auction = await prisma.updateAuction({
			where: { id: auctionId },
			data: { address: { connect: { id: addressId } } },
		})
		return res.send(auction)
	} catch (error) {
		responsePrismaError(res, error)
	}
}

const deliveringAuction = async (req, res) => {
	const { auctionId } = req.body
	try {
		const auction = await prisma.updateAuction({
			where: { id: auctionId },
			data: { status: 'delivering' },
		})

		res.send(auction)
	} catch (error) {
		responsePrismaError(res, error)
	}
}

const receivingAuction = async (req, res) => {
	const { auctionId } = req.body
	try {
		const auction = await prisma.updateAuction({
			where: { id: auctionId },
			data: { status: 'received' },
		})

		res.send(auction)
	} catch (error) {
		responsePrismaError(res, error)
	}
}

module.exports = {
	getAuction,
	getApprovedAcutions,
	createAuction,
	bidAuction,
	addAddressToAuction,
	getHistoricBids,
	deliveringAuction,
	receivingAuction,
}
