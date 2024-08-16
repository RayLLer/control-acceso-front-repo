import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import Providers from "./providers/provider";

export const metadata: Metadata = {
  title: "Test Opo",
  description: "El giro que necesitas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ marginTop: 0, marginLeft: 0 }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
