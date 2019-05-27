const analyzeControllers = require('../Controllers/analyze')

module.exports = app => {
  app.route('/analise/leilao-total').get(analyzeControllers.auctionsTotal)
  app.route('/analise/leilao-por-categoria').get(analyzeControllers.auctionsPerCategories)
}