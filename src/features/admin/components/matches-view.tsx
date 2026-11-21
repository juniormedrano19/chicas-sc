"use client";

import { useState, useMemo, useRef } from "react";
import Image from "next/image";
import {
  Search,
  CalendarPlus,
  Edit2,
  Trash2,
  Clock,

  Radio,
  Upload,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  AdminMatch,
  AdminTeam,
  AdminLeague,
  MatchStatus,
  SofascoreImportPreview,
  SofascoreImportResult,
} from "../types";

interface MatchesViewProps {
  matches: AdminMatch[];
  teams: AdminTeam[];
  leagues: AdminLeague[];
  onCreateMatch: (matchData: {
    homeTeamId: string;
    awayTeamId: string;
    leagueId: string;
    kickoffAt: Date;
    homeScore: number | null;
    awayScore: number | null;
    status: MatchStatus;
  }) => Promise<void>;
  onUpdateMatch: (
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
  onDeleteMatch: (matchId: string) => Promise<void>;
  onPreviewSofascoreJson: (payload: unknown) => Promise<SofascoreImportPreview>;
  onImportSofascoreJson: (payload: unknown) => Promise<SofascoreImportResult>;
}

function formatMatchDateTime(
  kickoffAt: string | Date | { seconds: number; nanoseconds: number },
) {
  let date: Date;
  if (kickoffAt instanceof Date) {
    date = kickoffAt;
  } else if (typeof kickoffAt === "object" && "seconds" in kickoffAt) {
    date = new Date(kickoffAt.seconds * 1000);
  } else {
    date = new Date(kickoffAt);
  }

  return date.toLocaleString("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toDatetimeLocal(dateInput: string | Date | { seconds: number; nanoseconds: number }) {
  let d: Date;
  if (dateInput instanceof Date) d = dateInput;
  else if (typeof dateInput === "object" && "seconds" in dateInput) d = new Date(dateInput.seconds * 1000);
  else d = new Date(dateInput);

  const pad = (n: number) => String(n).padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function MatchesView({
  matches,
  teams,
  leagues,
  onCreateMatch,
  onUpdateMatch,
  onDeleteMatch,
  onPreviewSofascoreJson,
  onImportSofascoreJson,
}: MatchesViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importPreview, setImportPreview] = useState<SofascoreImportPreview | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  // Modales
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<AdminMatch | null>(null);
  const [matchToDelete, setMatchToDelete] = useState<AdminMatch | null>(null);

  // Formulario
  const [formData, setFormData] = useState<{
    homeTeamId: string;
    awayTeamId: string;
    leagueId: string;
    kickoffAt: string;
    homeScore: string;
    awayScore: string;
    status: MatchStatus;
  }>({
    homeTeamId: teams[0]?.id || "",
    awayTeamId: teams[1]?.id || "",
    leagueId: leagues[0]?.id || "",
    kickoffAt: toDatetimeLocal(new Date()),
    homeScore: "",
    awayScore: "",
    status: "scheduled",
  });

  const filteredMatches = useMemo(() => {
    if (!searchTerm.trim()) return matches;
    const q = searchTerm.toLowerCase();
    return matches.filter(
      (m) =>
        m.homeTeam.toLowerCase().includes(q) ||
        m.awayTeam.toLowerCase().includes(q) ||
        m.competition.toLowerCase().includes(q),
    );
  }, [matches, searchTerm]);

  const handleOpenCreate = () => {
    setFormData({
      homeTeamId: teams[0]?.id || "",
      awayTeamId: teams[1]?.id || teams[0]?.id || "",
      leagueId: leagues[0]?.id || "",
      kickoffAt: toDatetimeLocal(new Date()),
      homeScore: "",
      awayScore: "",
      status: "scheduled",
    });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (match: AdminMatch) => {
    setEditingMatch(match);
    setFormData({
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      leagueId: match.leagueId,
      kickoffAt: toDatetimeLocal(match.kickoffAt),
      homeScore: match.homeScore !== null ? String(match.homeScore) : "",
      awayScore: match.awayScore !== null ? String(match.awayScore) : "",
      status: match.status,
    });
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.homeTeamId || !formData.awayTeamId || !formData.leagueId) return;

    await onCreateMatch({
      homeTeamId: formData.homeTeamId,
      awayTeamId: formData.awayTeamId,
      leagueId: formData.leagueId,
      kickoffAt: new Date(formData.kickoffAt),
      homeScore: formData.homeScore !== "" ? parseInt(formData.homeScore, 10) : null,
      awayScore: formData.awayScore !== "" ? parseInt(formData.awayScore, 10) : null,
      status: formData.status,
    });
    setIsCreateOpen(false);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMatch) return;

    await onUpdateMatch(editingMatch.id, {
      homeTeamId: formData.homeTeamId,
      awayTeamId: formData.awayTeamId,
      leagueId: formData.leagueId,
      kickoffAt: new Date(formData.kickoffAt),
      homeScore: formData.homeScore !== "" ? parseInt(formData.homeScore, 10) : null,
      awayScore: formData.awayScore !== "" ? parseInt(formData.awayScore, 10) : null,
      status: formData.status,
    });
    setEditingMatch(null);
  };

  const handleConfirmDelete = async () => {
    if (!matchToDelete) return;
    await onDeleteMatch(matchToDelete.id);
    setMatchToDelete(null);
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset first so choosing the same file later still triggers onChange.
    event.target.value = "";
    if (!file) return;

    try {
      setImportText(await file.text());
      setImportPreview(null);
      setImportError(null);
      setIsImportOpen(true);
    } catch (error) {
      console.error("No se pudo importar el JSON de SofaScore:", error);
      setImportError("No pudimos leer el archivo seleccionado.");
    }
  };

  const handlePreviewImport = async () => {
    if (!importText.trim()) {
      setImportError("Pega el JSON de SofaScore o selecciona un archivo antes de analizar.");
      return;
    }

    setIsPreviewing(true);
    setImportError(null);
    try {
      const payload: unknown = JSON.parse(importText);
      setImportPreview(await onPreviewSofascoreJson(payload));
    } catch (error) {
      setImportPreview(null);
      setImportError(
        error instanceof SyntaxError
          ? "El contenido pegado no es un JSON válido."
          : error instanceof Error
            ? error.message
            : "No pudimos analizar este archivo.",
      );
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!importPreview) return;

    setIsImporting(true);
    try {
      await onImportSofascoreJson(JSON.parse(importText));
      setIsImportOpen(false);
      setImportText("");
      setImportPreview(null);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "No se pudo importar el JSON.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-white">
      {/* Barra de herramientas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-3.5 border-b border-[#f1f2f4] bg-white">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar partidos por equipo o liga…"
              className="w-full h-8 pl-8 pr-3 text-xs bg-[#f4f5f7] rounded-lg border-none focus:outline-none focus:ring-1 focus:ring-slate-300 text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-slate-500 font-medium mr-1">
            {filteredMatches.length} {filteredMatches.length === 1 ? "partido" : "partidos"}
          </span>



          <input
            ref={importInputRef}
            type="file"
            accept="application/json,text/plain,.json,.txt"
            className="sr-only"
            onChange={handleImportFile}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setImportError(null);
              setIsImportOpen(true);
            }}
            className="h-8 text-xs gap-1.5 rounded-lg"
          >
            <Upload className="size-3.5" />
            <span>Importar JSON</span>
          </Button>
          <Button
            onClick={handleOpenCreate}
            size="sm"
            className="h-8 bg-slate-900 hover:bg-slate-800 text-white text-xs gap-1.5 rounded-lg"
          >

            <span>Nuevo Partido</span>
          </Button>
        </div>
      </div>

      {/* Tabla de Partidos con Shadcn */}
      <div className="flex-1 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Competición</TableHead>
              <TableHead>Equipos (Local vs Visitante)</TableHead>
              <TableHead className="text-center">Marcador</TableHead>
              <TableHead>Fecha y Hora</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMatches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                  No se encontraron partidos registrados en Firestore.
                </TableCell>
              </TableRow>
            ) : (
              filteredMatches.map((match) => (
                <TableRow key={match.id} className="hover:bg-slate-50/70">
                  {/* Competición */}
                  <TableCell>
                    <div className="flex items-center gap-2">

                      <span className="font-semibold text-xs text-slate-900">{match.competition}</span>
                    </div>
                  </TableCell>

                  {/* Equipos */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* Local */}
                      <div className="flex items-center gap-1.5 min-w-[120px]">
                        {match.homeTeamLogoUrl && (
                          <div className="relative size-5 shrink-0">
                            <Image
                              src={match.homeTeamLogoUrl}
                              alt={match.homeTeam}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                        <span className="font-medium text-xs text-slate-800">{match.homeTeam}</span>
                      </div>

                      <span className="text-slate-400 font-bold text-[11px]">vs</span>

                      {/* Visitante */}
                      <div className="flex items-center gap-1.5 min-w-[120px]">
                        {match.awayTeamLogoUrl && (
                          <div className="relative size-5 shrink-0">
                            <Image
                              src={match.awayTeamLogoUrl}
                              alt={match.awayTeam}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                        <span className="font-medium text-xs text-slate-800">{match.awayTeam}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Marcador */}
                  <TableCell className="text-center">
                    {match.homeScore !== null && match.awayScore !== null ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md font-mono font-bold text-xs bg-[#f4f5f7] border border-slate-200 text-slate-900">
                        {match.homeScore} - {match.awayScore}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs italic">-</span>
                    )}
                  </TableCell>

                  {/* Fecha */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Clock className="size-3 text-slate-400" />
                      <span>{formatMatchDateTime(match.kickoffAt)}</span>
                    </div>
                  </TableCell>

                  {/* Estado */}
                  <TableCell>
                    {match.status === "live" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                        <Radio className="size-3 animate-pulse text-red-600" />
                        <span>En vivo</span>
                      </span>
                    ) : match.status === "finished" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span>Finalizado</span>
                      </span>
                    ) : match.status === "postponed" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <span>Pospuesto</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        <span>Programado</span>
                      </span>
                    )}
                  </TableCell>

                  {/* Acciones */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(match)}
                        className="h-7 px-2 text-slate-600 hover:bg-slate-100 text-xs"
                        title="Editar partido"
                      >
                        <Edit2 className="size-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMatchToDelete(match)}
                        className="h-7 px-2 text-red-600 hover:bg-red-50 text-xs"
                        title="Eliminar partido"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal: analizar antes de importar */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => !isImporting && setIsImportOpen(false)}
          />
          <div className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 bg-slate-50/60 px-6 py-4">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <FileText className="size-4 text-primary" />
                  Importar partidos desde SofaScore
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Pega el JSON o carga un archivo. Primero revisaremos qué se creará y qué se actualizará.
                </p>
              </div>
              <button
                type="button"
                onClick={() => !isImporting && setIsImportOpen(false)}
                className="text-lg leading-none text-slate-400 hover:text-slate-700"
                aria-label="Cerrar importación"
              >
                ×
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-6">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => importInputRef.current?.click()}
                  disabled={isPreviewing || isImporting}
                  className="text-xs"
                >
                  <Upload className="size-3.5" />
                  Elegir archivo JSON
                </Button>
                <span className="text-xs text-slate-500">También puedes pegar el contenido debajo.</span>
              </div>

              <textarea
                value={importText}
                onChange={(event) => {
                  setImportText(event.target.value);
                  setImportPreview(null);
                  setImportError(null);
                }}
                placeholder={'{\n  "events": [ ... ]\n}'}
                spellCheck={false}
                className="min-h-44 w-full resize-y rounded-lg border border-slate-200 bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-100 outline-none placeholder:text-slate-500 focus:border-primary focus:ring-1 focus:ring-primary"
                aria-label="JSON de SofaScore"
              />

              {importError && (
                <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {importError}
                </p>
              )}

              {importPreview && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Partidos</p>
                      <p className="text-lg font-semibold text-slate-900">{importPreview.items.length}</p>
                    </div>
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-emerald-700">Nuevos</p>
                      <p className="text-lg font-semibold text-emerald-800">{importPreview.created}</p>
                    </div>
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-amber-700">Actualizar</p>
                      <p className="text-lg font-semibold text-amber-800">{importPreview.updated}</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Omitidos</p>
                      <p className="text-lg font-semibold text-slate-900">{importPreview.skipped}</p>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-lg border border-slate-200">
                    <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      <span>Partido</span>
                      <span>Acción</span>
                    </div>
                    <ul className="max-h-56 divide-y divide-slate-100 overflow-y-auto">
                      {importPreview.items.map((match) => (
                        <li key={match.id} className="grid grid-cols-[1fr_auto] gap-3 px-3 py-2.5 text-xs">
                          <div className="min-w-0">
                            <p className="truncate font-medium text-slate-800">
                              {match.homeTeam} <span className="text-slate-400">vs</span> {match.awayTeam}
                            </p>
                            <p className="mt-0.5 truncate text-slate-500">
                              {match.competition} · {formatMatchDateTime(match.kickoffAt)} · ID {match.id}
                            </p>
                          </div>
                          <span
                            className={`h-fit rounded-full px-2 py-1 text-[10px] font-semibold ${
                              match.action === "update"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {match.action === "update" ? "Actualizar" : "Crear"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsImportOpen(false)}
                disabled={isImporting}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePreviewImport}
                disabled={isPreviewing || isImporting}
              >
                {isPreviewing ? "Analizando…" : "Analizar JSON"}
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleConfirmImport}
                disabled={!importPreview || isImporting || isPreviewing}
                className="bg-slate-900 text-white hover:bg-slate-800"
              >
                {isImporting ? "Importando…" : "Confirmar importación"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear Partido */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsCreateOpen(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <CalendarPlus className="size-4 text-primary" />
                <span>Crear Nuevo Partido</span>
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitCreate} className="p-6 space-y-4">
              <div className="space-y-1">
                <Label className="text-xs">Liga / Competición (*)</Label>
                <select
                  required
                  value={formData.leagueId}
                  onChange={(e) => setFormData({ ...formData, leagueId: e.target.value })}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300"
                >
                  {leagues.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Equipo Local (*)</Label>
                  <select
                    required
                    value={formData.homeTeamId}
                    onChange={(e) => setFormData({ ...formData, homeTeamId: e.target.value })}
                    className="w-full h-9 rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300"
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Equipo Visitante (*)</Label>
                  <select
                    required
                    value={formData.awayTeamId}
                    onChange={(e) => setFormData({ ...formData, awayTeamId: e.target.value })}
                    className="w-full h-9 rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300"
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Fecha y Hora (*)</Label>
                  <Input
                    required
                    type="datetime-local"
                    value={formData.kickoffAt}
                    onChange={(e) => setFormData({ ...formData, kickoffAt: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Estado (*)</Label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as MatchStatus })}
                    className="w-full h-9 rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300"
                  >
                    <option value="scheduled">Programado</option>
                    <option value="live">En Vivo</option>
                    <option value="finished">Finalizado</option>
                    <option value="postponed">Pospuesto</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Goles Local (Opcional)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.homeScore}
                    onChange={(e) => setFormData({ ...formData, homeScore: e.target.value })}
                    placeholder="-"
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Goles Visitante (Opcional)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.awayScore}
                    onChange={(e) => setFormData({ ...formData, awayScore: e.target.value })}
                    placeholder="-"
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateOpen(false)}
                  className="text-xs"
                >
                  Cancelar
                </Button>
                <Button type="submit" size="sm" className="bg-slate-900 hover:bg-slate-800 text-white text-xs">
                  Guardar Partido
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Partido */}
      {editingMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setEditingMatch(null)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <Edit2 className="size-4 text-primary" />
                <span>Editar Partido</span>
              </h3>
              <button
                onClick={() => setEditingMatch(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="p-6 space-y-4">
              <div className="space-y-1">
                <Label className="text-xs">Liga / Competición (*)</Label>
                <select
                  required
                  value={formData.leagueId}
                  onChange={(e) => setFormData({ ...formData, leagueId: e.target.value })}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300"
                >
                  {leagues.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Equipo Local (*)</Label>
                  <select
                    required
                    value={formData.homeTeamId}
                    onChange={(e) => setFormData({ ...formData, homeTeamId: e.target.value })}
                    className="w-full h-9 rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300"
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Equipo Visitante (*)</Label>
                  <select
                    required
                    value={formData.awayTeamId}
                    onChange={(e) => setFormData({ ...formData, awayTeamId: e.target.value })}
                    className="w-full h-9 rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300"
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Fecha y Hora (*)</Label>
                  <Input
                    required
                    type="datetime-local"
                    value={formData.kickoffAt}
                    onChange={(e) => setFormData({ ...formData, kickoffAt: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Estado (*)</Label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as MatchStatus })}
                    className="w-full h-9 rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300"
                  >
                    <option value="scheduled">Programado</option>
                    <option value="live">En Vivo</option>
                    <option value="finished">Finalizado</option>
                    <option value="postponed">Pospuesto</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Goles Local</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.homeScore}
                    onChange={(e) => setFormData({ ...formData, homeScore: e.target.value })}
                    placeholder="-"
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Goles Visitante</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.awayScore}
                    onChange={(e) => setFormData({ ...formData, awayScore: e.target.value })}
                    placeholder="-"
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingMatch(null)}
                  className="text-xs"
                >
                  Cancelar
                </Button>
                <Button type="submit" size="sm" className="bg-slate-900 hover:bg-slate-800 text-white text-xs">
                  Actualizar Partido
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación */}
      {matchToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setMatchToDelete(null)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 space-y-4">
            <h4 className="font-semibold text-slate-900 text-sm">¿Eliminar este partido?</h4>
            <p className="text-xs text-slate-600">
              Se eliminará permanentemente el encuentro entre{" "}
              <strong>
                {matchToDelete.homeTeam} vs {matchToDelete.awayTeam}
              </strong>{" "}
              de Firestore.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMatchToDelete(null)}
                className="text-xs"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmDelete}
                className="text-xs"
              >
                Sí, Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
