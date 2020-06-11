const log = require('./log')

module.exports = function (err) {
  log('ERROR (oh noes!): ' + err)
}
