const MailParser = require('mailparser').MailParser
const config = require('../utils/config')
const log = require('../utils/log')
const logError = require('../utils/logError')
const socketInfo = require('../utils/socketInfo')

const db = require('../utils/db')

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

    if (isPermitted){
      cb()
      return
    }
    cb(new Error('Unpermitted Domain'))
  },
  onData: (stream, session, cb) => {
    const { rcptTo: recipients } = session.envelope
    let parser = new MailParser()
    let mailObj = {
      attachments: [],
      body: {}
    }

    parser.on('headers', (headers) => {
      let headerObj = {}
      for (let [k, v] of headers) {
        // We don’t escape the key '__proto__'
        // which can cause problems on older engines
        headerObj[k] = v
      }

      mailObj.headers = headerObj
    })

    parser.on('data', (data) => {
      if (data.type === 'attachment') {
        mailObj.attachments.push(data)
        data.content.on('readable', () => data.content.read())
        data.content.on('end', () => data.release())
      } else {
        mailObj.body = data
      }
    })

    parser.on('end', (data) => {
      console.log(recipients)
      recipients.forEach(({ address }) => {
        console.log(
          JSON.stringify(
            mailObj,
            (k, v) => (k === 'content' || k === 'release' ? undefined : v),
            3
          )
        )

        db.rpush(
          address,
          JSON.stringify(
            mailObj,
            (k, v) => (k === 'content' || k === 'release' ? undefined : v),
            3
          ),
          function (err) {
            if (err) {
              return logError(err)
            }

            if (config.mailExpiry) {
              db.expire(address, config.mailExpiry)
            }

            db.llen(address, function (err, inbox) {
              if (err) {
                return logError(err)
              }

              if (inbox > 10) {
                db.ltrim(address, -10, -1, function (err) {
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
