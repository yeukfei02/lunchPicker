importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.1/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyD55je9pcQGJ96G-V6NYjAbNkcLMlXsE9A",
  authDomain: "lunchpicker-2232b.firebaseapp.com",
  databaseURL: "https://lunchpicker-2232b.firebaseio.com",
  projectId: "lunchpicker-2232b",
  storageBucket: "lunchpicker-2232b.appspot.com",
  messagingSenderId: "504803962297",
  appId: "1:504803962297:web:0e92e242eb0375414ada68",
  measurementId: "G-H20YZMFE14"
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message = ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
