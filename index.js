const express = require('express')
const bodyParser = require('body-parser')
const { Pool } = require('pg')
const format = require('pg-format')

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
app.use(bodyParser.json());

// respond with "hello world" when a GET request is made to the homepage
app.get('*', function (req, res) {
  res.send('hello world')
})

app.post('/strokes', function (req, res) {
  const insertText = format('INSERT INTO strokes ( user_id, key_time, key_code, modifiers, direction) VALUES %L', req.body.map(r => {
    return [r.user, Number(r.time), Number(r.keyCode), Number(r.modifiers), r.direction]
  }))

  client.query(insertText, (err, result) => {
    if (err) {
      console.log(err.stack)
      res.status(500).send(err.stack)
    } else {
      res.send('success')
    }
  })
})

app.get('/strokes', function (req, res) {
  client.query('SELECT * FROM strokes LIMIT ' + (req.query.limit || 20), (err, result) => {
    if (err) {
      console.log(err.stack)
      res.status(500).send(err.stack)
    } else {
      res.send(result.rows)
    }
  })
})

app.listen(app.get('port'), function () {
  console.log('Log app listening on port ' + app.get('port'))
})