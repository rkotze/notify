# Notify

Push a web notification to the browser.

Generate `web-push` VAPID keys `.\node_modules\.bin\web-push.cmd generate-vapid-keys [--json]`

Default config `config/default.json`:

```json
{
  "webPush": {
    "publicKey": " ",
    "privateKey": " "
  }
}
```