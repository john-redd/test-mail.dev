const config = require('../utils/config')

module.exports = function(req, res, next){
  if (config.enableSTS) {
    const stsHeaderName = 'strict-transport-security'
    const stsHeaderValue = 'max-age=' + config.stsMaxAge
    res.setHeader(stsHeaderName, stsHeaderValue)
  }
  next()
}