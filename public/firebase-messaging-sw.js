importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyDMWEotdNWI5ENPlJS_-T_PCrh9w5p_jgE",
    authDomain: "testhackathon-1326d.firebaseapp.com",
    projectId: "testhackathon-1326d",
    storageBucket: "testhackathon-1326d.firebasestorage.app",
    messagingSenderId: "37810288560",
    appId: "1:37810288560:web:3f0c827b0b596331c60875",
    measurementId: "G-R1D3LKQ2S7"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/firebase-logo.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
