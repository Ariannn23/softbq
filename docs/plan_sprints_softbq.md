# SOFTBQ - Plan de Sprints del MVP

## Decision de Orden

El desarrollo debe empezar por la base tecnica y backend minimo, no por pantallas completas aisladas.

Motivo:

- SOFTBQ depende de conversiones, validaciones, base de datos y archivos.
- Si se construyen muchas pantallas sin contratos claros, luego habra retrabajo al conectar SIRE, Contasis y SQLite.
- Si se construye todo el backend antes de ver UI, el sistema puede terminar poco ergonomico.

Orden recomendado:

1. Fundacion del proyecto.
2. Contratos de datos.
3. Base SQLite.
4. Login.
5. Clientes.
6. Conversion SIRE.
7. UI conectada por flujo.
8. Historial y panel.

En resumen:

- Primero backend/fundacion.
- Luego frontend funcional por modulo.
- Cada sprint debe terminar con algo ejecutable, probado y pequeño.

## Principios de Desarrollo

- No avanzar al siguiente sprint si el sprint actual no compila.
- Cada sprint debe pasar `npm run typecheck`.
- Cada sprint debe pasar `npm run build` cuando toque frontend/backend.
- La UI no debe contener logica de conversion SIRE a Contasis.
- El backend no debe mezclar controllers con logica de negocio.
- Los mapeos viven en `packages/sire` y `packages/contasis`.
- La escritura de Excel vive en `packages/excel`.
- SQLite se accede desde repositories o paquete `db`.
- Evitar features grandes en una sola entrega.

## Sprint 0 - Fundacion del Proyecto

### Objetivo

Dejar el monorepo listo para desarrollo continuo.

### Alcance

- Verificar estructura de carpetas.
- Verificar scripts base.
- Verificar TypeScript.
- Verificar build.
- Documentar decisiones.

### Tareas

- Revisar `apps/web`.
- Revisar `apps/server`.
- Revisar `packages/*`.
- Confirmar `storage/uploads`, `storage/outputs`, `storage/temp`.
- Confirmar `docs/mvp_softbq_requerimientos.md`.
- Confirmar remoto Git.
- Ejecutar `npm run typecheck`.
- Ejecutar `npm run build`.

### Entregable

- Repo base compilando.
- Documento MVP en `docs/`.
- Sin funcionalidad real todavia.

### Criterios de Cierre

- `npm install` completado.
- `npm run typecheck` pasa.
- `npm run build` pasa.
- Primer commit listo.

## Sprint 1 - Contratos, Tipos y Base SQLite

### Objetivo

Definir la base de datos y los tipos principales antes de construir pantallas.

### Alcance

- Configurar Drizzle + SQLite.
- Crear schema inicial.
- Crear seed inicial.
- Crear usuarios base.
- Crear settings base.

### Tareas Backend/DB

- Instalar dependencias definitivas de Drizzle y SQLite.
- Crear conexion SQLite.
- Crear tabla `users`.
- Crear tabla `clients`.
- Crear tabla `settings`.
- Crear tabla `conversions`.
- Crear tabla `conversion_files`.
- Crear tabla `conversion_observations`.
- Crear seed:
  - usuario `admin`.
  - usuario `armando`.
  - configuracion por defecto.
- Crear scripts:
  - `db:push`.
  - `db:seed`.

### Tareas Core

- Definir tipos:
  - `User`.
  - `Client`.
  - `Conversion`.
  - `ConversionStatus`.
  - `UserRole`.
  - `SireFileType`.

### Entregable

- SQLite local funcionando.
- Usuarios iniciales creados.
- Configuracion base creada.

### Criterios de Cierre

- Se crea `softbq.db`.
- Existen usuarios `admin` y `armando`.
- Existen settings base:
  - `PEN -> S`.
  - `USD -> D`.
  - `CON`.
  - `008`.
  - `18`.
- `npm run typecheck` pasa.

## Sprint 2 - Login Local

### Objetivo

Implementar acceso local con `admin` y `armando`.

### Alcance

- Backend de autenticacion.
- Pantalla de login.
- Sesion local.
- Proteccion de rutas.

### Tareas Backend

- Crear modulo `auth`.
- Implementar login.
- Validar usuario y contrasena.
- Usar hash con `bcryptjs`.
- Crear middleware de autenticacion.
- Crear endpoint:
  - `POST /api/auth/login`.
  - `POST /api/auth/logout`.
  - `GET /api/auth/me`.

### Tareas Frontend

- Crear `LoginPage`.
- Crear store o estado de sesion.
- Proteger pantallas internas.
- Agregar boton cerrar sesion.

### Entregable

- El usuario puede entrar con `admin` o `armando`.
- Sin login no se accede al panel.

### Criterios de Cierre

- Login correcto redirige al panel.
- Login incorrecto muestra error.
- Cerrar sesion vuelve al login.
- `npm run typecheck` pasa.
- `npm run build` pasa.

## Sprint 3 - Clientes

### Objetivo

Gestionar la base de clientes del estudio.

### Alcance

- CRUD basico de clientes.
- Inhabilitar clientes.
- Buscar clientes.
- Permisos segun usuario.

### Tareas Backend

- Crear modulo `clients`.
- Endpoints:
  - `GET /api/clients`.
  - `GET /api/clients/:id`.
  - `POST /api/clients`.
  - `PUT /api/clients/:id`.
  - `POST /api/clients/:id/disable`.
- Validar RUC.
- Evitar RUC duplicado.
- Permitir inhabilitar a `admin` y `armando`.
- No implementar eliminacion definitiva en MVP.

### Tareas Frontend

- Crear `ClientsPage`.
- Crear tabla con TanStack Table.
- Crear buscador.
- Crear `ClientForm`.
- Crear accion inhabilitar.

### Entregable

- `admin` y `armando` pueden crear, editar e inhabilitar clientes.

### Criterios de Cierre

- Crear cliente funciona.
- Editar cliente funciona.
- Inhabilitar cliente funciona.
- Cliente inactivo se identifica claramente.
- No se puede duplicar RUC.
- `npm run typecheck` pasa.
- `npm run build` pasa.

## Sprint 4 - Importacion de Clientes desde Excel

### Objetivo

Permitir cargar la base inicial de clientes desde Excel.

### Alcance

- Subir Excel.
- Leer columnas.
- Mapear columnas.
- Vista previa.
- Importar clientes.

### Tareas Backend

- Crear `importClientsJob`.
- Implementar lectura Excel con ExcelJS.
- Detectar hojas.
- Detectar columnas.
- Normalizar RUC y razon social.
- Crear clientes nuevos.
- Actualizar clientes existentes.
- Reportar omitidos.

### Tareas Frontend

- Crear `ImportClientsPage`.
- Subir archivo.
- Mostrar columnas detectadas.
- Permitir mapear:
  - RUC.
  - razon social.
  - nombre corto.
- Mostrar vista previa.
- Confirmar importacion.

### Entregable

- Base de clientes importable desde Excel.

### Criterios de Cierre

- Archivo Excel se carga.
- Se detectan columnas.
- Se importan clientes validos.
- Se reportan errores.
- `npm run typecheck` pasa.
- `npm run build` pasa.

## Sprint 5 - Parser SIRE Ventas

### Objetivo

Leer, detectar y validar archivos SIRE de ventas.

### Alcance

- TXT separado por `|`.
- CSV.
- Validacion de columnas.
- Conteo de registros.
- Resumen de totales.

### Tareas Package `sire`

- Implementar `parseSireTxt`.
- Implementar `parseSireCsv`.
- Implementar `detectSireFileType`.
- Implementar `validateSireSales`.
- Implementar `normalizeSales`.

### Validaciones

- Encabezado existe.
- Columnas obligatorias existen.
- Todas las filas tienen 40 columnas.
- RUC unico.
- Periodo unico.
- CAR SUNAT sin duplicados.
- Total CP cuadra con suma de importes.
- Fechas validas.

### Entregable

- Parser de ventas probado con:
  - archivo pequeno.
  - archivo grande de 2156 ventas.

### Criterios de Cierre

- Detecta ventas correctamente.
- Procesa 2156 registros sin perdida.
- Reporta totales.
- Reporta observaciones.
- `npm run typecheck` pasa.

## Sprint 6 - Parser SIRE Compras

### Objetivo

Leer, detectar y validar archivos SIRE de compras.

### Alcance

- TXT separado por `|`.
- CSV.
- Validacion de columnas.
- Conteo de registros.
- Resumen de totales.

### Tareas Package `sire`

- Implementar `validateSirePurchases`.
- Implementar `normalizePurchases`.
- Reusar parser TXT/CSV.

### Validaciones

- Encabezado existe.
- Columnas obligatorias existen.
- Todas las filas tienen cantidad esperada de columnas.
- RUC unico.
- Periodo unico.
- CAR SUNAT sin duplicados.
- Total CP cuadra con bases, IGV y otros importes.
- Fechas validas.

### Entregable

- Parser de compras probado con archivo SIRE de compras.

### Criterios de Cierre

- Detecta compras correctamente.
- Reporta totales.
- Reporta observaciones.
- `npm run typecheck` pasa.

## Sprint 7 - Mapeo Contasis Ventas

### Objetivo

Convertir ventas normalizadas a filas tecnicas de Contasis.

### Alcance

- Campos tecnicos ventas.
- Reglas simples.
- Cuentas contables vacias o configuracion base.

### Tareas Package `contasis`

- Definir `salesFields`.
- Implementar `mapSalesToContasis`.
- Implementar validacion de filas finales.

### Reglas

- `PEN -> S`.
- `USD -> D`.
- `ffechaven2` usa vencimiento o fecha de emision.
- Cuentas contables se dejan vacias en MVP.
- Mantener RUC, DNI, serie y numero como texto.

### Entregable

- Filas de ventas listas para Excel Contasis.

### Criterios de Cierre

- Mapeo coincide con formato Contasis.
- Fechas correctas.
- Numeros correctos.
- Textos preservan ceros.
- `npm run typecheck` pasa.

## Sprint 8 - Mapeo Contasis Compras

### Objetivo

Convertir compras normalizadas a filas tecnicas de Contasis.

### Alcance

- Campos tecnicos compras.
- Reglas simples.
- Cuentas contables vacias o configuracion base.

### Tareas Package `contasis`

- Definir `purchaseFields`.
- Implementar `mapPurchasesToContasis`.
- Implementar validacion de filas finales.

### Reglas

- `PEN -> S`.
- `USD -> D`.
- `ffechaven2` usa vencimiento o fecha de emision.
- `Clasif de Bss y Sss` usa valor SIRE o default.
- Detraccion queda como advertencia.
- Cuentas contables se dejan vacias en MVP.

### Entregable

- Filas de compras listas para Excel Contasis.

### Criterios de Cierre

- Mapeo coincide con formato Contasis.
- Fechas correctas.
- Numeros correctos.
- Textos preservan ceros.
- `npm run typecheck` pasa.

## Sprint 9 - Generacion Excel Contasis

### Objetivo

Generar archivos Excel finales para Contasis.

### Alcance

- Ventas.
- Compras.
- Formato de fila tecnica.
- Formatos de celda.

### Tareas Package `excel`

- Implementar `writeContasisSalesExcel`.
- Implementar `writeContasisPurchasesExcel`.
- Formatear fechas.
- Formatear importes.
- Formatear textos.
- Guardar en `storage/outputs`.

### Entregable

- Archivos:
  - `VENTAS_CONTASIS_[RUC]_[PERIODO].xlsx`.
  - `COMPRAS_CONTASIS_[RUC]_[PERIODO].xlsx`.

### Criterios de Cierre

- Excel abre correctamente.
- Fila 1 contiene campos tecnicos.
- Datos empiezan en fila 2.
- No se pierden ceros.
- Archivo grande se genera correctamente.
- `npm run typecheck` pasa.
- `npm run build` pasa.

## Sprint 10 - Nueva Conversion y Vista Previa

### Objetivo

Conectar UI y backend para cargar archivos y mostrar validacion.

### Alcance

- Pantalla nueva conversion.
- Endpoint validate.
- Vista previa.

### Tareas Backend

- Crear modulo `conversions`.
- Endpoint:
  - `POST /api/conversions/validate`.
- Guardar archivos en `storage/uploads`.
- Devolver resumen.
- Devolver errores y advertencias.

### Tareas Frontend

- Crear `NewConversionPage`.
- Selector de cliente.
- Selector de periodo.
- Upload ventas.
- Upload compras.
- Boton validar.
- Crear `ValidationPreviewPage`.

### Entregable

- Usuario carga archivos SIRE y ve resumen antes de generar.

### Criterios de Cierre

- Se puede cargar ventas.
- Se puede cargar compras.
- Se puede cargar ambos.
- Se muestra cantidad de registros.
- Se muestran totales.
- Se muestran observaciones.
- `npm run typecheck` pasa.
- `npm run build` pasa.

## Sprint 11 - Generar Conversion desde UI

### Objetivo

Generar y descargar archivos desde la aplicacion.

### Alcance

- Endpoint generate.
- Job de conversion.
- Resultado.
- Descargas.

### Tareas Backend

- Implementar `processConversionJob`.
- Endpoint:
  - `POST /api/conversions/generate`.
  - `GET /api/conversions/:id/download/:fileId`.
- Guardar conversion en DB.
- Guardar archivos generados.
- Guardar observaciones.

### Tareas Frontend

- Crear `ConversionResultPage`.
- Botones de descarga.
- Boton nueva conversion.
- Boton ir al panel.

### Entregable

- Flujo completo: cargar, validar, generar y descargar.

### Criterios de Cierre

- Ventas se descarga.
- Compras se descarga.
- Historial registra conversion.
- Archivos existen en `storage/outputs`.
- `npm run typecheck` pasa.
- `npm run build` pasa.

## Sprint 12 - Historial

### Objetivo

Consultar conversiones realizadas.

### Alcance

- Tabla de conversiones.
- Filtros.
- Descarga desde historial.

### Tareas Backend

- Endpoint:
  - `GET /api/conversions`.
  - `GET /api/conversions/:id`.
- Filtros por periodo, cliente y estado.

### Tareas Frontend

- Crear `HistoryPage`.
- Tabla con TanStack Table.
- Filtros.
- Acceso a descargas.

### Entregable

- Historial consultable.

### Criterios de Cierre

- Se listan conversiones.
- Se filtra por cliente.
- Se filtra por periodo.
- Se puede descargar archivo generado.
- `npm run typecheck` pasa.
- `npm run build` pasa.

## Sprint 13 - Panel Mensual

### Objetivo

Mostrar estado mensual de clientes.

### Alcance

- Dashboard.
- Estados por cliente y periodo.
- Cambio manual de estado.

### Tareas Backend

- Endpoint:
  - `GET /api/dashboard?period=YYYYMM`.
  - `PUT /api/clients/:id/period-status`.
- Calcular resumen:
  - activos.
  - pendientes.
  - generados.
  - revisados.
  - declarados.

### Tareas Frontend

- Crear `DashboardPage`.
- Crear tarjetas resumen.
- Crear tabla de clientes por periodo.
- Permitir cambiar estado.

### Entregable

- Vista de control mensual.

### Criterios de Cierre

- Se ve periodo actual.
- Se ven clientes activos.
- Se cambian estados.
- Clientes inactivos no aparecen como pendientes.
- `npm run typecheck` pasa.
- `npm run build` pasa.

## Sprint 14 - Configuracion

### Objetivo

Permitir editar parametros generales.

### Alcance

- Configuracion global.
- Solo admin.

### Tareas Backend

- Endpoint:
  - `GET /api/settings`.
  - `PUT /api/settings`.
- Proteger con rol `admin`.

### Tareas Frontend

- Crear `SettingsPage`.
- Formulario de configuracion.
- Bloquear acceso a `armando`.

### Entregable

- Admin puede editar parametros base.

### Criterios de Cierre

- `admin` accede.
- `armando` no accede.
- Cambios persisten en SQLite.
- `npm run typecheck` pasa.
- `npm run build` pasa.

## Sprint 15 - Pruebas Integrales del MVP

### Objetivo

Validar el MVP completo con datos reales.

### Casos de Prueba

1. Login con `admin`.
2. Login con `armando`.
3. Crear cliente.
4. Inhabilitar cliente.
5. Importar clientes desde Excel.
6. Validar ventas pequenas.
7. Validar compras pequenas.
8. Validar ventas grandes de 2156 registros.
9. Generar Excel ventas.
10. Generar Excel compras.
11. Descargar archivos.
12. Revisar historial.
13. Cambiar estado mensual.

### Entregable

- MVP listo para uso piloto.

### Criterios de Cierre

- No hay errores criticos.
- Build pasa.
- Typecheck pasa.
- Se documentan observaciones.
- Se define lista de mejoras post MVP.

## Sprint 16 - Pulido para Entrega Piloto

### Objetivo

Dejar SOFTBQ presentable para uso del contador.

### Alcance

- Mejoras visuales.
- Mensajes claros.
- Limpieza de errores.
- Documentacion corta de uso.

### Tareas

- Pulir UI.
- Revisar textos.
- Agregar estados de carga.
- Agregar mensajes de error entendibles.
- Crear guia rapida:
  - iniciar sesion.
  - cargar SIRE.
  - validar.
  - generar.
  - descargar.

### Entregable

- Version piloto.

### Criterios de Cierre

- Usuario puede seguir el flujo sin ayuda tecnica.
- Archivos generados son utilizables.
- Guia rapida creada.

## Orden Resumido

```text
0. Fundacion
1. DB + contratos
2. Login
3. Clientes
4. Importar clientes
5. Parser ventas
6. Parser compras
7. Mapeo ventas
8. Mapeo compras
9. Excel Contasis
10. Nueva conversion + vista previa
11. Generar + descargar
12. Historial
13. Panel mensual
14. Configuracion
15. Pruebas integrales
16. Pulido piloto
```

## Recomendacion Practica

No construir todas las pantallas primero.

La mejor ruta es:

1. Backend minimo y DB.
2. Login.
3. Clientes.
4. Conversion real.
5. UI completa alrededor del flujo.

Asi el sistema crece con datos reales y no con pantallas desconectadas.


## Mejoras Futuras (Pendientes de Análisis)

### Sprint Propuesto: Módulo de Edición de Conversiones
- **Objetivo**: Proveer una interfaz de hoja de cálculo en la web para editar los comprobantes SIRE parseados antes de generar el Excel.
- **Alcance**: 
  - Vista de Data Grid con virtualización para manejar miles de comprobantes.
  - Edición en línea de celdas clave.
  - Validación en vivo.
  - Generación de Excel a partir del estado modificado del cliente web.
