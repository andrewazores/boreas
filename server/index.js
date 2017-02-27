'use strict';

var http = require('http'),
  express = require('express'),
  fs = require('fs');

var app = express();

var port = process.env.PORT || 3000;

try {
  var ip = fs.readFileSync('SERVER_IP', 'utf8').trim();
} catch (e) {
  console.log('Please make sure you have a file named SERVER_IP with your desired IP');
  process.exit(1);
}

app.use(express.static(__dirname + '/public'));
app.get('/:coll/latest', (req, res) => {
  console.log('requested~');
  var options = {
    hostname: '127.0.0.1',
    port: '8080',
    path: '/' + req.params.coll + '/latest',
  }
  http.get(options, serverRes => {
    serverRes.setEncoding('utf8');
    let rawData = '';
    serverRes.on('data', chunk => {
      rawData += chunk;
    });
    serverRes.on('end', () => {
        res.send(rawData);
    })
  }).on('error', err => { res.sendStatus(500); console.log(err); });
});

app.listen(port, ip, () => {
  console.log('Listening on\n' + 'IP: ' + ip + '\n' + 'PORT: ' + port);
});
