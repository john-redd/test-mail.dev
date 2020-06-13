require('dotenv').config()

const express = require('express')
const app = express()
const { WEB_SERVER_PORT } = process.env
const stsMiddleware = require('./middleware/stsMiddleware')
const mailCtrl = require('./controllers/mailController')

app.use(express.json())
app.use(stsMiddleware)

app.get('/api/mail/:user', mailCtrl.getMailByUser)

app.delete('/api/mail/:user', mailCtrl.deleteMailByUser)

app.listen(WEB_SERVER_PORT, () =>
  console.log(`Web server running on port ${WEB_SERVER_PORT}`)
)
