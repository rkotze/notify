const express = require('express');
const webpush = require('web-push');
const config = require('config');

const webPush = config.get('webPush');
const publicVapidKey = webPush.publicKey;
const privateVapidKey = webPush.privateKey;

webpush.setVapidDetails('mailto:fake@newexample.com', publicVapidKey, privateVapidKey);

const app = express();

app.use(express.static('public'));
app.use(require('body-parser').json());

app.get('/web-push/setup', (req, res) => {
  res.status(200).json({
    "vapidPublicKey": publicVapidKey
  });
});

app.post('/web-push/subscribe', (req, res) => {
  const subscription = req.body;
  res.status(201).json({});
  const payload = JSON.stringify({ title: 'Hint', body: "Check this hint out?", icon: "https://www.findmypast.co.uk/images/header/fmplogo-white1x-v2.png" });

  console.log(subscription);

  webpush.sendNotification(subscription, payload).catch(error => {
    console.error(error.stack);
  });
});

const PORT = 3002;
app.listen(PORT);
console.log(`Running on: localhost:${PORT}`);
