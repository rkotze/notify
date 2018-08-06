const express = require('express');
const webpush = require('web-push');

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webpush.setVapidDetails('mailto:fake@newexample.com', publicVapidKey, privateVapidKey);

const app = express();

app.use(express.static('public'));
app.use(require('body-parser').json());

app.post('/subscribe', (req, res) => {
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
