"use client";
import ThemeRegistry from "@/components/theme-registry/theme.registry";
import * as React from "react";
import NextAuthWrapper from "./lib/next.auth.wrapper";
import { ToastProvider } from "@/utils/toast";
import { TrackContextProvider } from "./lib/context/track.context";
import NProgressProvider from "./lib/nprogressProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <NextAuthWrapper>
            <NProgressProvider>
              <TrackContextProvider>
                <ToastProvider>{children}</ToastProvider>
              </TrackContextProvider>
            </NProgressProvider>
          </NextAuthWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
