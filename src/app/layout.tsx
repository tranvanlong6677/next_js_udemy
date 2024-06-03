"use client";
import FooterPlays from "@/components/footer/app.footer";
import AppHeader from "@/components/header/app.header";
import ThemeRegistry from "@/components/theme-registry/theme.registry";
import Box from "@mui/material/Box";

import * as React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <AppHeader />
          {children}
          <FooterPlays />
        </ThemeRegistry>
      </body>
    </html>
  );
}
