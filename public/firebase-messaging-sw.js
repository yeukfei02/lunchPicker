
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Registration successful, scope is = ', registration.scope);
    }).catch((err) => {
      console.log('Service worker registration failed, error = ', err);
    });
}
