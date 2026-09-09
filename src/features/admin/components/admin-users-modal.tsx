"use client";

import { useState } from "react";
import {
  X,
  UserPlus,
  Shield,
  Key,
  Users,
  Lock,
  Unlock,
  Check,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserAvatar } from "./user-avatar";
import type { AdminUser, Role } from "../types";

interface AdminUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: AdminUser[];
  roles: Role[];
  onToggleBlock: (userId: string, isBlocked: boolean) => Promise<void>;
  onCreateUser: (newUser: Omit<AdminUser, "id">) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export function AdminUsersModal({
  isOpen,
  onClose,
  users,
  roles,
  onToggleBlock,
  onCreateUser,
  onRefresh,
}: AdminUsersModalProps) {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Formulario nuevo usuario
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [usuario, setUsuario] = useState("");
  const [codigo, setCodigo] = useState(`CSC-${Math.floor(1000 + Math.random() * 9000)}`);
  const [idRol, setIdRol] = useState(roles[0]?.id || "role-coordinator");
  const [urlAvatar, setUrlAvatar] = useState("");

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombres || !apellidos || !codigo) return;
    setIsSubmitting(true);
    try {
      await onCreateUser({
        nombres,
        apellidos,
        usuario: usuario || nombres.toLowerCase().replace(/\s+/g, ""),
        codigo: codigo.trim().toUpperCase(),
        idRol,
        urlAvatar,
        isBlocked: false,
      });
      // Limpiar formulario y volver a lista
      setNombres("");
      setApellidos("");
      setUsuario("");
      setCodigo(`CSC-${Math.floor(1000 + Math.random() * 9000)}`);
      setActiveTab("list");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fondo oscurecido con desenfoque */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-border">
        {/* Cabecera del modal */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <Users className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-base">
                Gestión de Miembros y Roles
              </h3>
              <p className="text-xs text-muted-foreground">
                Control de usuarios de Firebase, roles asignados y códigos de acceso
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Pestañas internas */}
        <div className="flex items-center justify-between border-b border-border px-6 pt-2 bg-muted/30">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("list")}
              className={`pb-2.5 text-sm font-medium border-b-2 transition-colors px-1 ${activeTab === "list"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              Lista de Usuarios ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`pb-2.5 text-sm font-medium border-b-2 transition-colors px-1 flex items-center gap-1.5 ${activeTab === "create"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              <UserPlus className="size-4" />
              <span>+ Nuevo Usuario / Código</span>
            </button>
          </div>

          {activeTab === "list" && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 pb-2"
            >
              <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Actualizar</span>
            </button>
          )}
        </div>

        {/* Contenido según pestaña */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          {activeTab === "list" ? (
            <div className="space-y-3">
              {users.map((user) => {
                const userRole = roles.find((r) => r.id === user.idRol);
                return (
                  <div
                    key={user.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-xl border border-border/80 hover:border-border transition-all bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        nombres={user.nombres}
                        apellidos={user.apellidos}
                        urlAvatar={user.urlAvatar}
                        size="lg"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">
                            {user.nombres} {user.apellidos}
                          </p>
                          {user.isBlocked ? (
                            <span className="inline-flex items-center rounded-md bg-destructive/10 px-2 py-0.5 text-[11px] font-medium text-destructive">
                              Bloqueado
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
                              Activo
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          @{user.usuario} • Rol:{" "}
                          <span className="font-medium text-foreground">
                            {userRole?.nombre || user.idRol || "Sin rol"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <div className="flex items-center gap-1 rounded-md bg-muted px-2.5 py-1 text-xs font-mono text-muted-foreground">
                        <Key className="size-3 text-secondary" />
                        <span>{user.codigo}</span>
                      </div>

                      <Button
                        variant={user.isBlocked ? "outline" : "destructive"}
                        size="xs"
                        onClick={() => onToggleBlock(user.id, !user.isBlocked)}
                        className="rounded-lg h-7"
                      >
                        {user.isBlocked ? (
                          <span className="flex items-center gap-1 text-emerald-600">
                            <Unlock className="size-3" />
                            <span>Desbloquear</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Lock className="size-3" />
                            <span>Bloquear</span>
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombres" className="text-xs">Nombres (*)</Label>
                  <Input
                    id="nombres"
                    value={nombres}
                    onChange={(e) => setNombres(e.target.value)}
                    placeholder="Ej. Valeria"
                    required
                    className="mt-1 h-9"
                  />
                </div>
                <div>
                  <Label htmlFor="apellidos" className="text-xs">Apellidos (*)</Label>
                  <Input
                    id="apellidos"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    placeholder="Ej. Salas"
                    required
                    className="mt-1 h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="usuario" className="text-xs">Nombre de usuario</Label>
                  <Input
                    id="usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    placeholder="Ej. valeriasalas"
                    className="mt-1 h-9"
                  />
                </div>
                <div>
                  <Label htmlFor="codigo" className="text-xs">Código de acceso (*)</Label>
                  <Input
                    id="codigo"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                    placeholder="Ej. CSC-8822"
                    required
                    className="mt-1 h-9 font-mono"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="idRol" className="text-xs">Rol de usuario (*)</Label>
                <select
                  id="idRol"
                  value={idRol}
                  onChange={(e) => setIdRol(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus:border-ring focus:outline-none"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nombre} ({r.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="urlAvatar" className="text-xs">URL del Avatar</Label>
                <Input
                  id="urlAvatar"
                  value={urlAvatar}
                  onChange={(e) => setUrlAvatar(e.target.value)}
                  placeholder="https://..."
                  className="mt-1 h-9 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("list")}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting || !nombres || !apellidos || !codigo}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  {isSubmitting ? "Creando…" : "Crear y Guardar Usuario"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
