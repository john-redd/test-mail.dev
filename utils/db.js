const redis = require('redis')
const { REDIS_HOST, REDIS_PORT } = process.env

const db = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT
})

db.on('error', (err) => console.log(err))

module.exports = db
