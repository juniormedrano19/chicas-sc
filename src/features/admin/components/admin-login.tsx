"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, KeyRound, LoaderCircle, Lock, ShieldCheck, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingBrand } from "@/components/loading-indicator";

interface AdminLoginProps {
  onLogin: (code: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function AdminLogin({ onLogin, loading, error }: AdminLoginProps) {
  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || loading) return;
    await onLogin(code.trim());
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-primary text-white flex flex-col justify-between select-none">
      {/* Luces y texturas de fondo ambientales */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 size-96 rounded-full bg-secondary/30 blur-[130px]" />
        <div className="absolute top-1/2 -right-32 size-[32rem] rounded-full bg-blue-400/20 blur-[150px]" />
        <div className="absolute -bottom-24 left-1/3 size-80 rounded-full bg-secondary/25 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.04] via-transparent to-black/30" />
      </div>

      {/* Barra superior de regreso a la web pública */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold   text-white transition-colors hover:text-white"
        >
          <span>← Volver al sitio web</span>
        </Link>

      </header>

      {/* Tarjeta central de inicio de sesión con logo grande */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-white/15 p-8 text-secondary backdrop-blur-2xl sm:p-10 bg-white">
            {/* Logo de Chicas SC en blanco grande */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-5 flex size-28 items-center justify-center">
                <LoadingBrand className="size-24 sm:size-28 bg-primary" />
              </div>
              <p className="text-xl font-semibold uppercase tracking-[0.04em]">
                Portal de Administración
              </p>

              <p className="mt-2 text-sm">
                Ingresa tu código de acceso para continuar al panel de configuración.
              </p>
            </div>

            {/* Formulario de código */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="access-code"
                  className="mb-2 block text-sm font-semibold   text-secondary"
                >
                  Código de acceso
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-secondary">
                    <KeyRound className="size-4" />
                  </div>
                  <Input
                    id="access-code"
                    type={showCode ? "text" : "password"}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Ej. CSC-2026"
                    autoFocus
                    autoComplete="off"
                    disabled={loading}
                    className="h-13 rounded-xl border bg-white pl-11 pr-11 text-base text-secondary  focus-visible:border-white focus-visible:ring-2 focus-visible:ring-secondary/50 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCode(!showCode)}
                    tabIndex={-1}
                    aria-label={showCode ? "Ocultar código" : "Mostrar código"}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-secondary hover:text-primary"
                  >
                    {showCode ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/40 bg-rose-500/15 p-3 text-xs text-rose-200">
                  <AlertCircle className="size-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !code.trim()}
                className="h-12 w-full rounded-xl bg-primary font-medium text-white shadow-lg transition-all hover:bg-secondary/90 disabled:opacity-50 text-base"
              >
                {loading ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <LoaderCircle className="size-5 animate-spin" />

                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <span>Acceder al panel</span>
                    <ArrowRight className="size-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* <div className="mt-6 border-t border-white/10 pt-4 text-center">
              <p className="text-sm text-secondary">
                Código por defecto:{" "}
                <button
                  type="button"
                  onClick={() => setCode("001JMM")}
                  className="font-mono text-secondary hover:underline cursor-pointer"
                >
                  001JMM
                </button>
              </p>
            </div> */}
          </div>
        </div>
      </main>

      {/* Pie de página sutil */}
      <footer className="relative z-10 py-6 text-center text-sm text-white">
        <p>© {new Date().getFullYear()} Chicas SC </p>
      </footer>
    </div>
  );
}
