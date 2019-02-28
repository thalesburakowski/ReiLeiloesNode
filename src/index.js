const express = require('express')
const bodyParser = require('body-parser')
const { prisma } = require('../generated/prisma-client')

const PORT = 3000

const app = express()

app.use(bodyParser.json())

app.get('/', async (req, res) => {
    const user = prisma.createUser({ email: 'thalesburakowski@gmail.com' })
    console.log({ ...user })
})

app.listen(PORT, () => console.log(`Server running at port ${PORT}`))
