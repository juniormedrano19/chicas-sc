import { notFound } from "next/navigation";
import { AdminWorkspace } from "@/features/admin/components/admin-workspace";
import type { AdminSection } from "@/features/admin/store/use-admin-store";

const adminSections = ["inbox", "users", "roles", "matches", "members", "testimonials", "albums"] as const;

function isAdminSection(value: string): value is AdminSection {
  return adminSections.some((section) => section === value);
}

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;

  if (!isAdminSection(section)) {
    notFound();
  }

  return <AdminWorkspace section={section} />;
}
