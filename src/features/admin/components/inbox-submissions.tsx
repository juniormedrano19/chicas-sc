"use client";

import { useState, useMemo } from "react";
import {
  Search,
  MessageCircle,
  Mail,
  Calendar,
  Phone,
  ExternalLink,
  CheckCircle2,
  CheckCheck,

  Clock,
  User,
  Inbox,
  Sparkles,
  ArrowUpRight,
  Filter,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import type { AdminContactSubmission } from "../types";

interface InboxSubmissionsProps {
  submissions: AdminContactSubmission[];
  loading: boolean;
  onRefresh: () => Promise<void>;
  onMarkAsRead?: (id: string) => Promise<void> | void;
  onDeleteSubmission?: (id: string) => Promise<void> | void;
  filterTab: "principal" | "otras" | "mas_tarde" | "borradas";
}

export function buildWhatsAppLink(rawPhone: string, name: string) {
  const digits = rawPhone.replace(/\D/g, "");
  // Si tiene 9 dígitos y empieza en 9 (número celular en Perú), agregamos código de país 51
  const phoneWithCountry =
    digits.length === 9 && digits.startsWith("9") ? `51${digits}` : digits;
  const message = encodeURIComponent(
    `¡Hola ${name}! Te escribimos desde el equipo de Chicas SC respecto a tu mensaje en la web.`,
  );
  return `https://wa.me/${phoneWithCountry}?text=${message}`;
}

export function formatSubmissionDate(
  createdAt?: string | { seconds: number; nanoseconds: number } | Date | null,
) {
  if (!createdAt) return "Reciente";
  try {
    let date: Date;
    if (typeof createdAt === "object" && "seconds" in createdAt) {
      date = new Date(createdAt.seconds * 1000);
    } else if (typeof createdAt === "string") {
      date = new Date(createdAt);
    } else {
      date = createdAt;
    }

    return date.toLocaleDateString("es-PE", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Reciente";
  }
}

export function InboxSubmissions({
  submissions,
  loading,
  onRefresh,
  onMarkAsRead,
  onDeleteSubmission,
  filterTab,
}: InboxSubmissionsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] =
    useState<AdminContactSubmission | null>(null);
  const [submissionToDelete, setSubmissionToDelete] =
    useState<AdminContactSubmission | null>(null);

  const handleOpenSubmission = (sub: AdminContactSubmission) => {
    setSelectedSubmission(sub);
    if (sub.status !== "read") {
      onMarkAsRead?.(sub.id);
      setSelectedSubmission({ ...sub, status: "read" });
    }
  };

  const handleConfirmDelete = async () => {
    if (!submissionToDelete || !onDeleteSubmission) return;
    await onDeleteSubmission(submissionToDelete.id);
    setSubmissionToDelete(null);
  };

  // Filtrado reactivo por término de búsqueda y pestañas
  const filteredSubmissions = useMemo(() => {
    if (filterTab === "borradas") return [];
    if (filterTab === "mas_tarde") return [];

    let list = submissions;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          (s.whatsapp && s.whatsapp.includes(q)) ||
          s.message.toLowerCase().includes(q),
      );
    }
    return list;
  }, [submissions, searchTerm, filterTab]);

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-white">
      {/* Barra de herramientas y búsqueda dentro de la bandeja */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-3 border-b border-[#f1f2f4] select-none bg-white">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, correo, celular o mensaje…"
              className="w-full h-8 pl-8 pr-3 text-xs bg-[#f4f5f7] rounded-lg border-none focus:outline-none focus:ring-1 focus:ring-slate-300 text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-slate-500 font-medium">
            {filteredSubmissions.length}{" "}
            {filteredSubmissions.length === 1 ? "mensaje" : "mensajes"}
          </span>


        </div>
      </div>

      {/* Lista ordenada de Mensajes de Contacto */}
      <div className="flex-1 overflow-y-auto">
        {filteredSubmissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center select-none">
            <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <Inbox className="size-6" />
            </div>
            <p className="font-semibold text-slate-700 text-sm">
              No hay mensajes en esta vista
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              {searchTerm
                ? "No se encontraron mensajes que coincidan con la búsqueda."
                : "Los nuevos mensajes del formulario de contacto aparecerán aquí."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredSubmissions.map((sub) => {
              const waLink = sub.whatsapp
                ? buildWhatsAppLink(sub.whatsapp, sub.name)
                : null;
              const dateStr = formatSubmissionDate(sub.createdAt);

              return (
                <article
                  key={sub.id}
                  onClick={() => handleOpenSubmission(sub)}
                  className={`group flex flex-col md:flex-row md:items-center justify-between gap-3 px-6 py-3.5 hover:bg-slate-50/90 transition-colors cursor-pointer ${selectedSubmission?.id === sub.id ? "bg-blue-50/50" : ""
                    } ${sub.status !== "read" ? "bg-slate-50/40" : ""}`}
                >
                  {/* Remitente y extracto del mensaje */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="size-8 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      {sub.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1 flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span
                          className={`text-xs group-hover:text-secondary transition-colors ${sub.status !== "read"
                            ? "font-bold text-slate-900"
                            : "font-semibold text-slate-700"
                            }`}
                        >
                          {sub.name}
                        </span>


                        {/* Indicador de status New vs Leído */}
                        {sub.status === "read" ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
                            <CheckCheck className="size-3 text-slate-400" />
                            <span>Leído</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80">

                            <span>Nuevo</span>
                          </span>
                        )}

                        <span className="text-[11px] text-slate-400"></span>

                      </div>
                      <a


                        className="text-[11px] text-slate-500 hover:text-primary transition-colors flex items-center gap-1"
                      >
                        <Mail className="size-3 text-slate-400" />
                        <span>{sub.email}</span>
                      </a>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-secondary. ">Mensaje:</span>
                        <p className=" text-xs text-slate-800 line-clamp-2 leading-relaxed">
                          {sub.message}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Acciones y enlace directo de WhatsApp */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center pl-11 md:pl-0">
                    {/* Botón WhatsApp activo */}
                    {waLink ? (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-whatsapp hover:brightness-95 text-white text-xs font-semibold shadow-2xs transition-all active:scale-95"
                        title={`Escribir por WhatsApp a ${sub.name}`}
                      >
                        <WhatsAppIcon className="size-3.5 shrink-0" />
                        <span>{sub.whatsapp}</span>

                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">
                        Sin WhatsApp
                      </span>
                    )}

                    <div className="flex items-center gap-1 text-[11px] text-slate-500 shrink-0 w-30 justify-end">
                      <Clock className="size-3" />
                      <span>{dateStr}</span>
                    </div>

                    {onDeleteSubmission && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSubmissionToDelete(sub);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Eliminar mensaje"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal / Detalle de Mensaje Seleccionado */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setSelectedSubmission(null)}
          />

          <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden select-none">
            {/* Cabecera del detalle */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  {selectedSubmission.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-900 text-sm">
                      {selectedSubmission.name}
                    </h4>
                    {selectedSubmission.status === "read" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                        <CheckCheck className="size-3 text-emerald-600" />
                        <span>Leído</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="size-1.5 rounded-full bg-amber-500" />
                        <span>New</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    ID: {selectedSubmission.id}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSubmission(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Contenido del mensaje */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-500 block mb-0.5">
                    Correo electrónico
                  </span>
                  <a
                    href={`mailto:${selectedSubmission.email}`}
                    className="font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    <Mail className="size-3" />
                    <span className="text-slate-800">{selectedSubmission.email}</span>
                  </a>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">
                    WhatsApp / Celular
                  </span>
                  {selectedSubmission.whatsapp ? (
                    <span className="font-medium text-slate-800 flex items-center gap-1.5">
                      <WhatsAppIcon className="size-3.5 text-whatsapp" />
                      <span>{selectedSubmission.whatsapp}</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">No registrado</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 tracking-[0.02em]  block mb-1.5">
                  Mensaje
                </label>
                <div className="p-4 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs leading-relaxed whitespace-pre-wrap">
                  {selectedSubmission.message}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>
                  Fecha de recepción:{" "}
                  {formatSubmissionDate(selectedSubmission.createdAt)}
                </span>
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="size-3" />
                  Consentimiento autorizado
                </span>
              </div>
            </div>

            {/* Botones de acción directa */}
            <div className="flex items-center justify-between gap-2 px-6 py-3 bg-slate-50 border-t border-slate-100">
              {onDeleteSubmission ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSubmissionToDelete(selectedSubmission);
                    setSelectedSubmission(null);
                  }}
                  className="text-xs text-red-600 hover:bg-red-50 gap-1.5"
                >
                  <Trash2 className="size-3.5" />
                  <span>Eliminar mensaje</span>
                </Button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSubmission(null)}
                  className="text-xs"
                >
                  Cerrar
                </Button>

                {selectedSubmission.whatsapp && (
                  <a
                    href={buildWhatsAppLink(
                      selectedSubmission.whatsapp,
                      selectedSubmission.name,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-whatsapp hover:brightness-95 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
                  >
                    <WhatsAppIcon className="size-4" />
                    <span>Abrir chat de WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación de Mensaje */}
      {submissionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setSubmissionToDelete(null)}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 space-y-4">
            <h4 className="font-semibold text-slate-900 text-sm">
              ¿Eliminar este mensaje?
            </h4>
            <p className="text-xs text-slate-600">
              Se eliminará el mensaje de{" "}
              <strong>{submissionToDelete.name}</strong> de Firestore. Esta acción
              no se puede deshacer.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSubmissionToDelete(null)}
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
