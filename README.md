# SOFTBQ

Software web local para convertir archivos exportados desde el SIRE SUNAT en archivos Excel listos para importar en Contasis SQL.

## Stack aprobado

- React + Vite + TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Table
- React Hook Form + Zod
- date-fns
- Node.js + Fastify + TypeScript
- SQLite + Drizzle ORM
- ExcelJS
- bcryptjs

## Estructura

```txt
apps/
  web/      UI React
  server/   API local Fastify
packages/
  core/     tipos y utilidades compartidas
  sire/     parseo y validacion de archivos SIRE
  contasis/ campos y mapeos a Contasis
  excel/    lectura/escritura Excel
  db/       SQLite, schema, seed
  config/   configuracion compartida
storage/
  uploads/
  outputs/
  temp/
docs/
```

## Desarrollo

```bash
npm install
npm run dev
```

La primera version corre como web local. El empaquetado portable/instalable se definira despues del MVP.