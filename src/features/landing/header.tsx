"use client";
import { ArrowRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUIStore } from "@/stores/ui-store";
import { Brand } from "@/components/brand/brand";
import { navLinks } from "./content";
export function Header() {
  const { menuOpen, setMenuOpen } = useUIStore();
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="wrap">
        <div className="flex items-center justify-between gap-3  py-4">
          <Brand />
          <nav
            aria-label="Navegación principal"
            className="hidden items-center gap-6 xl:flex  px-3 py-3  rounded-2xl text-white"
          >
            {navLinks.map((x) => (
              <a
                key={x.href}
                href={x.href}
                className="text-base font-medium hover:underline underline-offset-8"
              >
                {x.label}
              </a>
            ))}
          </nav>
          <Button
            asChild
            className="hidden rounded-full bg-white px-6 text-secondary hover:bg-secondary/90  hover:text-white sm:inline-flex border "
          >
            <a href="#contacto">
              Súmate a nosotras <ArrowRight className="size-4" />
            </a>
          </Button>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Abrir menú"
                className="size-11 shrink-0 xl:hidden hover:bg-primary"
              >
                <Menu className="text-white size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="overflow-y-auto"
              onCloseAutoFocus={(event) => event.preventDefault()}
            >
              <SheetTitle className="px-6 pt-8">Chicas SC</SheetTitle>
              <nav
                className="flex flex-col gap-2 p-6"
                aria-label="Navegación móvil"
              >
                {[...navLinks, { label: "Contacto", href: "#contacto" }].map(
                  (x) => (
                    <a
                      href={x.href}
                      className="flex min-h-11 items-center py-2 hover:text-primary"
                      key={x.href}
                      onClick={() => setMenuOpen(false)}
                    >
                      {x.label}
                    </a>
                  ),
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
