const util = require('util')

module.exports = function socketInfo(socket) {
  if (!socket) {
    return 'unknown<->unknown'
  }

  const pair = util.format(
    '%s:%s<->%s:%s',
    socket.localAddress,
    socket.localPort,
    socket.remoteAddress,
    socket.remotePort
  )
  return pair
}