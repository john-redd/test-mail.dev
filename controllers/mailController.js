const db = require('../utils/db')
const withEmailHost = require('../utils/withEmailHost')

module.exports = {
  getMailByUser: (req, res) => {
    if (!db) {
      return res.status(500).end()
    }

    let { user } = req.params

    user = withEmailHost(user)

    db.lrange(user, -10, -1, function (err, replies) {
      if (err) {
        console.log(new Date().toISOString() + ': ERROR', err)
        res.status(500).end()
      } else {
        const parsedEmails = replies
          .map((r) => {
            return JSON.parse(r)
          })
          .sort((a, b) => new Date(b.headers.date) - new Date(a.headers.date))
        res.set('Content-Type', 'application/json')
        res.status(200).send(parsedEmails)
      }
    })
  },
  deleteMailByUser: (req, res) => {
    if (!db) {
      return res.status(500).end()
    }

    let { user } = req.params

    user = withEmailHost(user)

    db.del(user, function (err) {
      if (err) {
        return res.sendStatus(500)
      }
      res.sendStatus(200)
    })
  }
}
