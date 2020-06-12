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
        const arr = []
        replies.forEach(function (r) {
          try {
            arr.unshift(JSON.parse(r))
          } catch (e) {}
        })
        res.set('Content-Type', 'application/json')
        res.send(JSON.stringify(arr, undefined, 2))
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
      res.status(err ? 500 : 200).end()
    })
  }
}