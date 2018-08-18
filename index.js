const express = require("express");
const webpush = require("web-push");
const config = require("config");
const subs = require("./store-push-subs");
const users = require("./src/users.sql");

function getAppKeys() {
  try {
    const webPush = config.get("webPush");
    return {
      publicVapidKey: webPush.publicKey,
      privateVapidKey: webPush.privateKey
    };
  } catch (e) {
    return {
      publicVapidKey: process.env.PUBLIC_VAPID_KEY,
      privateVapidKey: process.env.PRIVATE_VAPID_KEY
    };
  }
}

const { publicVapidKey, privateVapidKey } = getAppKeys();

webpush.setVapidDetails(
  "mailto:fake@newexample.com",
  publicVapidKey,
  privateVapidKey
);

const app = express();

app.use(express.static("public"));
app.use(require("body-parser").json());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/web-push/setup", (req, res) => {
  res.status(200).json({
    vapidPublicKey: publicVapidKey
  });
});

app.get("/web-push/users/get-all", async (req, res) => {
  const dbUsers = await users.getAll();
  res.status(200).json(dbUsers.rows);
});

app.get("/web-push/users/category/:category", async (req, res) => {
  const dbUsers = await users.getByCategory(req.params.category);
  res.status(200).json(dbUsers.rows);
});

app.post("/web-push/users/subscribe", async (req, res) => {
  const user = req.body;
  if (user.name) {
    try {
      const { endpoint, expirationTime, keys } = user.subscription;
      await users.insert([
        user.name,
        user.category,
        user.granted,
        endpoint,
        expirationTime,
        keys.p256dh,
        keys.auth
      ]);
      res.status(201).end();
    } catch (e) {
      console.log(e);
      res.status(500).json({
        error: e.message
      });
    }
  } else {
    res.status(400).json({
      error: "Need a username to subscribe!"
    });
  }
});

function buildSubList(listOfSubs) {
  return listOfSubs.rows.map(user => ({
    user: {
      name: user.name,
      category: user.category
    },
    subscription: {
      endpoint: user.endpoint,
      expirationTime: user.expirationTime,
      keys: {
        p256dh: user.keyp256dh,
        auth: user.keyauth
      }
    }
  }));
}

app.get("/web-push/send/:category", async (req, res) => {
  try {
    const subscription = buildSubList(
      await users.getByCategory(req.params.category)
    );

    subscription.forEach(userSub => {
      const { user, subscription } = userSub;
      const payload = JSON.stringify({
        title: user.name,
        body: `Check this content`,
        icon: "/icon.png"
      });

      webpush.sendNotification(subscription, payload).catch(error => {
        console.error(error.stack);
      });
    });
    res.status(200).end();
  } catch (ex) {
    if (ex.code === "ENOENT") {
      return res.status(400).json({
        error: "Category not found"
      });
    }

    res.status(500).json({
      error: "Oops ... something went wrong!!"
    });
  }
});

// TODO:
// - list subs
// - post custom message to subs
// - put subs in categories
// - look into db

const PORT = process.env.PORT || 3002;
app.listen(PORT);
console.log(`Running on: localhost:${PORT}`);
