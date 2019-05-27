const analyzeControllers = require('../Controllers/analyze')

module.exports = app => {
  app.route('/analise/leilao-total').get(analyzeControllers.auctionsTotal)
}