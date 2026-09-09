# Chicas SC

Landing page oficial de **Chicas SC**, comunidad de hinchas del Club Sporting Cristal. Construida con **Next.js 16.3.4 (App Router & Turbopack)**, **React 19**, **TypeScript estricto** y **Tailwind CSS v4**.

---

## Stack Tecnológico

- **Framework**: Next.js 16.3.4 (App Router, Turbopack, Server Actions / Route Handlers)
- **Lenguaje**: TypeScript (Strict Mode)
- **Estilos**: Tailwind CSS v4, `tw-animate-css`
- **Animaciones**: Framer Motion (con soporte accesible para `prefers-reduced-motion`)
- **Componentes UI**: Componentes accesibles basados en Radix UI / shadcn/ui
- **Base de Datos**: **Firebase Firestore**
- **Formularios & Validación**: React Hook Form, Zod, Sonner (Toasts)
- **Fechas**: `date-fns` (localización en español)
- **Iconografía**: `lucide-react`
- **Gestor de Paquetes**: `pnpm` (versión recomendada en `packageManager`: `pnpm@8.12.1` o superior)

---

## Desarrollo Local

1. **Instalar dependencias**:
   ```bash
   pnpm install
   ```

2. **Configurar variables de entorno**:
   ```bash
   cp .env.example .env.local
   ```
   Configura tus credenciales de Firebase en `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
   CONTACT_ENABLED=true
   APP_ORIGIN=http://localhost:3000
   ```

3. **Poblar datos iniciales de partidos en Firestore (Opcional)**:
   ```bash
   pnpm seed:firestore
   ```

4. **Iniciar servidor de desarrollo**:
   ```bash
   pnpm dev
   ```

5. **Pruebas y build**:
   ```bash
   pnpm test    # Ejecuta pruebas unitarias de validación con Node test runner
   pnpm lint    # Valida reglas de código con ESLint
   pnpm build   # Compila y verifica tipos TypeScript para producción
   pnpm start   # Sirve la versión compilada de producción
   ```

---

## Arquitectura del Proyecto

El proyecto sigue una arquitectura modular orientada a funcionalidades (**Feature-driven**):

```
src/
├── app/                      # Rutas Next.js App Router, layout, metadatos y endpoints
│   ├── albumes/[slug]/       # Páginas dinámicas de álbumes fotográficos
│   ├── api/contact/          # Endpoint API para recepción y guardado en Firestore
│   ├── layout.tsx            # Layout raíz, tipografía Bai Jamjuree, Toaster y PageLoader
│   └── page.tsx              # Página principal (Landing)
├── components/               # Componentes transversales
│   ├── brand/                # Logotipo y enlace a inicio
│   ├── hooks/                # Hooks globales (ej. usePageLoader)
│   ├── motion/               # Animaciones reutilizables (ScrollReveal, ParallaxLayer)
│   └── ui/                   # Componentes atómicos (Button, Dialog, Accordion, Sheet, etc.)
├── features/                 # Módulos de funcionalidad independientes
│   ├── albums/               # Álbumes, hooks de expansión y vistas
│   ├── contact/              # Formulario de contacto, hooks y esquema Zod
│   ├── landing/              # Secciones del landing y componentes atómicos
│   │   ├── components/       # AboutSection, MembersSection, TestimonialsSection, FAQSection, etc.
│   │   ├── hooks/            # useHeroSlider, useTestimonialsCarousel, useMembersExpand
│   │   ├── header.tsx        # Navegación responsive con Sheet móvil
│   │   ├── hero.tsx          # Hero slider cinemático (Crossfade Layered Stack)
│   │   └── footer.tsx        # Pie de página y enlaces a redes
│   └── matches/              # Carrusel de partidos, repositorio y conexión a Firestore
│       ├── components/       # MatchCard atómico
│       ├── hooks/            # useMatchesCarousel (scroll continuo y cálculo responsivo)
│       └── repository.ts     # Repositorio de partidos con fallback local
├── lib/                      # Clientes de servicios y utilidades
│   ├── firebase/client.ts    # Inicialización del cliente Firebase Firestore
│   └── utils.ts              # Utilidad cn (clsx + twMerge)
└── stores/                   # Estado global de UI ligero (Zustand)
```

---

## Firebase Firestore

El proyecto almacena y consulta sus datos en las siguientes colecciones:

- **`teams`**: Equipos de la liga (nombre, escudo).
- **`leagues`**: Torneos y competiciones.
- **`matches`**: Partidos jugados y programados (equipos, goles, fechas, estado).
- **`contactSubmissions`**: Mensajes enviados a través del formulario de contacto (con timestamp del servidor y estado `new`).

Consulta `docs/firebase-firestore-schema.md` para ver el detalle de los tipos y modelos de datos.

---

## Características Principales de UX/UI

- **Hero Slider Seamless**: Transición crossfade apilada (*layered dissolve*) sin parpadeos de fondo en móviles y con soporte para *prefers-reduced-motion*.
- **Carrusel de Partidos Continuo**: Desplazamiento horizontal nativo a 60/120 fps con scroll snap, controles táctiles y botones inteligentes de avance/retroceso.
- **Single Responsibility & Custom Hooks**: Toda la lógica de interacción está encapsulada en hooks reutilizables (`useHeroSlider`, `useMatchesCarousel`, `useTestimonialsCarousel`, `useContactForm`).
- **Navegación Fluida con Next.js `<Link>`**: Desplazamiento por anclas accesible tanto desde la página principal como desde las páginas de álbumes.
- **Favicons Optimizados**: Favicon SVG/PNG y Apple Touch Icon generados a partir del escudo oficial.
