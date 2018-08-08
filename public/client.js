async function getVapidPublicKey(){
  const res = await fetch('/web-push/setup');
  const setup = await res.json();
  return setup.vapidPublicKey;
}

if ('serviceWorker' in navigator) {
  console.log('Registering service worker');

  run().catch(error => console.error(error));
}

async function run() {
  const registration = await navigator.serviceWorker.
    register('/worker.js', { scope: '/' });
  console.log('Registered service worker');

  const publicVapidKey = await getVapidPublicKey();

  const subscription = await registration.pushManager.
    subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
  console.log('Subscribe push');

  await fetch('/web-push/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json'
    }
  });
  console.log('API sub and sent push');
}

// Boilerplate borrowed from https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
