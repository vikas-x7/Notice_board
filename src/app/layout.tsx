import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import QueryProvider from "@/providers/QueryProvider";
import FcmProvider from "@/providers/FcmProvider";

export const metadata: Metadata = {
  title: "Smart Notice Board - College Notice Management System",
  description:
    "A modern college notice board with real-time updates, category filtering, and role-based access control.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1D1C1B",
                color: "#FFFFFE",
                border: "1px solid #1D1C1B",
                borderRadius: "1px",
              },
              success: {
                iconTheme: {
                  primary: "#10B981",
                  secondary: "#1A1933",
                },
              },
              error: {
                iconTheme: {
                  primary: "#EF4444",
                  secondary: "#1A1933",
                },
              },
            }}
          />
          <FcmProvider>
            {children}
          </FcmProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
