console.log("Loaded service worker!");

self.addEventListener("push", ev => {
  const data = ev.data.json();
  console.log("Got push", data);
  self.registration.showNotification(data.title, data);
});

self.addEventListener("notificationclick", function(event) {
  console.log("On notification click: ", event.notification);
  const link = event.notification.data.link;
  // Android doesn't close the notification when you click on it
  event.notification.close();
  return clients.openWindow(link);
});
