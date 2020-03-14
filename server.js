const APP_SECRET = '71039e1375a8646c665426c95058eed2';
const VALIDATION_TOKEN = 'TokenTuyChon';
const PAGE_ACCESS_TOKEN = 'EAAgeOMAwZCzEBAHwAR0c8iP70ZBGrMWwUfT47SIyZCwygnnZBCqtSqnQQ5ukqXZCEkotUq4riaB3WMb2aH6EF3ZC5HQCgbcg7AmGyuFgS9knAZABvp6vK2ZBINoTDRxrE3vCaZBj5CZCutgYFMHA4y6gKZASXUbwDMAPhZCakEPkDT2CvQZDZD';
 
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
 
var app = express();
app.use(bodyParser.urlencoded({
  extended: false
}));
var server = http.createServer(app);
var request = require("request");
 
app.get('/', (req, res) => {
  res.send("Server chay ngon lanh !!");
});
 
app.get('/webhook', function(req, res) { // Đây là path để validate tooken bên app facebook gửi qua
  if (req.query['hub.verify_token'] === VALIDATION_TOKEN) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});
 
app.post('/webhook', function(req, res) { // Phần sử lý tin nhắn của người dùng gửi đến
  var entries = req.body.entry;
  for (var entry of entries) {
    var messaging = entry.messaging;
    for (var message of messaging) {
      var senderId = message.sender.id;
      if (message.message) {
        if (message.message.text) {
          var text = message.message.text;
          sendMessage(senderId, "Hello!! I'm a bot. Your message: " + text);
        }
      }
    }
  }
  res.status(200).send("OK");
});
 
// Đây là function dùng api của facebook để gửi tin nhắn
function sendMessage(senderId, message) {
  request({
    url: 'https://graph.facebook.com/v6.0/me/messages',
    qs: {
      access_token: PAGE_ACCESS_TOKEN,
    },
    method: 'POST',
    json: {
      recipient: {
        id: senderId
      },
      message: {
        text: message
      },
    }
  });
}
 
app.set('port', process.env.PORT || 5000);
app.set('ip', process.env.IP || "0.0.0.0");
 
server.listen(app.get('port'), app.get('ip'), function() {
  console.log("Chat bot server listening at %s:%d ", app.get('ip'), app.get('port'));
});
