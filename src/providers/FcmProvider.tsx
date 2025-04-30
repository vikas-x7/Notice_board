"use client";

import { useEffect } from "react";
import { requestForToken, onMessageListener } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function FcmProvider({ children }: { children: React.ReactNode }) {

    useEffect(() => {
        // Attempt to register service worker and get token
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            // Register service worker if not already registered
            navigator.serviceWorker
                .register("/firebase-messaging-sw.js")
                .then((registration) => {
                    console.log("Service Worker registered successfully:", registration);

                    requestForToken()
                        .then((token) => {
                            if (token) {
                                // Optionally log or send this token to your backend
                                console.log("FCM Token:", token);
                                fetch("/api/v1/users/fcm-token", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ fcmToken: token }),
                                }).catch(err => console.error("Failed to save FCM token to backend", err));
                            }
                        })
                        .catch((err) => {
                            console.error("Failed to get FCM token", err);
                        });
                })
                .catch((err) => {
                    console.error("Service Worker registration failed:", err);
                });
        }

        // Listener for foreground notifications
        const listen = () => {
            onMessageListener()
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .then((payload: any) => {
                    if (payload) {
                        console.log("Received foreground message:", payload);
                        toast.success(
                            `${payload.notification?.title}: ${payload.notification?.body}`,
                            { duration: 5000 }
                        );
                        // Optionally fetch new notices here or refresh query data
                    }
                    listen(); // recursively call to keep listening
                })
                .catch((err) => console.log("failed to listen", err));
        };

        listen();

    }, []);

    return <>{children}</>;
}
