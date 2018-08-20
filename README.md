# Notify

Push a web notification to the browser.

Generate `web-push` VAPID keys `.\node_modules\.bin\web-push.cmd generate-vapid-keys [--json]`

Default config `config/default.json`:

```json
{
  "webPush": {
    "publicKey": "",
    "privateKey": ""
  },
  "notifyDatabase": {
    "user": "",
    "host": "",
    "database": "",
    "password": "",
    "port": 5432
  }
}
```

## Safari push notifications

_If you're not willing to pay $99 for Apple Developer Program, then no notifications for Safari users_

- Safari 7 (OS X 10.9 or later required) for testing,
- A website under HTTPS protocol,
- Apple Developer Program account for registering a Website Push ID
- [Tutorial: samuil.hakoniemi.net](http://samuli.hakoniemi.net/how-to-implement-safari-push-notifications-on-your-website/)
- [Safari push notifications: developer.apple.com](https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/NotificationProgrammingGuideForWebsites/PushNotifications/PushNotifications.html)
