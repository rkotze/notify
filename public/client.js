if ('serviceWorker' in navigator) {
  console.log('Registering service worker');
}

async function getVapidPublicKey() {
  const res = await fetch('/web-push/setup');
  const setup = await res.json();
  return setup.vapidPublicKey;
}

async function onSubscribe(e) {
  e.preventDefault();
  const subForm = document.getElementById('subForm');
  const formData = new FormData(subForm);

  const serviceWorker = await registerServiceWorker();
  const subscribe = await isSubscribed(serviceWorker);

  if (!subscribe) {
    const publicVapidKey = await getVapidPublicKey();
    const subscription = await createSubscribe(serviceWorker, publicVapidKey);

    console.log('Subscribe push');

    await fetch('/web-push/subscribe', {
      method: 'POST',
      body: JSON.stringify({
        name: formData.get("name"),
        subscription
      }),
      headers: {
        'content-type': 'application/json'
      }
    });
    console.log('API sub and sent push');
  }
};

async function createSubscribe(registration, publicVapidKey) {
  return await registration.pushManager.
    subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
}

async function registerServiceWorker() {
  return await navigator.serviceWorker.
    register('/worker.js', { scope: '/' });
}

async function isSubscribed(sw) {
  const subscription = await sw.pushManager.getSubscription();

  if (!subscription) {
    console.log("Not subscribed");
    return false;
  }
  console.log("Subscribed");
  return true;
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
