var http = require('http'),
    express = require('express');

var app = express();

var port = process.env.PORT || 3000;
var ip = '10.15.17.134';

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.get('/:coll/latest', (req, res) => {
  console.log('requested~');
  var options = {
    hostname: '127.0.0.1',
    port: '8080',
    path: '/' + req.params.coll + '/latest',
    method: 'GET'
  }
  http.request(options, cpuRes => {
    cpuRes.setEncoding('utf8');
    return cpuRes.on('data', data => {
      res.send(data);
    });
  }).end();
});

app.listen(port, ip, () => {
  console.log('Listening to port: ' + port);
});
