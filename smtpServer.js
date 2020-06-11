require('dotenv').config()

const SMTPServer = require('smtp-server').SMTPServer
const { EMAIL_SERVER_PORT } = process.env
const smtpCtrl = require('./controllers/smtpController')

// function mailSummary(mail) {
//   const deliveryTime =
//     new Date(mail.receivedAt).getTime() - new Date(mail.date).getTime()

//   const summary = {
//     date: mail.date,
//     deliveryTime: deliveryTime,
//     from: mail.from,
//     receivedAt: mail.receivedAt,
//     subject: mail.subject,
//     to: mail.to
//   }

//   if (mail.headers) {
//     summary.headers = {
//       cc: mail.headers.cc,
//       date: mail.headers.date,
//       from: mail.headers.from,
//       subject: mail.headers.subject,
//       to: mail.headers.to
//     }
//   }

//   return JSON.stringify(summary)
// }


const server = new SMTPServer({
  authOptional: true,
  onConnect: smtpCtrl.onConnect,
  onMailFrom: smtpCtrl.onMailFrom,
  onRcptTo: smtpCtrl.onRcptTo,
  onData: smtpCtrl.onData
})

server.listen(EMAIL_SERVER_PORT)
