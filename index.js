const express = require('express');
const webpush = require('web-push');
const config = require('config');
const subs = require('./store-push-subs');

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
  const user = req.body;
  if (user.name) {
    subs.write(user.name, user.subscription);
    res.status(201).end();
  } else {
    res.status(400).json({
      error: "Need a username to subscribe!"
    });
  }
});

app.get('/web-push/send/:username', async (req, res) => {
  if (!'username' in req.params) {
    return res.status(400).json({
      "error": "Last URL segment needs to be a username"
    });
  }

  const username = req.params.username;
  const subscriptionStr = await subs.read(username);
  const subscription = JSON.parse(subscriptionStr);

  const payload = JSON.stringify({ title: "Amazing", body: `Check this content ${username}`, icon: "/icon.png" });

  webpush.sendNotification(subscription, payload).catch(error => {
    console.error(error.stack);
  });

  res.status(200).end();
});

// TODO:
// - list subs
// - post custom message to subs
// - put subs in categories
// - look into db

const PORT = 3002;
app.listen(PORT);
console.log(`Running on: localhost:${PORT}`);
