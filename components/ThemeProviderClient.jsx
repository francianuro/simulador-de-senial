"use client"

import React from "react";
import { ThemeProvider } from "@/components/theme-provider";

export default function ThemeProviderClient({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
