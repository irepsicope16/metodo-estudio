# Método Estudio

App de autoayuda para mejorar cómo estudiás: un autoperfil por 8 dimensiones,
una biblioteca de técnicas de estudio y un set de herramientas interactivas
(cronómetro, mapas conceptuales, fichas de repaso, diario de metacognición)
para probar qué te funciona a vos. Pensada para que la use directamente un
estudiante o una familia — sin cuentas, sin profesional de por medio, todo
guardado en el propio dispositivo.

Creada por la **Lic. Irene Morbidelli**, Psicopedagoga. Plataforma
independiente de Método Brújula.

> Esta app reemplaza la versión anterior de Método Estudio (pensada para que
> una profesional gestionara a varios estudiantes con un backend
> multi-profesional). Se abandonó ese enfoque el 10/10/2026 en favor de una
> mini app de autoservicio para comercializar directamente a quien la
> necesite. Ver `PROJECT_STATUS.md` para el detalle de la decisión.

## Desarrollo

```bash
npm install
npm run dev        # entorno local
npm run build      # build de producción (dist/)
npm run typecheck  # verificación de tipos
npm run deploy     # build + copia a ../metodo-estudio/
```

## Cómo funciona

No hay cuentas ni backend: todo se guarda en LocalStorage, en el dispositivo
de quien usa la app. La primera vez, pide solo un nombre para personalizar
los saludos — nada más.

- **Mi autoperfil** — 56 preguntas cortas en 8 áreas (organización, lectura,
  escritura, memoria, autorregulación…), con resultados orientativos y
  rutas sugeridas por dónde empezar.
- **Biblioteca** — una ficha por herramienta (qué es, para qué sirve, cómo
  aplicarla), organizada en 8 rutas con 3 niveles de complejidad.
- **Actividades** — catálogo de 26 actividades para probar; al completarlas
  se pueden calificar, armando un ranking propio de qué funciona mejor.
- **Herramientas** — cronómetro de estudio (Pomodoro o libre), mapas
  conceptuales interactivos, fichas de repaso propias, diario de
  metacognición.
- **Mi progreso** — racha de días, calendario de hábito, actividades
  completadas por ruta, técnicas mejor calificadas.

Ver [PROJECT_STATUS.md](./PROJECT_STATUS.md) para el detalle técnico y lo
que queda en el backlog.
