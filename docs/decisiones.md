# Decisiones de arquitectura y servicios

## Supabase frente a Firebase

Recomendación para Chicas SC: **Supabase**. Partidos, integrantes, encuentros y fotos pueden representarse con relaciones, restricciones SQL y migraciones. Postgres y las políticas RLS ofrecen una base adecuada para añadir administración más adelante. La implementación actual usa un repositorio de partidos y acceso privilegiado solo desde servidor.

Firebase/Firestore sería razonable si la prioridad fuese una aplicación móvil con sincronización offline y documentos en tiempo real. No es una mala opción, pero no aporta una ventaja decisiva para esta landing con entidades relacionadas.

Fuentes:

- https://supabase.com/docs/guides/database/overview
- https://firebase.google.com/docs/firestore

## Cloudinary frente a R2

Recomendación para la galería: **Cloudinary**. Sus transformaciones permiten recorte, formatos modernos y tamaños adecuados desde URLs. Es conveniente para un equipo que quiere subir imágenes y recibir versiones optimizadas sin mantener un pipeline. Implementar cargas firmadas desde un futuro panel autenticado; nunca exponer el API secret ni permitir cargas públicas sin control.

**R2** es almacenamiento de objetos compatible con S3 y sin cargos de salida de datos a Internet; aún existen cargos por almacenamiento y operaciones. Conviene para gran volumen de originales, pero las transformaciones requieren una solución adicional. No comparar únicamente gigabytes: medir transformaciones, operaciones, CDN y tráfico real.

Para reducir servicios al comenzar, Supabase Storage también puede ser suficiente. No se agregó una integración ficticia de Cloudinary: las imágenes entregadas son archivos locales y la elección final puede hacerse al disponer de la galería real.

Fuentes:

- https://cloudinary.com/documentation/image_transformations
- https://developers.cloudflare.com/r2/pricing/
- https://developers.cloudflare.com/r2/how-r2-works/

## Frontend

Se usa composición por funcionalidades y un contrato de repositorio para resultados, evitando capas abstractas sin función. Zod valida tanto entradas como filas remotas. RHF gestiona el formulario; Zustand gestiona solamente el menú compartido. Framer Motion anima secciones con preferencia de movimiento reducido. Los controles accesibles se basan en shadcn/Radix.

Referencias consultadas:

- https://tailwindcss.com/docs/theme (variables y `@theme inline`)
- https://tailwindcss.com/docs/dark-mode (`@custom-variant`)
- https://nextjs.org/blog

## Límites antes de producción

Credenciales, tablas, políticas y persistencia remota no se pueden verificar sin un proyecto del propietario. Ejecutar la migración, probar lectura pública, verificar que anon no pueda leer mensajes y enviar un mensaje de prueba desde el despliegue. Añadir límites por IP o CAPTCHA en el servidor antes de habilitar el endpoint público. Definir la política de privacidad y borrado. Revisar imágenes y testimonios autorizados y reemplazar todos los ejemplos.
