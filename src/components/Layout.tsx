"use client";

import { ReactNode } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <ProtectedRoute>
        <main className="flex-1 p-8">{children}</main>
      </ProtectedRoute>
    </div>
  );
} 