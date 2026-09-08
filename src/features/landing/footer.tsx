import { ArrowRight } from "lucide-react";
import { Brand } from "@/components/brand/brand";

function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path fill="currentColor" fillRule="evenodd" d="M0 12.067C0 18.034 4.333 22.994 10 24v-8.667H7V12h3V9.333c0-3 1.933-4.666 4.667-4.666c.866 0 1.8.133 2.666.266V8H15.8c-1.467 0-1.8.733-1.8 1.667V12h3.2l-.533 3.333H14V24c5.667-1.006 10-5.966 10-11.933C24 5.43 18.6 0 12 0S0 5.43 0 12.067" clipRule="evenodd" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 1024 1024" fill="none">
      <path fill="currentColor" d="M512 378.7c-73.4 0-133.3 59.9-133.3 133.3S438.6 645.3 512 645.3S645.3 585.4 645.3 512S585.4 378.7 512 378.7M911.8 512c0-55.2.5-109.9-2.6-165c-3.1-64-17.7-120.8-64.5-167.6c-46.9-46.9-103.6-61.4-167.6-64.5c-55.2-3.1-109.9-2.6-165-2.6c-55.2 0-109.9-.5-165 2.6c-64 3.1-120.8 17.7-167.6 64.5C132.6 226.3 118.1 283 115 347c-3.1 55.2-2.6 109.9-2.6 165s-.5 109.9 2.6 165c3.1 64 17.7 120.8 64.5 167.6c46.9 46.9 103.6 61.4 167.6 64.5c55.2 3.1 120.8 2.6 165 2.6c55.2 0 109.9.5 165-2.6c64-3.1 120.8-17.7 167.6-64.5c46.9-46.9 61.4-103.6 64.5-167.6c3.2-55.1 2.6-109.8 2.6-165M512 717.1c-113.5 0-205.1-91.6-205.1-205.1S398.5 306.9 512 306.9S717.1 398.5 717.1 512S625.5 717.1 512 717.1m213.5-370.7c-26.5 0-47.9-21.4-47.9-47.9s21.4-47.9 47.9-47.9s47.9 21.4 47.9 47.9a47.84 47.84 0 0 1-47.9 47.9" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path fill="currentColor" d="M19.321 5.562a5 5 0 0 1-.443-.258a6.2 6.2 0 0 1-1.137-.966c-.849-.971-1.166-1.956-1.282-2.645h.004c-.097-.573-.057-.943-.05-.943h-3.865v14.943q.002.3-.008.595l-.004.073q0 .016-.003.033v.009a3.28 3.28 0 0 1-1.65 2.604a3.2 3.2 0 0 1-1.6.422c-1.8 0-3.26-1.468-3.26-3.281s1.46-3.282 3.26-3.282c.341 0 .68.054 1.004.16l.005-3.936a7.18 7.18 0 0 0-5.532 1.62a7.6 7.6 0 0 0-1.655 2.04c-.163.281-.779 1.412-.853 3.246c-.047 1.04.266 2.12.415 2.565v.01c.093.262.457 1.158 1.049 1.913a7.9 7.9 0 0 0 1.674 1.58v-.01l.009.01c1.87 1.27 3.945 1.187 3.945 1.187c.359-.015 1.562 0 2.928-.647c1.515-.718 2.377-1.787 2.377-1.787a7.4 7.4 0 0 0 1.296-2.153c.35-.92.466-2.022.466-2.462V8.273c.047.028.672.441.672.441s.9.577 2.303.952c1.006.267 2.363.324 2.363.324V6.153c-.475.052-1.44-.098-2.429-.59" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-primary py-12 text-white">
      <div className="wrap">
        <div className="grid gap-10 border-b border-white/20 pb-12 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Brand />
            <p className="mt-6 max-w-xs text-base leading-relaxed text-white">
              Celeste siempre sobre todas las cosas.
              <br />
              Una comunidad de chicas, una misma pasión.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-5 text-primary">Explora</p>
            <nav aria-label="Navegación del pie" className="grid gap-3 text-base">
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
            <nav aria-label="Comunidad" className="grid gap-3 text-base">
              <a href="#redes">Nos vemos en redes</a>
              <a href="#faq">Preguntas frecuentes</a>
              <a href="#contacto" className="flex items-center gap-2">
                Escríbenos <ArrowRight className="size-4" />
              </a>
            </nav>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-4 pt-7 text-sm text-white">
          <p>
            © {new Date().getFullYear()} Chicas SC. Hecho con pasión celeste.
          </p>
          <nav aria-label="Redes sociales" className="flex items-center gap-3">
            <a href="https://www.facebook.com/profile.php?id=61591538154552" target="_blank" rel="noreferrer" aria-label="Facebook de Chicas SC" className="grid size-5 place-items-center  transition-colors hover:bg-white hover:text-primary"><FacebookIcon /></a>
            <a href="https://www.instagram.com/chicassc_oficial/" target="_blank" rel="noreferrer" aria-label="Instagram de Chicas SC" className="grid size-6 place-items-center   transition-colors hover:bg-white hover:text-primary"><InstagramIcon /></a>
            <a href="https://www.tiktok.com/@chicassc" target="_blank" rel="noreferrer" aria-label="TikTok de Chicas SC" className="grid size-5 place-items-center transition-colors hover:bg-white hover:text-primary"><TikTokIcon /></a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
