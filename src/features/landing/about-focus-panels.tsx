"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const DESKTOP_QUERY = "(min-width: 768px)";

export type AboutFocusPanelItem = {
  id: string;
  label: string;
  description: string;
  image: string;

  accent: string;
};

const ABOUT_ITEMS: AboutFocusPanelItem[] = [
  {
    id: "pasion",
    label: "Pasión celeste",
    description: "Alentamos con el corazón en cada encuentro.",
    image: "/images/somos/foto1.jpeg",

    accent: "#002E79",
  },
  {
    id: "amistad",
    label: "Amistad",
    description: "La tribuna nos juntó y la amistad nos hizo familia.",
    image: "/images/somos/foto2.jpeg",

    accent: "#6ac5fd",
  },
  {
    id: "comunidad",
    label: "Comunidad",
    description: "Siempre hay un lugar para una chica celeste más.",
    image: "/images/somos/foto3.jpeg",

    accent: "#002E79",
  },
  {
    id: "recuerdos",
    label: "Recuerdos",
    description: "Cada partido deja una historia que queremos guardar.",
    image: "/images/somos/foto5.jpeg",

    accent: "#FEDB01",
  },
];

function useDesktopPanels() {
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

export function AboutFocusPanels() {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const isDesktop = useDesktopPanels();
  const reduceMotion = useReducedMotion();

  const panelTransition = reduceMotion
    ? { duration: 0.15 }
    : { type: "spring" as const, stiffness: 260, damping: 30, mass: 0.85 };

  return (
    <div
      role="list"
      aria-label="Valores de Chicas SC"
      className="flex min-h-[24rem] w-full snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:min-h-[32rem] md:snap-none md:gap-4 md:overflow-hidden md:px-0 [&::-webkit-scrollbar]:hidden"
      onMouseLeave={() => isDesktop && setActiveIndex(null)}
    >
      {ABOUT_ITEMS.map((item, index) => {
        const isActive = isDesktop && activeIndex === index;
        const flexGrow =
          activeIndex === null ? 1 : isActive ? 1.5 : 0.72;

        return (
          <motion.article
            key={item.id}
            role="listitem"
            className="relative min-w-[78vw] shrink-0 basis-[min(78vw,22rem)] snap-start overflow-hidden rounded-2xl md:min-w-0 md:shrink md:basis-0 md:rounded-[2rem]"
            style={{ backgroundColor: item.accent }}
            initial={false}
            animate={{ flexGrow: isDesktop ? flexGrow : 0 }}
            transition={isDesktop ? panelTransition : { duration: 0 }}
            onMouseEnter={() => isDesktop && setActiveIndex(index)}
          >
            <div

              className="group relative flex min-h-[24rem] w-full focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-white md:min-h-[32rem]"
              onFocus={() => isDesktop && setActiveIndex(index)}
            >
              <motion.div
                className="absolute inset-0"
                animate={{ scale: isActive ? 1.04 : 1 }}
                transition={panelTransition}
              >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(max-width: 767px) 78vw, (max-width: 1280px) 42vw, 720px"
                  className="object-cover object-center"
                />
              </motion.div>
              {/* <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-black/5"
              /> */}

            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
