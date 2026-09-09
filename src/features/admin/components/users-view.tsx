"use client";

import { useState, useMemo } from "react";
import {
  Search,
  UserPlus,
  Edit2,
  Trash2,
  Shield,
  Lock,
  Unlock,
  Key,
  Check,
  Copy,

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
import { UserAvatar } from "./user-avatar";
import type { AdminUser, Role } from "../types";

interface UsersViewProps {
  users: AdminUser[];
  roles: Role[];
  currentUserId?: string;
  onCreateUser: (newUser: Omit<AdminUser, "id">) => Promise<void>;
  onUpdateUser: (userId: string, data: Partial<Omit<AdminUser, "id">>) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  onToggleBlock: (userId: string, isBlocked: boolean) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export function UsersView({
  users,
  roles,
  currentUserId,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
  onToggleBlock,
  onRefresh,
}: UsersViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modales
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

  // Formulario Crear/Editar
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    usuario: "",
    codigo: "",
    idRol: roles[0]?.id || "003",
    urlAvatar: "",
  });

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const q = searchTerm.toLowerCase();
    return users.filter(
      (u) =>
        u.nombres.toLowerCase().includes(q) ||
        u.apellidos.toLowerCase().includes(q) ||
        u.usuario.toLowerCase().includes(q) ||
        u.codigo.toLowerCase().includes(q),
    );
  }, [users, searchTerm]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenCreate = () => {
    const randomCode = `CSC-${Math.floor(1000 + Math.random() * 9000)}`;
    setFormData({
      nombres: "",
      apellidos: "",
      usuario: "",
      codigo: randomCode,
      idRol: roles[0]?.id || "003",
      urlAvatar: "",
    });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      nombres: user.nombres,
      apellidos: user.apellidos,
      usuario: user.usuario,
      codigo: user.codigo,
      idRol: user.idRol,
      urlAvatar: user.urlAvatar || "",
    });
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombres.trim() || !formData.usuario.trim() || !formData.codigo.trim()) {
      return;
    }
    await onCreateUser({
      nombres: formData.nombres.trim(),
      apellidos: formData.apellidos.trim(),
      usuario: formData.usuario.trim(),
      codigo: formData.codigo.trim(),
      idRol: formData.idRol,
      urlAvatar: formData.urlAvatar.trim(),
      isBlocked: false,
    });
    setIsCreateOpen(false);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    await onUpdateUser(editingUser.id, {
      nombres: formData.nombres.trim(),
      apellidos: formData.apellidos.trim(),
      usuario: formData.usuario.trim(),
      codigo: formData.codigo.trim(),
      idRol: formData.idRol,
      urlAvatar: formData.urlAvatar.trim(),
    });
    setEditingUser(null);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    await onDeleteUser(userToDelete.id);
    setUserToDelete(null);
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
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
              placeholder="Buscar usuarios por nombre, usuario o código…"
              className="w-full h-8 pl-8 pr-3 text-xs bg-[#f4f5f7] rounded-lg border-none focus:outline-none focus:ring-1 focus:ring-slate-300 text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-slate-500 font-medium mr-1">
            {filteredUsers.length} {filteredUsers.length === 1 ? "usuario" : "usuarios"}
          </span>



          <Button
            onClick={handleOpenCreate}
            size="sm"
            className="h-8 bg-slate-900 hover:bg-slate-800 text-white text-xs gap-1.5 rounded-lg"
          >

            <span>Nuevo Usuario</span>
          </Button>
        </div>
      </div>

      {/* Tabla de Usuarios con Shadcn */}
      <div className="flex-1 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Código de Acceso</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                  No se encontraron usuarios registrados.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((u) => {
                const userRole = roles.find((r) => r.id === u.idRol);
                const isSelf = currentUserId === u.id;

                return (
                  <TableRow key={u.id} className="hover:bg-slate-50/70">
                    {/* Usuario & Avatar */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          nombres={u.nombres}
                          apellidos={u.apellidos}
                          urlAvatar={u.urlAvatar}
                          size="sm"
                          showOnlineDot={!u.isBlocked}
                        />
                        <div>
                          <div className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                            <span>
                              {u.nombres} {u.apellidos}
                            </span>
                            {isSelf && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-600 font-normal">
                                Tú
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400">@{u.usuario}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Código de Acceso */}
                    <TableCell>
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#f4f5f7] border border-slate-200/80 font-mono text-xs text-slate-800">
                        <Key className="size-3 text-slate-400" />
                        <span>{u.codigo}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(u.codigo)}
                          className="text-slate-400 hover:text-slate-700 ml-1"
                          title="Copiar código"
                        >
                          {copiedCode === u.codigo ? (
                            <Check className="size-3 text-emerald-600" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                        </button>
                      </div>
                    </TableCell>

                    {/* Rol */}
                    <TableCell>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60">

                        <span>{userRole?.nombre || `Rol ${u.idRol}`}</span>
                      </span>
                    </TableCell>

                    {/* Estado */}
                    <TableCell>
                      {u.isBlocked ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                          <Lock className="size-3" />
                          <span>Bloqueado</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Unlock className="size-3" />
                          <span>Activo</span>
                        </span>
                      )}
                    </TableCell>

                    {/* Acciones */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Bloquear / Desbloquear */}
                        {!isSelf && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onToggleBlock(u.id, !u.isBlocked)}
                            className={`h-7 px-2 text-xs ${u.isBlocked
                              ? "text-emerald-600 hover:bg-emerald-50"
                              : "text-amber-600 hover:bg-amber-50"
                              }`}
                            title={u.isBlocked ? "Desbloquear usuario" : "Bloquear usuario"}
                          >
                            {u.isBlocked ? <Unlock className="size-3.5" /> : <Lock className="size-3.5" />}
                          </Button>
                        )}

                        {/* Editar */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(u)}
                          className="h-7 px-2 text-slate-600 hover:bg-slate-100 text-xs"
                          title="Editar usuario"
                        >
                          <Edit2 className="size-3.5" />
                        </Button>

                        {/* Eliminar */}
                        {!isSelf && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setUserToDelete(u)}
                            className="h-7 px-2 text-red-600 hover:bg-red-50 text-xs"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal Crear Usuario */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsCreateOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <UserPlus className="size-4 text-primary" />
                <span>Crear Nuevo Usuario</span>
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Nombres (*)</Label>
                  <Input
                    required
                    value={formData.nombres}
                    onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                    placeholder="Ej. Ana"
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Apellidos</Label>
                  <Input
                    value={formData.apellidos}
                    onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                    placeholder="Ej. Torres"
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Usuario (*)</Label>
                <Input
                  required
                  value={formData.usuario}
                  onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                  placeholder="atorres"
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Código de Acceso (*)</Label>
                  <Input
                    required
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    placeholder="CSC-XXXX"
                    className="h-9 font-mono text-xs font-semibold uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Rol Asignado (*)</Label>
                  <select
                    value={formData.idRol}
                    onChange={(e) => setFormData({ ...formData, idRol: e.target.value })}
                    className="w-full h-9 rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nombre} ({r.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">URL del Avatar (Opcional)</Label>
                <Input
                  value={formData.urlAvatar}
                  onChange={(e) => setFormData({ ...formData, urlAvatar: e.target.value })}
                  placeholder="https://..."
                  className="h-9 text-xs"
                />
                <p className="text-[10px] text-slate-400">
                  Si se deja vacío, se generará un avatar con las 2 letras iniciales.
                </p>
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
                  Guardar Usuario
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Usuario */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setEditingUser(null)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <Edit2 className="size-4 text-primary" />
                <span>Editar Usuario</span>
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Nombres (*)</Label>
                  <Input
                    required
                    value={formData.nombres}
                    onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Apellidos</Label>
                  <Input
                    value={formData.apellidos}
                    onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Usuario (*)</Label>
                <Input
                  required
                  value={formData.usuario}
                  onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Código de Acceso (*)</Label>
                  <Input
                    required
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    className="h-9 font-mono text-xs font-semibold uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Rol Asignado (*)</Label>
                  <select
                    value={formData.idRol}
                    onChange={(e) => setFormData({ ...formData, idRol: e.target.value })}
                    className="w-full h-9 rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-300"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nombre} ({r.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">URL del Avatar</Label>
                <Input
                  value={formData.urlAvatar}
                  onChange={(e) => setFormData({ ...formData, urlAvatar: e.target.value })}
                  placeholder="https://..."
                  className="h-9 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingUser(null)}
                  className="text-xs"
                >
                  Cancelar
                </Button>
                <Button type="submit" size="sm" className="bg-slate-900 hover:bg-slate-800 text-white text-xs">
                  Actualizar Usuario
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setUserToDelete(null)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 space-y-4">
            <h4 className="font-semibold text-slate-900 text-sm">¿Eliminar este usuario?</h4>
            <p className="text-xs text-slate-600">
              Se eliminará permanentemente al usuario{" "}
              <strong>
                {userToDelete.nombres} {userToDelete.apellidos}
              </strong>{" "}
              (@{userToDelete.usuario}) de Firestore. Esta acción no se puede deshacer.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUserToDelete(null)}
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
