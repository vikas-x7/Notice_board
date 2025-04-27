import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDMWEotdNWI5ENPlJS_-T_PCrh9w5p_jgE",
  authDomain: "testhackathon-1326d.firebaseapp.com",
  projectId: "testhackathon-1326d",
  storageBucket: "testhackathon-1326d.firebasestorage.app",
  messagingSenderId: "37810288560",
  appId: "1:37810288560:web:3f0c827b0b596331c60875",
  measurementId: "G-R1D3LKQ2S7"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const VAPID_KEY = "BL3kcK73Q-kZjvMHdVPduKp5WSGMddGdpa3IWCfOFZuJ6TP_bOMLdD54vi11B1scgNHAtt5aAzfJZ7Qq3Box-Es";

export const requestForToken = async () => {
  try {
    const isSupportedBrowser = await isSupported();
    if (!isSupportedBrowser) {
      console.log("Firebase Messaging is not supported in this browser.");
      return null;
    }
    
    if (typeof window !== "undefined") {
      const messaging = getMessaging(app);
      const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (currentToken) {
        console.log("current token for client: ", currentToken);
        // Here you can send the token to your server to store it.
        return currentToken;
      } else {
        console.log("No registration token available. Request permission to generate one.");
        return null;
      }
    }
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    isSupported().then((isSupportedBrowser) => {
      if (isSupportedBrowser && typeof window !== "undefined") {
        const messaging = getMessaging(app);
        onMessage(messaging, (payload) => {
          resolve(payload);
        });
      }
    });
  });

export { app };
