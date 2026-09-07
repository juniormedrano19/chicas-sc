# Verificación de la entrega

- `pnpm build`: correcto, incluida comprobación TypeScript.
- `pnpm lint`: correcto, sin advertencias.
- `pnpm test`: 4 pruebas correctas (normalización, consentimiento, honeypot, límites de entrada y contrato de resultados).
- HTTP local: landing e imágenes devuelven 200.
- API local: entrada inválida, ausencia de consentimiento y honeypot devuelven 422; cuerpo demasiado grande, 413; origen ajeno, 403; servicio desactivado, 503.

No se ejecutaron pruebas visuales ni interacciones automatizadas en navegador. La respuesta HTTP y la compilación no sustituyen la revisión visual. No se probó persistencia remota porque no hay credenciales de Supabase. La migración SQL y el límite transaccional requieren validación en ese proyecto antes de habilitar el contacto.

## Adaptación responsive

Distribución mobile-first con márgenes progresivos y títulos fluidos. Integrantes: una columna en móvil pequeño, dos desde 480 px y cuatro desde 1024 px. Partidos: una columna, dos desde 640 px y cuatro desde 1280 px. Testimonios y redes: una columna, dos desde 640 px y tres desde 1024 px. Navegación completa desde 1280 px; menú compacto antes. Diálogos con altura máxima basada en `dvh` y desplazamiento interno. Ajustados el texto superpuesto de la galería y las áreas táctiles.

Build/TypeScript y lint correctos para los ajustes. No se realizó inspección visual por dispositivo en esta revisión.
