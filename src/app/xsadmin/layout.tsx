import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "Administración | Chicas SC" },
  robots: { index: false, follow: false, noarchive: true },
};

export default function AdminLayout({ children }: { children: ReactNode }) { return <div data-admin-ui>{children}</div>; }
