# Chicas SC

Landing en español con Next.js 16.3.4 (última versión estable consultada en el registro de paquetes al crear el proyecto), React 19, TypeScript estricto y Tailwind CSS v4. Componentes oficiales shadcn/ui (Radix), Zustand, Zod, React Hook Form, Framer Motion, tw-animate-css, Sonner y date-fns.

## Desarrollo

Gestor de paquetes: **pnpm 8.12.1**, fijado en `packageManager`. Usa pnpm para instalar y ejecutar comandos; versiona `pnpm-lock.yaml`.

```sh
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

`pnpm test` ejecuta las pruebas de validación con el runner de Node. `pnpm lint` valida ESLint. `pnpm build` compila y verifica TypeScript. `pnpm start` sirve el build de producción. Node 22 recomendado. El servidor informa el puerto disponible.

## Secciones e interacciones

Navbar móvil con Sheet, hero, resultados, integrantes con «Ver más» y Dialog, testimonios, álbumes con tres tarjetas iniciales, «Ver más» y páginas individuales, redes, FAQ con Accordion, contacto y footer. Animación respeta reduced-motion. Navegación por anclas, etiquetas y errores accesibles, tipografía adaptable y tokens centralizados.

## Contenido pendiente

Los perfiles, testimonios y resultados están expresamente marcados como ejemplos. No son datos verificados de personas ni resultados oficiales. Sustituir en `src/features/landing/content.ts` y cargar partidos confirmados en Supabase. La galería usa una imagen histórica del club como referencia, no como foto del grupo. Obtener las fotografías autorizadas, los enlaces reales de las redes antes de publicar. No se han inventado cuentas sociales.

## Activar Supabase

1. Crear un proyecto Supabase y ejecutar `supabase/001_initial.sql` una vez.
2. Configurar `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` en el servidor. La clave privilegiada no se expone al navegador.
3. Insertar partidos confirmados en `matches` con `published=true`; solo se muestran los cuatro más recientes ya jugados.
4. Configurar `APP_ORIGIN` con el origen HTTPS final. Añadir protección contra abuso en el proveedor de despliegue (WAF/rate limiting por IP o Turnstile validado en servidor). El límite SQL por correo y el honeypot son protección básica, no sustituyen estos controles.
5. Confirmar responsable de datos, política de privacidad y plazo de conservación; luego activar `CONTACT_ENABLED=true`.

Sin credenciales se muestran resultados de ejemplo y el formulario avisa que aún no está habilitado. Con Supabase configurado, un fallo de lectura muestra un estado de error, nunca resultados de muestra como si fueran reales. El formulario solo confirma tras persistencia exitosa. Los mensajes se consultan en Supabase; no se envían correos automáticamente.

No se ha creado una cuenta ni ejecutado la migración en un servicio externo. La integración remota necesita las credenciales del propietario y una prueba real antes de producción.

## Arquitectura

- `src/app`: composición de rutas, metadatos y endpoint HTTP.
- `src/features/landing`: contenido y secciones de presentación.
- `src/features/albums`: catálogo tipado de álbumes y listado progresivo. Cada álbum tiene su página `/albumes/[slug]`, fotos, portada y metadatos. El catálogo actual contiene seis ejemplos; sustituirlos con fotos autorizadas en `content.ts`.
- `src/features/matches`: contrato de dominio, validación Zod y repositorio con adaptador Supabase.
- `src/features/contact`: esquema compartido y formulario; la API valida nuevamente en el servidor.
- `src/components/ui`: componentes de shadcn.
- `src/lib`: utilidades y cliente exclusivo de servidor.
- `src/stores`: estado global de interfaz; los datos remotos permanecen en el servidor y el formulario en RHF.
- `supabase`: migración versionada, RLS y función transaccional con límite por correo.

Las secciones se componen en la página; la presentación no conoce consultas SQL. El repositorio permite sustituir la fuente de resultados sin modificar la vista. No se utiliza Zustand como caché de datos remotos ni se guardan mensajes personales en localStorage.

## Tema Tailwind v4

`src/app/globals.css` importa `tailwindcss` y `tw-animate-css`. `@theme inline` enlaza variables semánticas y las fuentes de `next/font`; el body utiliza `font-sans`. Bai Jamjuree se carga con `next/font/google`, pesos 400–700, estilos normal e italic y `display: "swap"`; tanto `font-sans` como `font-display` apuntan a `--font-bai-jamjuree`. Se incluye `@custom-variant dark (&:is(.dark *));` como extensión, pero la experiencia entregada es de tema claro (sin selector oscuro). Paleta: #6ac5fd, #ffffff, #002E79, #000000 y #FEDB01.

## Imágenes

Copias locales de los fondos proporcionados, para evitar dependencia de hotlink:

- `public/images/history.jpg`: https://clubsportingcristal.pe/images/cabecera/CABECERA_HISTORIA.jpg
- `public/images/terrace.jpg`: https://clubsportingcristal.pe/images/FONDO_ULTIMO.jpg

El hero y la galería usan el primero; los resultados usan el segundo. No se modificaron las imágenes ni se añadieron fotos ficticias de integrantes.

## Despliegue

Este proyecto usa Next.js App Router con servidor (`/api/contact` y acceso server-only), no una exportación estática. Desplegar en Vercel o un entorno Node compatible con Next.js y configurar las variables. Para Cloudflare Workers hace falta adaptar y validar con OpenNext; no subir `.next` como una web estática. No se ha publicado ni conectado un dominio.

Consulta `docs/decisiones.md` para las recomendaciones de servicios y referencias.

El logo oficial proporcionado se conserva sin modificaciones en `public/images/chicas-sc-logo.png` y se reutiliza en navegación, footer, álbumes e icono del sitio.
# chicas-sc
