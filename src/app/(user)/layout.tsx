"use client";
import FooterPlays from "@/components/footer/app.footer";
import AppHeader from "@/components/header/app.header";
import * as React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      {children}
      <FooterPlays />
    </>
  );
}
