"use client";

import { useAdminAuth } from "@/features/admin/hooks/use-admin-auth";
import { AdminLogin } from "@/features/admin/components/admin-login";
import { AdminDashboard } from "@/features/admin/components/admin-dashboard";
import { LoaderCircle } from "lucide-react";

export default function AdminPage() {
  const {
    session,
    loading,
    initialChecking,
    error,
    activeSection,
    setActiveSection,
    users,
    roles,
    submissions,
    matches,
    teams,
    leagues,
    loadingSubmissions,
    loadingMatches,
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
    markSubmissionAsRead,
    deleteSubmission,
    reloadUsers,
    reloadSubmissions,
    reloadMatches,
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

  if (session) {
    return (
      <AdminDashboard
        session={session}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        users={users}
        roles={roles}
        submissions={submissions}
        matches={matches}
        teams={teams}
        leagues={leagues}
        loadingSubmissions={loadingSubmissions}
        loadingMatches={loadingMatches}
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
        onMarkAsRead={markSubmissionAsRead}
        onDeleteSubmission={deleteSubmission}
        onRefresh={reloadUsers}
        onRefreshSubmissions={reloadSubmissions}
        onRefreshMatches={reloadMatches}
      />
    );
  }

  return <AdminLogin onLogin={login} loading={loading} error={error} />;
}
