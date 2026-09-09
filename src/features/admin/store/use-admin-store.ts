"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import { adminRepository } from "../repository";
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

export type AdminSection = "inbox" | "users" | "roles" | "matches";

interface AdminState {
  session: AdminSession | null;
  loading: boolean;
  error: string | null;
  activeSection: AdminSection;
  users: AdminUser[];
  roles: Role[];
  submissions: AdminContactSubmission[];
  matches: AdminMatch[];
  teams: AdminTeam[];
  leagues: AdminLeague[];
  loadingSubmissions: boolean;
  loadingMatches: boolean;
  isHydrated: boolean;

  // Actions
  setActiveSection: (section: AdminSection) => void;
  login: (code: string) => Promise<boolean>;
  logout: () => void;
  loadData: () => Promise<void>;
  loadSubmissions: () => Promise<void>;
  loadMatches: () => Promise<void>;

  // Users CRUD
  createUser: (newUser: Omit<AdminUser, "id">) => Promise<void>;
  updateUser: (userId: string, data: Partial<Omit<AdminUser, "id">>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  toggleUserBlock: (userId: string, isBlocked: boolean) => Promise<void>;

  // Roles CRUD
  createRole: (role: Role) => Promise<void>;
  updateRole: (roleId: string, data: Partial<Omit<Role, "id">>) => Promise<void>;
  deleteRole: (roleId: string) => Promise<void>;

  // Matches CRUD
  createMatch: (matchData: {
    homeTeamId: string;
    awayTeamId: string;
    leagueId: string;
    kickoffAt: Date;
    homeScore: number | null;
    awayScore: number | null;
    status: MatchStatus;
  }) => Promise<void>;
  updateMatch: (
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
  deleteMatch: (matchId: string) => Promise<void>;

  // Submissions
  markSubmissionAsRead: (id: string) => Promise<void>;
  deleteSubmission: (id: string) => Promise<void>;

  clearError: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      session: null,
      loading: false,
      error: null,
      activeSection: "inbox",
      users: [],
      roles: [],
      submissions: [],
      matches: [],
      teams: [],
      leagues: [],
      loadingSubmissions: false,
      loadingMatches: false,
      isHydrated: false,

      setActiveSection: (section) => set({ activeSection: section }),

      setHydrated: (hydrated) => set({ isHydrated: hydrated }),

      clearError: () => set({ error: null }),

      login: async (code: string): Promise<boolean> => {
        set({ loading: true, error: null });

        try {
          const [{ user, role }] = await Promise.all([
            adminRepository.authenticateWithCode(code),
            new Promise((r) => setTimeout(r, 800)),
          ]);

          const newSession: AdminSession = { user, role };
          set({ session: newSession, loading: false });

          // Cargar usuarios, roles, mensajes y partidos tras login
          await get().loadData();

          toast.success(`¡Bienvenido/a, ${user.nombres}!`, {
            description: `Sesión iniciada con rol ${role?.nombre || "Administrador"}.`,
            position: "top-right",
            duration: 5000,
          });

          return true;
        } catch (err: unknown) {
          const msg =
            err instanceof Error
              ? err.message
              : "No se pudo verificar el código de acceso.";
          set({ error: msg, loading: false });
          toast.error("Error de acceso", {
            description: msg,
            position: "top-right",
            duration: 5000,
          });
          return false;
        }
      },

      logout: () => {
        set({
          session: null,
          users: [],
          roles: [],
          submissions: [],
          matches: [],
          teams: [],
          leagues: [],
          error: null,
          activeSection: "inbox",
        });
        toast.info("Has cerrado sesión en el panel de administración.", {
          position: "top-right",
          duration: 3500,
        });
      },

      loadData: async () => {
        try {
          const [allUsers, allRoles, allSubmissions, allMatches, { teams, leagues }] =
            await Promise.all([
              adminRepository.getAllUsers(),
              adminRepository.getAllRoles(),
              adminRepository.getAllSubmissions(),
              adminRepository.getAllMatches(),
              adminRepository.getTeamsAndLeagues(),
            ]);

          set({
            users: allUsers,
            roles: allRoles,
            submissions: allSubmissions,
            matches: allMatches,
            teams,
            leagues,
          });

          // Seguridad activa: expulsar si el usuario autenticado fue bloqueado
          const currentSession = get().session;
          if (currentSession?.user) {
            const freshUser = allUsers.find(
              (u) =>
                u.id === currentSession.user.id ||
                u.codigo === currentSession.user.codigo,
            );
            if (freshUser?.isBlocked) {
              get().logout();
              toast.error("Acceso revocado", {
                description: "Tu usuario ha sido bloqueado en el sistema.",
                duration: 6000,
              });
            }
          }
        } catch (err) {
          console.error("Error al cargar datos en Zustand store:", err);
        }
      },

      loadSubmissions: async () => {
        set({ loadingSubmissions: true });
        try {
          const list = await adminRepository.getAllSubmissions();
          set({ submissions: list, loadingSubmissions: false });
        } catch (err) {
          console.error("Error al recargar mensajes:", err);
          set({ loadingSubmissions: false });
        }
      },

      loadMatches: async () => {
        set({ loadingMatches: true });
        try {
          const [matches, { teams, leagues }] = await Promise.all([
            adminRepository.getAllMatches(),
            adminRepository.getTeamsAndLeagues(),
          ]);
          set({ matches, teams, leagues, loadingMatches: false });
        } catch (err) {
          console.error("Error al recargar partidos:", err);
          set({ loadingMatches: false });
        }
      },

      markSubmissionAsRead: async (id: string) => {
        set((state) => ({
          submissions: state.submissions.map((sub) =>
            sub.id === id ? { ...sub, status: "read" } : sub,
          ),
        }));

        try {
          await adminRepository.markSubmissionAsRead(id);
        } catch (err) {
          console.warn("Error al sincronizar estado leído con Firestore:", err);
        }
      },

      deleteSubmission: async (id: string) => {
        try {
          await adminRepository.deleteSubmission(id);
          set((state) => ({
            submissions: state.submissions.filter((sub) => sub.id !== id),
          }));
          toast.success("Mensaje eliminado de la bandeja.");
        } catch (err) {
          console.error("Error al eliminar mensaje:", err);
          toast.error("No se pudo eliminar el mensaje.");
        }
      },

      toggleUserBlock: async (userId: string, isBlocked: boolean) => {
        try {
          await adminRepository.toggleUserBlock(userId, isBlocked);
          set((state) => ({
            users: state.users.map((u) =>
              u.id === userId ? { ...u, isBlocked } : u,
            ),
          }));
          toast.success(
            isBlocked ? "Usuario bloqueado" : "Usuario desbloqueado",
            {
              description: "El estado se sincronizó con Firestore.",
            },
          );
        } catch {
          toast.error("Error al actualizar usuario");
        }
      },

      createUser: async (newUser: Omit<AdminUser, "id">) => {
        try {
          const created = await adminRepository.createUser(newUser);
          set((state) => ({ users: [...state.users, created] }));
          toast.success("Usuario creado con éxito", {
            description: `Código ${created.codigo} asignado a ${created.nombres}.`,
          });
        } catch {
          toast.error("Error al crear usuario");
        }
      },

      updateUser: async (userId: string, data: Partial<Omit<AdminUser, "id">>) => {
        try {
          await adminRepository.updateUser(userId, data);
          set((state) => ({
            users: state.users.map((u) => (u.id === userId ? { ...u, ...data } : u)),
          }));
          toast.success("Usuario actualizado correctamente.");
        } catch {
          toast.error("Error al actualizar usuario.");
        }
      },

      deleteUser: async (userId: string) => {
        try {
          await adminRepository.deleteUser(userId);
          set((state) => ({
            users: state.users.filter((u) => u.id !== userId),
          }));
          toast.success("Usuario eliminado de Firestore.");
        } catch {
          toast.error("Error al eliminar usuario.");
        }
      },

      createRole: async (newRole: Role) => {
        try {
          const created = await adminRepository.createRole(newRole);
          set((state) => ({ roles: [...state.roles, created] }));
          toast.success("Rol creado con éxito.", {
            description: `Rol ${created.nombre} (${created.id}).`,
          });
        } catch {
          toast.error("Error al crear rol.");
        }
      },

      updateRole: async (roleId: string, data: Partial<Omit<Role, "id">>) => {
        try {
          await adminRepository.updateRole(roleId, data);
          set((state) => ({
            roles: state.roles.map((r) => (r.id === roleId ? { ...r, ...data } : r)),
          }));
          toast.success("Rol actualizado con éxito.");
        } catch {
          toast.error("Error al actualizar rol.");
        }
      },

      deleteRole: async (roleId: string) => {
        try {
          await adminRepository.deleteRole(roleId);
          set((state) => ({
            roles: state.roles.filter((r) => r.id !== roleId),
          }));
          toast.success("Rol eliminado con éxito.");
        } catch {
          toast.error("Error al eliminar rol.");
        }
      },

      createMatch: async (matchData) => {
        try {
          await adminRepository.createMatch(matchData);
          await get().loadMatches();
          toast.success("Partido creado con éxito.");
        } catch {
          toast.error("Error al crear partido.");
        }
      },

      updateMatch: async (matchId, matchData) => {
        try {
          await adminRepository.updateMatch(matchId, matchData);
          await get().loadMatches();
          toast.success("Partido actualizado con éxito.");
        } catch {
          toast.error("Error al actualizar partido.");
        }
      },

      deleteMatch: async (matchId) => {
        try {
          await adminRepository.deleteMatch(matchId);
          set((state) => ({
            matches: state.matches.filter((m) => m.id !== matchId),
          }));
          toast.success("Partido eliminado con éxito.");
        } catch {
          toast.error("Error al eliminar partido.");
        }
      },
    }),
    {
      name: "chicas_sc_admin_store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ session: state.session }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
