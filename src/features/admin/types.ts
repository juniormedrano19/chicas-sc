export interface Role {
  id: string;
  nombre: string;
  descripcion?: string;
  createdAt?: string;
}

export interface AdminUser {
  id: string;
  idRol: string;
  codigo: string;
  urlAvatar: string;
  nombres: string;
  apellidos: string;
  usuario: string;
  isBlocked: boolean;
  createdAt?: string;
}

export interface AdminSession {
  user: AdminUser;
  role: Role | null;
}

export interface AdminContactSubmission {
  id: string;
  name: string;
  email: string;
  whatsapp: string | null;
  message: string;
  consent: boolean;
  status?: "new" | "read" | "replied" | "archived";
  createdAt?: string | { seconds: number; nanoseconds: number } | Date | null;
}

export interface AdminTeam {
  id: string;
  name: string;
  logoUrl: string;
}

export interface AdminLeague {
  id: string;
  name: string;
  logoUrl: string;
}

export type MatchStatus = "scheduled" | "live" | "finished" | "postponed" | "cancelled";

export interface AdminMatch {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  leagueId: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogoUrl: string;
  awayTeamLogoUrl: string;
  competition: string;
  kickoffAt: string | Date | { seconds: number; nanoseconds: number };
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
}

export interface SofascoreImportResult {
  created: number;
  updated: number;
  skipped: number;
}

export interface SofascoreImportPreviewItem {
  id: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  kickoffAt: Date;
  action: "create" | "update";
}

export interface SofascoreImportPreview {
  items: SofascoreImportPreviewItem[];
  created: number;
  updated: number;
  skipped: number;
}
