const express = require('express')
const bodyParser = require('body-parser')
const pg = require('pg')
const format = require('pg-format')

var app = express()
/*
var pg = require('pg');

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
});
*/

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
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {

    const insertText = format('INSERT INTO strokes(user, time, keys, modifiers, direction) VALUES %L', req.body.map(r => {
      return [r.user, r.time, r.keyCode, r.modifiers, r.direction]
    }))
    console.log(insertText)
    await client.query(insertText)
    res.send('Success')
    done()
  })
})

app.get('/strokes', function (req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    const result = await client.query('SELECT * FROM strokes LIMIT ' + (req.query.limit || 20))
    res.send(result.rows)
    done()
  })
})

app.listen(app.get('port'), function () {
  console.log('Example app listening on port 3000!')
})