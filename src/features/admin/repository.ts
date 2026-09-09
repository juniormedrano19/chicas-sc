import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase/client";
import type {
  AdminUser,
  Role,
  AdminContactSubmission,
  AdminMatch,
  AdminTeam,
  AdminLeague,
  MatchStatus,
} from "./types";

export const DEFAULT_ROLES: Role[] = [
  {
    id: "001",
    nombre: "Superadministrador",
    descripcion: "Acceso total, configuración del sistema y administración de usuarios",
  },
  {
    id: "002",
    nombre: "Administrador",
    descripcion: "Gestión de contenidos, comunidad y configuraciones generales",
  },
  {
    id: "003",
    nombre: "Usuario",
    descripcion: "Miembro del equipo con acceso estándar",
  },
];

export const DEFAULT_ADMIN: Omit<AdminUser, "id"> = {
  idRol: "001",
  codigo: "001JMM",
  urlAvatar: "",
  nombres: "Junior",
  apellidos: "Medrano",
  usuario: "jmedrano2019",
  isBlocked: false,
};

export const adminRepository = {
  async ensureInitialSeed(): Promise<void> {
    try {
      // Verificar si existen roles
      const rolesSnap = await getDocs(collection(firestore, "roles"));
      if (rolesSnap.empty) {
        for (const role of DEFAULT_ROLES) {
          await setDoc(doc(firestore, "roles", role.id), {
            ...role,
            createdAt: new Date().toISOString(),
          });
        }
      }

      // Verificar si existe el usuario administrador principal
      const usersSnap = await getDocs(collection(firestore, "users"));
      if (usersSnap.empty) {
        const adminDocRef = doc(firestore, "users", "user-junior-medrano");
        await setDoc(adminDocRef, {
          ...DEFAULT_ADMIN,
          id: "user-junior-medrano",
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.warn("No se pudo autosembrar datos en Firestore (verificar reglas):", error);
    }
  },

  async authenticateWithCode(
    code: string,
  ): Promise<{ user: AdminUser; role: Role | null }> {
    const trimmedCode = code.trim();
    if (!trimmedCode) {
      throw new Error("Por favor ingresa tu código de acceso.");
    }

    try {
      const usersRef = collection(firestore, "users");
      const q = query(usersRef, where("codigo", "==", trimmedCode));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        const userData = userDoc.data() as Omit<AdminUser, "id">;
        const user: AdminUser = {
          id: userDoc.id,
          ...userData,
        };

        if (user.isBlocked) {
          throw new Error(
            "Acceso denegado: Tu usuario se encuentra bloqueado. Contacta al administrador.",
          );
        }

        let role: Role | null = null;
        if (user.idRol) {
          try {
            const roleDoc = await getDoc(doc(firestore, "roles", user.idRol));
            if (roleDoc.exists()) {
              role = { id: roleDoc.id, ...(roleDoc.data() as Omit<Role, "id">) };
            }
          } catch {
            role = DEFAULT_ROLES.find((r) => r.id === user.idRol) || null;
          }
        }

        return { user, role };
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("Acceso denegado")) {
        throw err;
      }
      console.warn("Consulta Firestore usuarios:", err);
    }

    // Respaldo de contingencia con el admin por defecto
    if (trimmedCode === DEFAULT_ADMIN.codigo) {
      const fallbackUser: AdminUser = {
        id: "user-junior-medrano",
        ...DEFAULT_ADMIN,
      };
      const fallbackRole = DEFAULT_ROLES[0];
      return { user: fallbackUser, role: fallbackRole };
    }

    throw new Error("El código de acceso ingresado no es válido.");
  },

  async getAllUsers(): Promise<AdminUser[]> {
    try {
      const snap = await getDocs(collection(firestore, "users"));
      if (snap.empty) {
        return [{ id: "user-junior-medrano", ...DEFAULT_ADMIN }];
      }
      return snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<AdminUser, "id">),
      }));
    } catch {
      return [{ id: "user-junior-medrano", ...DEFAULT_ADMIN }];
    }
  },

  async getAllRoles(): Promise<Role[]> {
    try {
      const snap = await getDocs(collection(firestore, "roles"));
      if (snap.empty) {
        return DEFAULT_ROLES;
      }
      return snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Role, "id">),
      }));
    } catch {
      return DEFAULT_ROLES;
    }
  },

  async toggleUserBlock(userId: string, isBlocked: boolean): Promise<void> {
    const userRef = doc(firestore, "users", userId);
    await updateDoc(userRef, { isBlocked });
  },

  async createUser(newUser: Omit<AdminUser, "id">): Promise<AdminUser> {
    const userRef = doc(collection(firestore, "users"));
    const newId = userRef.id;
    await setDoc(userRef, {
      ...newUser,
      id: newId,
      createdAt: new Date().toISOString(),
    });
    return { ...newUser, id: newId };
  },

  async getAllSubmissions(): Promise<AdminContactSubmission[]> {
    try {
      const snap = await getDocs(collection(firestore, "contactSubmissions"));
      if (snap.empty) return [];
      const list = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name || "Sin nombre",
          email: data.email || "",
          whatsapp: data.whatsapp || null,
          message: data.message || "",
          consent: data.consent ?? true,
          status: data.status || "new",
          createdAt: data.createdAt || null,
        } as AdminContactSubmission;
      });

      // Ordenar por fecha más reciente
      return list.sort((a, b) => {
        const getSeconds = (item: AdminContactSubmission) => {
          if (!item.createdAt) return 0;
          if (typeof item.createdAt === "object" && "seconds" in item.createdAt) {
            return item.createdAt.seconds;
          }
          if (typeof item.createdAt === "string") {
            return new Date(item.createdAt).getTime() / 1000;
          }
          return 0;
        };
        return getSeconds(b) - getSeconds(a);
      });
    } catch (err) {
      console.error("Error al cargar contactSubmissions:", err);
      return [];
    }
  },

  async markSubmissionAsRead(id: string): Promise<void> {
    try {
      const docRef = doc(firestore, "contactSubmissions", id);
      await updateDoc(docRef, { status: "read" });
    } catch (err) {
      console.warn("No se pudo actualizar estado en Firestore:", err);
    }
  },

  async deleteSubmission(submissionId: string): Promise<void> {
    const docRef = doc(firestore, "contactSubmissions", submissionId);
    await deleteDoc(docRef);
  },

  async updateUser(
    userId: string,
    data: Partial<Omit<AdminUser, "id">>,
  ): Promise<void> {
    const userRef = doc(firestore, "users", userId);
    await updateDoc(userRef, data);
  },

  async deleteUser(userId: string): Promise<void> {
    const userRef = doc(firestore, "users", userId);
    await deleteDoc(userRef);
  },

  async createRole(role: Role): Promise<Role> {
    const roleId = role.id.trim() || doc(collection(firestore, "roles")).id;
    const roleData: Role = {
      ...role,
      id: roleId,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(firestore, "roles", roleId), roleData);
    return roleData;
  },

  async updateRole(
    roleId: string,
    data: Partial<Omit<Role, "id">>,
  ): Promise<void> {
    const roleRef = doc(firestore, "roles", roleId);
    await updateDoc(roleRef, data);
  },

  async deleteRole(roleId: string): Promise<void> {
    const roleRef = doc(firestore, "roles", roleId);
    await deleteDoc(roleRef);
  },

  async getTeamsAndLeagues(): Promise<{
    teams: AdminTeam[];
    leagues: AdminLeague[];
  }> {
    try {
      const [teamsSnap, leaguesSnap] = await Promise.all([
        getDocs(collection(firestore, "teams")),
        getDocs(collection(firestore, "leagues")),
      ]);

      const teams = teamsSnap.docs.map((d) => ({
        id: d.id,
        name: d.data().name || "Equipo",
        logoUrl: d.data().logoUrl || "",
      }));

      const leagues = leaguesSnap.docs.map((d) => ({
        id: d.id,
        name: d.data().name || "Liga",
        logoUrl: d.data().logoUrl || "",
      }));

      return { teams, leagues };
    } catch (err) {
      console.error("Error al obtener equipos y ligas:", err);
      return { teams: [], leagues: [] };
    }
  },

  async getAllMatches(): Promise<AdminMatch[]> {
    try {
      const [matchesSnap, { teams, leagues }] = await Promise.all([
        getDocs(collection(firestore, "matches")),
        this.getTeamsAndLeagues(),
      ]);

      const teamsMap = new Map(teams.map((t) => [t.id, t]));
      const leaguesMap = new Map(leagues.map((l) => [l.id, l]));

      const matches = matchesSnap.docs.map((d) => {
        const data = d.data();
        const homeTeam = teamsMap.get(data.homeTeamId);
        const awayTeam = teamsMap.get(data.awayTeamId);
        const league = leaguesMap.get(data.leagueId);

        let kickoffAt = data.kickoffAt;
        if (kickoffAt instanceof Timestamp) {
          kickoffAt = kickoffAt.toDate();
        }

        return {
          id: d.id,
          homeTeamId: data.homeTeamId || "",
          awayTeamId: data.awayTeamId || "",
          leagueId: data.leagueId || "",
          homeTeam: homeTeam?.name || "Local",
          awayTeam: awayTeam?.name || "Visitante",
          homeTeamLogoUrl: homeTeam?.logoUrl || "",
          awayTeamLogoUrl: awayTeam?.logoUrl || "",
          competition: league?.name || "Liga",
          kickoffAt: kickoffAt || new Date(),
          homeScore: typeof data.homeScore === "number" ? data.homeScore : null,
          awayScore: typeof data.awayScore === "number" ? data.awayScore : null,
          status: (data.status as MatchStatus) || "scheduled",
        } as AdminMatch;
      });

      // Ordenar por fecha
      return matches.sort((a, b) => {
        const dateA = a.kickoffAt instanceof Date ? a.kickoffAt.getTime() : 0;
        const dateB = b.kickoffAt instanceof Date ? b.kickoffAt.getTime() : 0;
        return dateB - dateA;
      });
    } catch (err) {
      console.error("Error al cargar partidos:", err);
      return [];
    }
  },

  async createMatch(matchData: {
    homeTeamId: string;
    awayTeamId: string;
    leagueId: string;
    kickoffAt: Date;
    homeScore: number | null;
    awayScore: number | null;
    status: MatchStatus;
  }): Promise<string> {
    const matchRef = doc(collection(firestore, "matches"));
    const id = matchRef.id;
    await setDoc(matchRef, {
      ...matchData,
      id,
      kickoffAt: matchData.kickoffAt,
    });
    return id;
  },

  async updateMatch(
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
  ): Promise<void> {
    const matchRef = doc(firestore, "matches", matchId);
    await updateDoc(matchRef, matchData);
  },

  async deleteMatch(matchId: string): Promise<void> {
    const matchRef = doc(firestore, "matches", matchId);
    await deleteDoc(matchRef);
  },
};



