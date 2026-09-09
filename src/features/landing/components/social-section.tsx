import Script from "next/script";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

const TIKTOK_VIDEO_IDS = [
  "7682299821155388693",
  "7679909809755327765",
  "7676574849879248149",
] as const;

export function SocialSection() {
  return (
    <section id="redes" className="section">
      <div className="wrap">
        <ScrollReveal>
          <div className="mb-10 grid gap-6 text-center md:grid-cols-2 lg:text-left">
            <div>
              <p className="eyebrow mb-4">Somos la fuerza ganadora, siempre campeones...</p>
              <h2 className="section-title">Nos vemos en redes.</h2>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {TIKTOK_VIDEO_IDS.map((videoId, index) => (
              <div
                key={videoId}
                className="mx-auto w-full max-w-[360px] overflow-hidden rounded-xl bg-black"
              >
                <iframe
                  src={`https://www.tiktok.com/player/v1/${videoId}?autoplay=0&loop=0&music_info=0&description=0`}
                  title={`Video ${index + 1} de Chicas SC en TikTok`}
                  className="aspect-[9/16] w-full border-0"
                  loading="lazy"
                  allow="fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            ))}
          </div>

          <Script src="https://www.tiktok.com/embed.js" strategy="afterInteractive" />
        </ScrollReveal>
      </div>
    </section>
  );
}
