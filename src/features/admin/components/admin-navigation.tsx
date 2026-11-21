"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ContactRound, Images, Inbox, LogOut, MessageSquareQuote, Shield, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { AdminSection } from "../store/use-admin-store";

interface NavigationProps {
  activeSection: AdminSection;
  onSelect: (section: AdminSection) => void;
  onLogout: () => void;
  name: string;
  role: string;
  counts: Partial<Record<AdminSection, number>>;
}

const sections = [
  { id: "albums", label: "Álbumes", icon: Images },
  { id: "members", label: "Integrantes", icon: ContactRound },
  { id: "testimonials", label: "Testimonios", icon: MessageSquareQuote },
  { id: "inbox", label: "Bandeja de entrada", icon: Inbox },
  { id: "users", label: "Usuarios", icon: Users },
  { id: "roles", label: "Roles", icon: Shield },
  { id: "matches", label: "Partidos", icon: Trophy },
] as const;

export function AdminMobileNavigation({ activeSection, onSelect, onLogout, name, role, counts }: NavigationProps) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => { if (media.matches) setOpen(false); };
    media.addEventListener("change", closeOnDesktop);
    return () => media.removeEventListener("change", closeOnDesktop);
  }, []);
  return <Sheet open={open} onOpenChange={setOpen}>
    <SheetTrigger asChild>
      <Button type="button" variant="ghost" size="icon" className="shrink-0 md:hidden" aria-label="Abrir menú de administración">
        <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
          <motion.path d="M4 6h16" animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }} style={{ transformOrigin: "center" }} />
          <motion.path d="M4 12h16" animate={{ opacity: open ? 0 : 1 }} />
          <motion.path d="M4 18h16" animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }} style={{ transformOrigin: "center" }} />
        </svg>
      </Button>
    </SheetTrigger>
    <SheetContent side="left" data-admin-ui className="w-[min(86vw,320px)] gap-0 overflow-y-auto pb-[env(safe-area-inset-bottom)] md:hidden motion-reduce:animate-none" aria-describedby="admin-mobile-menu-description">
      <SheetHeader className="border-b px-5 py-6 pr-14"><SheetTitle>Chicas SC Admin</SheetTitle><SheetDescription id="admin-mobile-menu-description">Navega por las secciones del panel.</SheetDescription></SheetHeader>
      <div className="border-b px-5 py-4"><p className="truncate text-sm font-semibold">{name}</p><p className="mt-1 text-xs text-muted-foreground">{role}</p></div>
      <nav aria-label="Administración" className="space-y-1 p-3">
        {sections.map(({ id, label, icon: Icon }, index) => <motion.div key={id} initial={reduceMotion ? false : { opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: reduceMotion ? 0 : index * 0.025 }}>
          <button type="button" aria-current={activeSection === id ? "page" : undefined} onClick={() => { setOpen(false); onSelect(id); }} className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-xl px-3 text-left text-sm ${activeSection === id ? "bg-primary/20 font-semibold text-secondary" : "text-muted-foreground hover:bg-muted"}`}>
            <span className="flex items-center gap-3"><Icon className="size-5 shrink-0" /><span>{label}</span></span>
            {counts[id] !== undefined && <span className="rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums">{counts[id]}</span>}
          </button>
        </motion.div>)}
      </nav>
      <div className="mt-auto border-t p-4"><Button type="button" variant="outline" className="w-full justify-start text-destructive" onClick={() => { setOpen(false); onLogout(); }}><LogOut />Cerrar sesión</Button></div>
    </SheetContent>
  </Sheet>;
}
