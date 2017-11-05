const express = require('express')
const bodyParser = require('body-parser')
const { Pool } = require('pg')
const format = require('pg-format')
const _ = require('underscore')

const client = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
})

client.connect()

var app = express()

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json({limit: '50mb'}));

// respond with "hello world" when a GET request is made to the homepage
app.use(express.static('public'))

app.post('/strokes', function (req, res) {
  if (req.body.length > 0 && req.body[0].user) console.log (`Recieved ${req.body.length} strokes from ${req.body[0].user}`);
  let insertValues = Array.from(new Set(req.body.map(r => {
    try {
      if (r.time=='1509859517766') console.log(r)
        return [r.user, Number(r.time), Number(r.keyCode), Number(r.modifiers), r.direction]
    } catch(e) {

    }
  }).filter((i) => i).map(r => r.join(',')))).map(.split(','))

  // insertValues = insertValues.filter(i => insertValues.findIndex(x => x.every((e, index) => e != i[index])) < 0)
  const insertText = format('INSERT INTO strokes ( user_id, key_time, key_code, modifiers, direction) VALUES %L', insertValues)
  client.query(insertText, (err, result) => {
    if (err) {
      console.log(err.stack)
      console.log(err)
      console.log(result)
      res.status(500).send(err.stack)
    } else {
      res.send('success')
    }
  })
})

app.listen(app.get('port'), function () {
  console.log('Log app listening on port ' + app.get('port'))
})