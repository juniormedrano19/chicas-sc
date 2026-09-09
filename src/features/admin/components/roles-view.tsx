"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ShieldPlus,
  Shield,
  Edit2,
  Trash2,
  Users as UsersIcon,

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
import type { Role, AdminUser } from "../types";

interface RolesViewProps {
  roles: Role[];
  users: AdminUser[];
  onCreateRole: (newRole: Role) => Promise<void>;
  onUpdateRole: (roleId: string, data: Partial<Omit<Role, "id">>) => Promise<void>;
  onDeleteRole: (roleId: string) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export function RolesView({
  roles,
  users,
  onCreateRole,
  onUpdateRole,
  onDeleteRole,
  onRefresh,
}: RolesViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modales
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  // Formulario
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    descripcion: "",
  });

  const filteredRoles = useMemo(() => {
    if (!searchTerm.trim()) return roles;
    const q = searchTerm.toLowerCase();
    return roles.filter(
      (r) =>
        r.nombre.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        (r.descripcion && r.descripcion.toLowerCase().includes(q)),
    );
  }, [roles, searchTerm]);

  const handleOpenCreate = () => {
    // Sugerir siguiente ID correlativo si los IDs son tipo 001, 002
    const numericIds = roles
      .map((r) => parseInt(r.id, 10))
      .filter((n) => !isNaN(n));
    const nextId =
      numericIds.length > 0
        ? String(Math.max(...numericIds) + 1).padStart(3, "0")
        : "001";

    setFormData({
      id: nextId,
      nombre: "",
      descripcion: "",
    });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      id: role.id,
      nombre: role.nombre,
      descripcion: role.descripcion || "",
    });
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id.trim() || !formData.nombre.trim()) return;

    await onCreateRole({
      id: formData.id.trim(),
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
    });
    setIsCreateOpen(false);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole) return;

    await onUpdateRole(editingRole.id, {
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
    });
    setEditingRole(null);
  };

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;
    await onDeleteRole(roleToDelete.id);
    setRoleToDelete(null);
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
              placeholder="Buscar roles por nombre o ID…"
              className="w-full h-8 pl-8 pr-3 text-xs bg-[#f4f5f7] rounded-lg border-none focus:outline-none focus:ring-1 focus:ring-slate-300 text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-slate-500 font-medium mr-1">
            {filteredRoles.length} {filteredRoles.length === 1 ? "rol" : "roles"}
          </span>



          <Button
            onClick={handleOpenCreate}
            size="sm"
            className="h-8 bg-slate-900 hover:bg-slate-800 text-white text-xs gap-1.5 rounded-lg"
          >

            <span>Nuevo Rol</span>
          </Button>
        </div>
      </div>

      {/* Tabla de Roles con Shadcn */}
      <div className="flex-1 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">ID</TableHead>
              <TableHead>Nombre del Rol</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Usuarios Asignados</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                  No se encontraron roles registrados.
                </TableCell>
              </TableRow>
            ) : (
              filteredRoles.map((role) => {
                const assignedCount = users.filter((u) => u.idRol === role.id).length;
                const isProtected = role.id === "001"; // Proteger rol Superadmin base de eliminación accidental

                return (
                  <TableRow key={role.id} className="hover:bg-slate-50/70">
                    {/* ID */}
                    <TableCell>
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {role.id}
                      </span>
                    </TableCell>

                    {/* Nombre */}
                    <TableCell>
                      <div className="flex items-center gap-2">

                        <span className="font-semibold text-slate-900 text-xs">{role.nombre}</span>
                      </div>
                    </TableCell>

                    {/* Descripción */}
                    <TableCell>
                      <span className="text-xs text-slate-600">
                        {role.descripcion || <em className="text-slate-400">Sin descripción</em>}
                      </span>
                    </TableCell>

                    {/* Usuarios Asignados */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <UsersIcon className="size-3.5 text-slate-400" />
                        <span>
                          {assignedCount} {assignedCount === 1 ? "usuario" : "usuarios"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Acciones */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(role)}
                          className="h-7 px-2 text-slate-600 hover:bg-slate-100 text-xs"
                          title="Editar rol"
                        >
                          <Edit2 className="size-3.5" />
                        </Button>

                        {!isProtected && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setRoleToDelete(role)}
                            className="h-7 px-2 text-red-600 hover:bg-red-50 text-xs"
                            title="Eliminar rol"
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

      {/* Modal Crear Rol */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsCreateOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <ShieldPlus className="size-4 text-primary" />
                <span>Crear Nuevo Rol</span>
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
                <Label className="text-xs">Identificador / Código del Rol (*)</Label>
                <Input
                  required
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="004"
                  className="h-9 font-mono text-xs font-semibold"
                />
                <p className="text-[10px] text-slate-400">
                  Recomendado usar IDs numéricos correlativos como 001, 002, 003, etc.
                </p>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Nombre del Rol (*)</Label>
                <Input
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej. Moderador de Contenido"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Descripción</Label>
                <Input
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Alcance y permisos de este rol..."
                  className="h-9 text-xs"
                />
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
                  Guardar Rol
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Rol */}
      {editingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setEditingRole(null)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <Edit2 className="size-4 text-primary" />
                <span>Editar Rol ({editingRole.id})</span>
              </h3>
              <button
                onClick={() => setEditingRole(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="p-6 space-y-4">
              <div className="space-y-1">
                <Label className="text-xs">Nombre del Rol (*)</Label>
                <Input
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Descripción</Label>
                <Input
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingRole(null)}
                  className="text-xs"
                >
                  Cancelar
                </Button>
                <Button type="submit" size="sm" className="bg-slate-900 hover:bg-slate-800 text-white text-xs">
                  Actualizar Rol
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación */}
      {roleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setRoleToDelete(null)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 space-y-4">
            <h4 className="font-semibold text-slate-900 text-sm">¿Eliminar este rol?</h4>
            <p className="text-xs text-slate-600">
              Se eliminará el rol <strong>{roleToDelete.nombre}</strong> ({roleToDelete.id}) de Firestore.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRoleToDelete(null)}
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
