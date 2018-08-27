const router = require("express").Router();
const webpush = require("web-push");
const config = require("config");
const users = require("./users.sql");

router.post("/send/:category", async (req, res) => {
  try {
    const subscription = buildSubList(
      await users.getByCategory(req.params.category)
    );

    const content = req.body;

    subscription.forEach(userSub => {
      const { user, subscription } = userSub;
      const payload = JSON.stringify({
        title: `${content.title} ${user.name}`,
        body: content.mainText,
        icon: "/icon.png",
        data: {
          link: content.link
        }
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

module.exports = router;
