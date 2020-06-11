module.exports = {
  email: {
    host: 'test-mail.dev'
  },

  enableSts: false,
  stsMaxAge: '120',
  env: 'DEV',
  mailExpiry: 60 * 60 * 24,
  maxRcptTo: 5,
  rcptToDomainWhitelist: ['localhost', 'test-mail.dev']
}
