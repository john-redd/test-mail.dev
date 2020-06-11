const config = require('./config')

module.exports = function(email){
  if (email.indexOf('@') === -1) {
    email = email + '@' + config.email.host
  }
  return email
}