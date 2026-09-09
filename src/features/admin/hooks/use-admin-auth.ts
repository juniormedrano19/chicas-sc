"use client";

import { useEffect } from "react";
import { useAdminStore } from "../store/use-admin-store";

export function useAdminAuth() {
  const session = useAdminStore((s) => s.session);
  const loading = useAdminStore((s) => s.loading);
  const isHydrated = useAdminStore((s) => s.isHydrated);
  const error = useAdminStore((s) => s.error);
  const activeSection = useAdminStore((s) => s.activeSection);
  const users = useAdminStore((s) => s.users);
  const roles = useAdminStore((s) => s.roles);
  const submissions = useAdminStore((s) => s.submissions);
  const matches = useAdminStore((s) => s.matches);
  const teams = useAdminStore((s) => s.teams);
  const leagues = useAdminStore((s) => s.leagues);
  const loadingSubmissions = useAdminStore((s) => s.loadingSubmissions);
  const loadingMatches = useAdminStore((s) => s.loadingMatches);

  const setActiveSection = useAdminStore((s) => s.setActiveSection);
  const login = useAdminStore((s) => s.login);
  const logout = useAdminStore((s) => s.logout);
  const loadData = useAdminStore((s) => s.loadData);
  const loadSubmissions = useAdminStore((s) => s.loadSubmissions);
  const loadMatches = useAdminStore((s) => s.loadMatches);

  const createUser = useAdminStore((s) => s.createUser);
  const updateUser = useAdminStore((s) => s.updateUser);
  const deleteUser = useAdminStore((s) => s.deleteUser);
  const toggleUserBlock = useAdminStore((s) => s.toggleUserBlock);

  const createRole = useAdminStore((s) => s.createRole);
  const updateRole = useAdminStore((s) => s.updateRole);
  const deleteRole = useAdminStore((s) => s.deleteRole);

  const createMatch = useAdminStore((s) => s.createMatch);
  const updateMatch = useAdminStore((s) => s.updateMatch);
  const deleteMatch = useAdminStore((s) => s.deleteMatch);

  const markSubmissionAsRead = useAdminStore((s) => s.markSubmissionAsRead);
  const deleteSubmission = useAdminStore((s) => s.deleteSubmission);

  // Al montar con sesión activa o hidratada, refrescar datos desde Firestore
  useEffect(() => {
    if (session) {
      loadData();
    }
  }, [session, loadData]);

  return {
    session,
    loading,
    initialChecking: !isHydrated,
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
    reloadUsers: loadData,
    reloadSubmissions: loadSubmissions,
    reloadMatches: loadMatches,
  };
}
