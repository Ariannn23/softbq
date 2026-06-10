import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  outfile: 'dist/main.js',
  external: [
    'bcryptjs',
    'better-sqlite3',
    'drizzle-orm',
    'exceljs',
    'fastify',
    '@fastify/cookie',
    '@fastify/cors',
    '@fastify/multipart',
    '@fastify/static',
    'zod'
  ]
});
