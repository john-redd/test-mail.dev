const MailParser = require('mailparser').MailParser
const config = require('../utils/config')
const log = require('../utils/log')
const logError = require('../utils/logError')
const socketInfo = require('../utils/socketInfo')

const db = require('../utils/db')

let recipients = []
let rcptTo = 0
let rejected = false

module.exports = {
  onConnect: (session, cb) => {
    log(`${socketInfo(session)}: Handling SMTP Request`)

    cb()
  },
  onMailFrom: (address, session, cb) => {
    cb()
  },
  onRcptTo: (address, session, cb) => {
    const domain = address.address.split('@')

    const isPermitted = config.rcptToDomainWhitelist.includes(domain[1])

    // Do number of recipients check

    if (isPermitted){
      recipients.push(address.address)
      cb()
      return
    }
    cb(new Error('Unpermitted Domain'))
  },
  onData: (stream, session, cb) => {
    let parser = new MailParser()
    let mailobj = {
      attachments: [],
      text: {}
    }

    parser.on('headers', (headers) => {
      let headerObj = {}
      for (let [k, v] of headers) {
        // We don’t escape the key '__proto__'
        // which can cause problems on older engines
        headerObj[k] = v
      }

      mailobj.headers = headerObj
    })

    parser.on('data', (data) => {
      if (data.type === 'attachment') {
        mailobj.attachments.push(data)
        data.content.on('readable', () => data.content.read())
        data.content.on('end', () => data.release())
      } else {
        mailobj.text = data
      }
    })

    parser.on('end', (data) => {
      recipients.forEach((user) => {
        console.log(
          JSON.stringify(
            mailobj,
            (k, v) => (k === 'content' || k === 'release' ? undefined : v),
            3
          )
        )

        db.rpush(
          user,
          JSON.stringify(
            mailobj,
            (k, v) => (k === 'content' || k === 'release' ? undefined : v),
            3
          ),
          function (err) {
            if (err) {
              return logError(err)
            }

            if (config.expireAfter) {
              db.expire(user, config.expireAfter)
            }

            db.llen(user, function (err, replies) {
              if (err) {
                return logError(err)
              }

              if (replies > 10) {
                db.ltrim(user, -10, -1, function (err) {
                  if (err) {
                    return logError(err)
                  }
                })
              }
            })
            cb()
          }
        )
      })
    })
    stream.pipe(parser)
  }
}
