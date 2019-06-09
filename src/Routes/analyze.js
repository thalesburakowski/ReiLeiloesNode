const analyzeControllers = require('../Controllers/analyze')

module.exports = app => {
  app.route('/analise/leilao-total').post(analyzeControllers.auctionsTotal)
  app.route('/analise/leilao-por-categoria').post(analyzeControllers.auctionsPerCategories)
}