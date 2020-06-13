const db = require('./utils/db')

db.lrange('john@test-mail.net', -10, -1, (err, emails) => console.log(emails))