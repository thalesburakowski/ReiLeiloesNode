// generic prisma response error
const responsePrismaError = async (res, error) => {
  // res.status(500).send(error.result.errors[0].message)
  res.status(500).send({message: 'ocorreu um erro'})
}
module.exports = {
  responsePrismaError,
}
