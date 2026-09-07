import { ArrowRight } from "lucide-react";
import { Brand } from "@/components/brand/brand";
export function Footer() {
  return (
    <footer className="bg-primary py-12 text-white">
      <div className="wrap">
        <div className="grid gap-10 border-b border-white/20 pb-12 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Brand />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/65">
              Celeste siempre sobre todas las cosas.
              <br />
              Una comunidad de chicas, una misma pasión.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-5 text-primary">Explora</p>
            <nav aria-label="Navegación del pie" className="grid gap-3 text-sm">
              {[
                ["Nosotras", "#nosotras"],
                ["Últimos partidos", "#partidos"],
                ["Nuestros recuerdos", "#recuerdos"],
              ].map(([n, h]) => (
                <a key={h} href={h} className="hover:underline">
                  {n}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <p className="eyebrow mb-5 text-primary">Sigamos conectadas</p>
            <nav aria-label="Comunidad" className="grid gap-3 text-sm">
              <a href="#redes">Nuestras redes</a>
              <a href="#faq">Preguntas frecuentes</a>
              <a href="#contacto" className="flex items-center gap-2">
                Escríbenos <ArrowRight className="size-4" />
              </a>
            </nav>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-4 pt-7 text-xs text-white/60">
          <p>
            © {new Date().getFullYear()} Chicas SC. Hecho con pasión celeste.
          </p>
          <p>Comunidad independiente · Sin afiliación oficial al club</p>
        </div>
      </div>
    </footer>
  );
}
