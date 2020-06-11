const util = require('util')

module.exports = function log(/* format, values... */) {
  const args = Array.prototype.slice.call(arguments)
  const timestamp = new Date().toISOString()
  args[0] = util.format('[%s] %s', timestamp, args[0])
  process.stderr.write(util.format.apply(null, args) + '\n')
}