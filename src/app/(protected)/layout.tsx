"use client";
import { SessionProvider } from "next-auth/react";
import Layout from "@/components/Layout";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Layout>{children}</Layout>
    </SessionProvider>
  );
} 