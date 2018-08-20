// http://samuli.hakoniemi.net/how-to-implement-safari-push-notifications-on-your-website/
if ('safari' in window && 'pushNotification' in window.safari) {
  let permissionData = window.safari.pushNotification.permission('web.com.example.domain');
  return checkRemotePermission(permissionData);
}

const checkRemotePermission = async function (permissionData) {
  if (permissionData.permission === 'default') {
    window.safari.pushNotification.requestPermission(
        'https://domain.example.com', // The web service URL.
        'web.com.example.domain',     // The Website Push ID.
        {},
        checkRemotePermission
    );
  }
  else if (permissionData.permission === 'denied') {
    return permissionData;
  }
  else if (permissionData.permission === 'granted') {
    return permissionData;
  }
};