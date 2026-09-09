"use client";

import { useState } from "react";
import {
  Inbox,
  Users,
  Shield,
  Trophy,
  Plus,
  LogOut,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "./user-avatar";
import { InboxSubmissions } from "./inbox-submissions";
import { UsersView } from "./users-view";
import { RolesView } from "./roles-view";
import { MatchesView } from "./matches-view";
import type {
  AdminSession,
  AdminUser,
  Role,
  AdminContactSubmission,
  AdminMatch,
  AdminTeam,
  AdminLeague,
  MatchStatus,
} from "../types";
import type { AdminSection } from "../store/use-admin-store";

interface AdminDashboardProps {
  session: AdminSession;
  activeSection?: AdminSection;
  onSelectSection?: (section: AdminSection) => void;
  users: AdminUser[];
  roles: Role[];
  submissions: AdminContactSubmission[];
  matches?: AdminMatch[];
  teams?: AdminTeam[];
  leagues?: AdminLeague[];
  loadingSubmissions?: boolean;
  loadingMatches?: boolean;
  onLogout: () => void;
  // Users
  onToggleBlock: (userId: string, isBlocked: boolean) => Promise<void>;
  onCreateUser: (newUser: Omit<AdminUser, "id">) => Promise<void>;
  onUpdateUser?: (userId: string, data: Partial<Omit<AdminUser, "id">>) => Promise<void>;
  onDeleteUser?: (userId: string) => Promise<void>;
  // Roles
  onCreateRole?: (role: Role) => Promise<void>;
  onUpdateRole?: (roleId: string, data: Partial<Omit<Role, "id">>) => Promise<void>;
  onDeleteRole?: (roleId: string) => Promise<void>;
  // Matches
  onCreateMatch?: (matchData: {
    homeTeamId: string;
    awayTeamId: string;
    leagueId: string;
    kickoffAt: Date;
    homeScore: number | null;
    awayScore: number | null;
    status: MatchStatus;
  }) => Promise<void>;
  onUpdateMatch?: (
    matchId: string,
    matchData: Partial<{
      homeTeamId: string;
      awayTeamId: string;
      leagueId: string;
      kickoffAt: Date;
      homeScore: number | null;
      awayScore: number | null;
      status: MatchStatus;
    }>,
  ) => Promise<void>;
  onDeleteMatch?: (matchId: string) => Promise<void>;
  // Submissions
  onMarkAsRead?: (id: string) => Promise<void> | void;
  onDeleteSubmission?: (id: string) => Promise<void> | void;
  // Refreshes
  onRefresh: () => Promise<void>;
  onRefreshSubmissions?: () => Promise<void>;
  onRefreshMatches?: () => Promise<void>;
}

export function AdminDashboard({
  session,
  activeSection: initialSection = "inbox",
  onSelectSection,
  users,
  roles,
  submissions = [],
  matches = [],
  teams = [],
  leagues = [],
  loadingSubmissions = false,
  loadingMatches = false,
  onLogout,
  onToggleBlock,
  onCreateUser,
  onUpdateUser = async () => { },
  onDeleteUser = async () => { },
  onCreateRole = async () => { },
  onUpdateRole = async () => { },
  onDeleteRole = async () => { },
  onCreateMatch = async () => { },
  onUpdateMatch = async () => { },
  onDeleteMatch = async () => { },
  onMarkAsRead,
  onDeleteSubmission = async () => { },
  onRefresh,
  onRefreshSubmissions,
  onRefreshMatches = async () => { },
}: AdminDashboardProps) {
  const [localSection, setLocalSection] = useState<AdminSection>(initialSection);
  const [inboxTab, setInboxTab] = useState<"principal" | "otras" | "mas_tarde" | "borradas">("principal");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const activeSection = onSelectSection ? initialSection : localSection;
  const changeSection = (s: AdminSection) => {
    if (onSelectSection) onSelectSection(s);
    else setLocalSection(s);
  };

  const { user, role } = session;
  const fullName = `${user.nombres} ${user.apellidos}`.trim() || user.usuario;
  const workspaceTitle = `${user.nombres} ${user.apellidos}'s Workspace`;
  const unreadCount = submissions.filter((s) => s.status !== "read").length;

  const sectionTitles: Record<AdminSection, string> = {
    inbox: "Bandeja de entrada",
    users: "Gestión de Usuarios",
    roles: "Gestión de Roles",
    matches: "Gestión de Partidos",
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white text-slate-800 font-sans antialiased text-[13px]">
      {/* 1. Barra lateral de navegación (Sidebar claro) */}
      <aside className="flex flex-col w-[240px] bg-[#f8f9fa] border-r border-[#e8eaee] shrink-0 select-none overflow-y-auto">
        {/* Cabecera Sidebar con workspace */}
        <div className="flex items-center justify-between px-3.5 pt-3.5 pb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="size-6 rounded-md bg-primary text-white text-[11px] font-bold flex items-center justify-center shrink-0">
              {user.nombres.charAt(0)}
            </div>
            <h2 className="font-semibold text-slate-900 text-xs truncate max-w-[140px]" title={workspaceTitle}>
              {workspaceTitle}
            </h2>
          </div>
        </div>

        {/* 4 Secciones de navegación principales */}
        <div className="px-2 py-2 space-y-1">
          {/* 1. Bandeja de entrada */}
          <button
            type="button"
            onClick={() => changeSection("inbox")}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg font-medium text-xs transition-colors cursor-pointer ${activeSection === "inbox"
                ? "text-slate-900 bg-[#e7ebf0] font-semibold"
                : "text-slate-600 hover:bg-[#eaeef3] hover:text-slate-900"
              }`}
          >
            <div className="flex items-center gap-2.5">
              <Inbox className={`size-4 ${activeSection === "inbox" ? "text-primary" : "text-slate-500"}`} />
              <span>Bandeja de entrada</span>
            </div>
            {unreadCount > 0 ? (
              <span
                className="px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold shadow-2xs"
                title={`${unreadCount} mensajes sin leer`}
              >
                {unreadCount}
              </span>
            ) : submissions.length > 0 ? (
              <span
                className="px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-medium"
                title="Todos leídos"
              >
                {submissions.length}
              </span>
            ) : null}
          </button>

          {/* 2. Usuarios */}
          <button
            type="button"
            onClick={() => changeSection("users")}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg font-medium text-xs transition-colors cursor-pointer ${activeSection === "users"
                ? "text-slate-900 bg-[#e7ebf0] font-semibold"
                : "text-slate-600 hover:bg-[#eaeef3] hover:text-slate-900"
              }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className={`size-4 ${activeSection === "users" ? "text-primary" : "text-slate-500"}`} />
              <span>Usuarios</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-medium">
              {users.length}
            </span>
          </button>

          {/* 3. Roles */}
          <button
            type="button"
            onClick={() => changeSection("roles")}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg font-medium text-xs transition-colors cursor-pointer ${activeSection === "roles"
                ? "text-slate-900 bg-[#e7ebf0] font-semibold"
                : "text-slate-600 hover:bg-[#eaeef3] hover:text-slate-900"
              }`}
          >
            <div className="flex items-center gap-2.5">
              <Shield className={`size-4 ${activeSection === "roles" ? "text-primary" : "text-slate-500"}`} />
              <span>Roles</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-medium">
              {roles.length}
            </span>
          </button>

          {/* 4. Partidos */}
          <button
            type="button"
            onClick={() => changeSection("matches")}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg font-medium text-xs transition-colors cursor-pointer ${activeSection === "matches"
                ? "text-slate-900 bg-[#e7ebf0] font-semibold"
                : "text-slate-600 hover:bg-[#eaeef3] hover:text-slate-900"
              }`}
          >
            <div className="flex items-center gap-2.5">
              <Trophy className={`size-4 ${activeSection === "matches" ? "text-primary" : "text-slate-500"}`} />
              <span>Partidos</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-medium">
              {matches.length}
            </span>
          </button>
        </div>

        {/* Info inferior */}
        <div className="mt-auto p-3 border-t border-[#e8eaee] text-[11px] text-slate-400 select-none">
          <p className="font-semibold text-slate-600">Chicas SC Admin</p>

        </div>
      </aside>

      {/* 2. Área Principal de Trabajo */}
      <div className="flex flex-col flex-1 min-w-0 bg-white">
        {/* Barra superior de cabecera */}
        <header className="flex items-center justify-between h-12 px-6 border-b border-[#e8eaee] bg-white select-none">
          {/* Breadcrumb del tab activo */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Workspace</span>
            <ChevronRight className="size-3 text-slate-300" />
            <span className="font-semibold text-slate-800">{sectionTitles[activeSection]}</span>
          </div>

          {/* Lado derecho: Perfil y Menú */}
          <div className="flex items-center gap-3 text-slate-500">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <UserAvatar
                  nombres={user.nombres}
                  apellidos={user.apellidos}
                  urlAvatar={user.urlAvatar}
                  size="sm"
                  showOnlineDot
                />
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-semibold text-slate-800 leading-none">{fullName}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{role?.nombre || "Administrador"}</p>
                </div>
              </button>

              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-200 z-40 p-2 text-xs space-y-1">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="font-bold text-slate-900">{fullName}</p>
                      <p className="text-slate-400">@{user.usuario}</p>
                      <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 text-[10px] font-medium">
                        <ShieldCheck className="size-2.5" />
                        {role?.nombre || "Sin rol"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <LogOut className="size-3.5" />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* 3. Contenido Dinámico según la sección seleccionada */}
        {activeSection === "inbox" && (
          <div className="flex flex-col flex-1 min-h-0">
            {/* Sub-cabecera con pestañas de Bandeja */}
            <div className="flex items-center px-6 border-b border-[#e8eaee] select-none bg-white">
              {[
                { id: "principal", label: "Principal", icon: Inbox },
                { id: "otras", label: "Otras", icon: null },
                { id: "mas_tarde", label: "Más tarde", icon: null },
                { id: "borradas", label: "Borradas", icon: null },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setInboxTab(tab.id as typeof inboxTab)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer ${inboxTab === tab.id
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                >
                  {tab.icon && <tab.icon className="size-3.5" />}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <InboxSubmissions
              submissions={submissions}
              loading={loadingSubmissions}
              onRefresh={onRefreshSubmissions || onRefresh}
              onMarkAsRead={onMarkAsRead}
              onDeleteSubmission={onDeleteSubmission}
              filterTab={inboxTab}
            />
          </div>
        )}

        {activeSection === "users" && (
          <UsersView
            users={users}
            roles={roles}
            currentUserId={user.id}
            onCreateUser={onCreateUser}
            onUpdateUser={onUpdateUser}
            onDeleteUser={onDeleteUser}
            onToggleBlock={onToggleBlock}
            onRefresh={onRefresh}
          />
        )}

        {activeSection === "roles" && (
          <RolesView
            roles={roles}
            users={users}
            onCreateRole={onCreateRole}
            onUpdateRole={onUpdateRole}
            onDeleteRole={onDeleteRole}
            onRefresh={onRefresh}
          />
        )}

        {activeSection === "matches" && (
          <MatchesView
            matches={matches}
            teams={teams}
            leagues={leagues}
            onCreateMatch={onCreateMatch}
            onUpdateMatch={onUpdateMatch}
            onDeleteMatch={onDeleteMatch}
            onRefresh={onRefreshMatches}
          />
        )}
      </div>
    </div>
  );
}
