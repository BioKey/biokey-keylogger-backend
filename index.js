var express = require('express')
var app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// respond with "hello world" when a GET request is made to the homepage
app.get('*', function (req, res) {
  res.send('hello world')
})

app.post('*', function (req, res) {
  console.log(req.body)
  res.send('hello world')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})