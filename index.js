const express = require('express')
const bodyParser = require('body-parser')
const { Client } = require('pg')
const format = require('pg-format')



const client = new Client({
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
  const insertText = format('INSERT INTO strokes(user, time, keys, modifiers, direction) VALUES %L', req.body.map(r => {
    return [r.user, r.time, r.keyCode, r.modifiers, r.direction]
  }))
  console.log(insertText)

  client.query(insertText, (err, res) => {
    if (err) {
      console.log(err.stack)
      res.send(err.stack)
      done()
    } else {
      res.send('success')
    }
  })
})

app.get('/strokes', function (req, res) {
  client.query('SELECT * FROM strokes LIMIT ' + (req.query.limit || 20), (err, res) => {
    if (err) {
      console.log(err.stack)
      res.send(err.stack)
      done()
    } else {
      res.send(res.rows)
    }
  })
})

app.listen(app.get('port'), function () {
  console.log('Example app listening on port ' + app.get('port'))
})