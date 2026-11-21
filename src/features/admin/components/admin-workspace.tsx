"use client";

import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { AdminDashboard } from "./admin-dashboard";
import { AdminLogin } from "./admin-login";
import { useAdminAuth } from "../hooks/use-admin-auth";
import type { AdminSection } from "../store/use-admin-store";

interface AdminWorkspaceProps {
  section: AdminSection;
}

/** The client shell shared by every URL in the administrator workspace. */
export function AdminWorkspace({ section }: AdminWorkspaceProps) {
  const router = useRouter();
  const {
    session,
    loading,
    initialChecking,
    error,
    users,
    roles,
    submissions,
    matches,
    teams,
    leagues,
    loadingSubmissions,
    login,
    logout,
    createUser,
    updateUser,
    deleteUser,
    toggleUserBlock,
    createRole,
    updateRole,
    deleteRole,
    createMatch,
    updateMatch,
    deleteMatch,
    previewMatchesFromSofascoreJson,
    importMatchesFromSofascoreJson,
    markSubmissionAsRead,
    deleteSubmission,
    reloadUsers,
    reloadSubmissions,
  } = useAdminAuth();

  if (initialChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-primary text-white">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="size-8 animate-spin text-secondary" />
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
            Cargando Chicas SC Workspace…
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AdminLogin onLogin={login} loading={loading} error={error} />;
  }

  return (
    <AdminDashboard
      session={session}
      activeSection={section}
      onSelectSection={(nextSection) => router.push(`/xsadmin/${nextSection}`)}
      users={users}
      roles={roles}
      submissions={submissions}
      matches={matches}
      teams={teams}
      leagues={leagues}
      loadingSubmissions={loadingSubmissions}
      onLogout={logout}
      onToggleBlock={toggleUserBlock}
      onCreateUser={createUser}
      onUpdateUser={updateUser}
      onDeleteUser={deleteUser}
      onCreateRole={createRole}
      onUpdateRole={updateRole}
      onDeleteRole={deleteRole}
      onCreateMatch={createMatch}
      onUpdateMatch={updateMatch}
      onDeleteMatch={deleteMatch}
      onPreviewSofascoreJson={previewMatchesFromSofascoreJson}
      onImportSofascoreJson={importMatchesFromSofascoreJson}
      onMarkAsRead={markSubmissionAsRead}
      onDeleteSubmission={deleteSubmission}
      onRefresh={reloadUsers}
      onRefreshSubmissions={reloadSubmissions}
    />
  );
}
