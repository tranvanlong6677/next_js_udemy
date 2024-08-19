"use client";
import { SessionProvider } from "next-auth/react";
import * as React from "react";

export default function NextAuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
