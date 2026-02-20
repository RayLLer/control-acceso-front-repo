importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

// Firebase config (from google-services-control-acceso.json)
const firebaseConfig = {
  apiKey: "AIzaSyDAaQXm0BSqOHOH4nzEaQD1V2kC5O8m_kQ",
  projectId: "control-acceso-968c1",
  messagingSenderId: "304990307525",
  appId: "1:304990307525:android:a9094aab2fde54aef29cac",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const title = (payload.notification && payload.notification.title) || 'Notificación';
  const options = {
    body: (payload.notification && payload.notification.body) || '',
    icon: '/img/logo.png'
  };
  self.registration.showNotification(title, options);
});
