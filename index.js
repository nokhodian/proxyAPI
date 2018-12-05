var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');


var PORT = process.env.PORT || 3000;
var app = express();
app.use(bodyParser.json({}));
app.listen(PORT, function () {
  console.log('node proxy listening on port %s.', PORT);
});


//set your Server URL here
const BASE_URL = 'http://localhost:2018';


app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  const options = {
    url: BASE_URL + req.originalUrl,
    method: req.method,
    body: req.body,
    headers: {
      'content-type': req.headers['content-type'],
      authorization: req.headers['authorization']
    },
    json: true
  };

  request(options, function (error, response, body) {
    try {
      if (response.statusCode == 200) {
        console.log("The following request and response has been served successfuly")
        console.log(options)
        console.log(body)
        res.send(body);
      } else {
        console.log('error: ' + response.statusCode);
        console.log(options)
        console.log(body)
        res.send(body).status(response.statusCode);
      }
    } catch (err) {
      console.log(err)
      res.send("error: "+err).status(500)
    }
  })
});