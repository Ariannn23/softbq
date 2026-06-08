# SOFTBQ - Documento Inicial del MVP

## 1. Objetivo del MVP

SOFTBQ sera un software web local para convertir archivos exportados desde el SIRE de SUNAT en archivos Excel listos para importar en Contasis SQL.

El MVP busca eliminar el copiado y pegado manual de compras y ventas, manteniendo la revision contable y el llenado de cuentas contables como tareas manuales del estudio.

## 2. Problema a Resolver

Actualmente el flujo mensual implica:

1. Ingresar al SIRE de SUNAT.
2. Obtener propuestas de ventas y compras.
3. Copiar informacion hacia archivos Excel del estudio.
4. Reordenar columnas para los formatos de Contasis.
5. Generar archivos de compras y ventas para importar en Contasis SQL.

Este proceso consume tiempo y puede generar errores por:

- Copiado parcial.
- Pegado en columnas incorrectas.
- Perdida de ceros iniciales en RUC, DNI, serie o numero.
- Errores de formato de fechas.
- Errores de separador decimal.
- Dificultad con clientes que tienen cientos o miles de comprobantes.

## 3. Conclusion Sobre Paginacion del SIRE

La paginacion visual del SIRE no representa un problema para el MVP.

Aunque la pantalla del SIRE muestre registros paginados, por ejemplo de 100 en 100, la descarga TXT/CSV contiene todos los comprobantes del periodo exportado.

Ejemplo revisado:

- Archivo: `LE206123167502026060014040001EXP2.txt`
- Periodo: `202605`
- Registros esperados: `2156`
- Registros encontrados: `2156`
- Filas truncadas: `0`
- CAR SUNAT duplicados: `0`
- Diferencias de totales: `0`

Por lo tanto, SOFTBQ trabajara con los archivos descargados desde SIRE, no con la tabla visible en pantalla.

## 4. Alcance del MVP

El MVP debe permitir:

1. Registrar empresas/clientes.
2. Cargar archivos SIRE de ventas.
3. Cargar archivos SIRE de compras.
4. Validar estructura y datos principales.
5. Convertir los archivos al formato tecnico requerido por Contasis SQL.
6. Descargar archivos Excel generados.
7. Guardar historial basico de conversiones.

El MVP no debe:

- Conectarse automaticamente a SUNAT.
- Usar claves SOL.
- Automatizar cuentas contables.
- Decidir criterios tributarios.
- Reemplazar la revision del contador.
- Subir informacion a internet o a servidores externos.

## 5. Tipo de Software

SOFTBQ sera una aplicacion web local o interna.

Esto significa:

- Se usara desde un navegador.
- Correra en la PC o red interna del estudio.
- No sera una pagina publica.
- Los archivos tributarios permaneceran bajo control del estudio contable.

## 6. Usuarios del Sistema

### Usuario Operativo

Persona encargada de procesar archivos mensuales de clientes.

Puede:

- Seleccionar empresa.
- Cargar archivos SIRE.
- Revisar validaciones.
- Generar archivos Contasis.
- Descargar resultados.

### Administrador

Persona encargada de configurar empresas y parametros base.

Puede:

- Crear empresas.
- Editar datos de empresas.
- Configurar valores por defecto.
- Revisar historial.

## 7. Flujo Principal del MVP

1. El usuario abre SOFTBQ.
2. Ingresa a "Nueva conversion".
3. Selecciona una empresa.
4. Selecciona el periodo contable.
5. Carga archivo SIRE de ventas en TXT o CSV.
6. Carga archivo SIRE de compras en TXT o CSV.
7. Presiona "Validar".
8. SOFTBQ detecta tipo de archivo y columnas.
9. SOFTBQ muestra resumen:
   - Empresa detectada.
   - Periodo.
   - Cantidad de registros.
   - Total base imponible.
   - Total IGV.
   - Total comprobantes.
   - Observaciones.
10. El usuario revisa y confirma.
11. SOFTBQ genera:
   - Archivo de ventas para Contasis.
   - Archivo de compras para Contasis.
12. El usuario descarga los archivos.
13. El usuario completa manualmente cuentas contables si corresponde.
14. El usuario importa los archivos en Contasis SQL.

## 8. Gestion de Empresas

Cada empresa debe tener como minimo:

- RUC.
- Razon social.
- Nombre corto.
- Codigo de entidad Contasis.
- Descripcion de entidad Contasis.
- Condicion por defecto.
- Medio de pago por defecto.
- Porcentaje IGV por defecto.

Valores sugeridos iniciales:

- Codigo entidad Contasis: `01`
- Descripcion entidad: `MI ORGANIZACIÓN`
- Condicion: `CON`
- Medio de pago: `008`
- IGV: `18`

## 9. Archivos de Entrada

SOFTBQ debe aceptar:

- TXT SIRE ventas.
- CSV SIRE ventas.
- TXT SIRE compras.
- CSV SIRE compras.

Preferencia operativa:

- Usar TXT separado por `|`.

Motivo:

- Es mas estable que CSV cuando existen comas en razones sociales o nombres.

## 10. Archivo SIRE Ventas

Columnas principales usadas:

- `Ruc`
- `Razon Social`
- `Periodo`
- `CAR SUNAT`
- `Fecha de emisión`
- `Fecha Vcto/Pago`
- `Tipo CP/Doc.`
- `Serie del CDP`
- `Nro CP o Doc. Nro Inicial (Rango)`
- `Tipo Doc Identidad`
- `Nro Doc Identidad`
- `Apellidos Nombres/ Razón Social`
- `Valor Facturado Exportación`
- `BI Gravada`
- `IGV / IPM`
- `Mto Exonerado`
- `Mto Inafecto`
- `ISC`
- `ICBPER`
- `Otros Tributos`
- `Total CP`
- `Moneda`
- `Tipo Cambio`
- `Fecha Emisión Doc Modificado`
- `Tipo CP Modificado`
- `Serie CP Modificado`
- `Nro CP Modificado`
- `Est. Comp`
- `Valor OP Gratuitas`

## 11. Archivo SIRE Compras

Columnas principales usadas:

- `RUC`
- `Apellidos y Nombres o Razón social`
- `Periodo`
- `CAR SUNAT`
- `Fecha de emisión`
- `Fecha Vcto/Pago`
- `Tipo CP/Doc.`
- `Serie del CDP`
- `Año`
- `Nro CP o Doc. Nro Inicial (Rango)`
- `Tipo Doc Identidad`
- `Nro Doc Identidad`
- `Apellidos Nombres/ Razón  Social`
- `BI Gravado DG`
- `IGV / IPM DG`
- `BI Gravado DGNG`
- `IGV / IPM DGNG`
- `BI Gravado DNG`
- `IGV / IPM DNG`
- `Valor Adq. NG`
- `ISC`
- `ICBPER`
- `Otros Trib/ Cargos`
- `Total CP`
- `Moneda`
- `Tipo de Cambio`
- `Fecha Emisión Doc Modificado`
- `Tipo CP Modificado`
- `Serie CP Modificado`
- `COD. DAM O DSI`
- `Nro CP Modificado`
- `Clasif de Bss y Sss`
- `Detracción`
- `Est. Comp.`

## 12. Salidas del Sistema

SOFTBQ debe generar archivos Excel con estructura final de Contasis:

- Fila 1: campos tecnicos de Contasis.
- Fila 2 en adelante: registros.

Archivos generados:

- `VENTAS_CONTASIS_[RUC]_[PERIODO].xlsx`
- `COMPRAS_CONTASIS_[RUC]_[PERIODO].xlsx`

Ejemplo:

- `VENTAS_CONTASIS_20612316750_202605.xlsx`
- `COMPRAS_CONTASIS_20612316750_202605.xlsx`

## 13. Conversion de Ventas

Mapeo principal:

| SIRE | Contasis |
|---|---|
| Fecha de emisión | ffechadoc |
| Fecha Vcto/Pago | ffechaven |
| Tipo CP/Doc. | ccoddoc |
| Serie del CDP | cserie |
| Nro CP o Doc. Nro Inicial (Rango) | cnumero |
| Tipo Doc Identidad | ctipdoc |
| Nro Doc Identidad | ccodruc |
| Apellidos Nombres/ Razón Social | crazsoc |
| Valor Facturado Exportación | nbase2 |
| BI Gravada | nbase1 |
| Mto Exonerado | nexo |
| Mto Inafecto | nina |
| ISC | nisc |
| IGV / IPM | nigv1 |
| ICBPER | nicbpers |
| Otros Tributos | nbase3 |
| Total CP | ntots |
| Tipo Cambio | ntc |
| Fecha Emisión Doc Modificado | freffec |
| Tipo CP Modificado | crefdoc |
| Serie CP Modificado | crefser |
| Nro CP Modificado | crefnum |

Reglas:

- `Moneda = PEN` se convierte a `cmreg = S`.
- `Moneda = USD` se convierte a `cmreg = D`.
- Si no existe fecha de vencimiento, `ffechaven2` puede tomar la fecha de emision.
- Las cuentas contables se dejan vacias o se llenan manualmente.

## 14. Conversion de Compras

Mapeo principal:

| SIRE | Contasis |
|---|---|
| Fecha de emisión | ffechadoc |
| Fecha Vcto/Pago | ffechaven |
| Tipo CP/Doc. | ccoddoc |
| COD. DAM O DSI | ccoddas |
| Año | cyeardas |
| Serie del CDP | cserie |
| Nro CP o Doc. Nro Inicial (Rango) | cnumero |
| Tipo Doc Identidad | ctipdoc |
| Nro Doc Identidad | ccodruc |
| Apellidos Nombres/ Razón Social | crazsoc |
| Clasif de Bss y Sss | ccodclas |
| BI Gravado DG | nbase1 |
| IGV / IPM DG | nigv1 |
| BI Gravado DGNG | nbase2 |
| IGV / IPM DGNG | nigv2 |
| BI Gravado DNG | nbase3 |
| IGV / IPM DNG | nigv3 |
| Valor Adq. NG | nina |
| ISC | nisc |
| ICBPER | nicbper |
| Otros Trib/ Cargos | nexo |
| Total CP | ntots |
| Tipo de Cambio | ntc |
| Fecha Emisión Doc Modificado | freffec |
| Tipo CP Modificado | crefdoc |
| Serie CP Modificado | crefser |
| Nro CP Modificado | crefnum |

Reglas:

- `Moneda = PEN` se convierte a `cmreg = S`.
- `Moneda = USD` se convierte a `cmreg = D`.
- Si `Clasif de Bss y Sss` viene vacio, se puede usar una clasificacion por defecto.
- Detraccion se tratara inicialmente como observacion, no como llenado automatico de constancia.
- Las cuentas contables se dejan vacias o se llenan manualmente.

## 15. Validaciones del MVP

SOFTBQ debe validar:

### Validaciones de archivo

- El archivo existe.
- El archivo tiene encabezado.
- El archivo tiene separador reconocido.
- El archivo corresponde a compras o ventas.
- El archivo tiene columnas obligatorias.
- Todas las filas tienen la misma cantidad de columnas.

### Validaciones de empresa y periodo

- El RUC del archivo coincide con la empresa seleccionada.
- El periodo del archivo coincide con el periodo seleccionado.
- El archivo no mezcla varios RUC.
- El archivo no mezcla varios periodos.

### Validaciones de comprobantes

- Fecha valida.
- Tipo de comprobante no vacio.
- Serie no vacia.
- Numero no vacio.
- Tipo de documento de cliente/proveedor no vacio.
- Numero de documento no vacio.
- Total no vacio.

### Validaciones monetarias

- Total CP debe cuadrar con base, IGV y otros importes.
- Moneda extranjera debe tener tipo de cambio.
- Importes deben ser numericos.

### Validaciones de duplicados

- No debe haber CAR SUNAT duplicado dentro del mismo archivo.

### Validaciones de notas

- Si el comprobante es nota de credito o nota de debito, debe alertar si faltan datos del comprobante modificado.

## 16. Observaciones y Errores

SOFTBQ debe clasificar observaciones:

### Error critico

Impide generar archivo.

Ejemplos:

- Falta columna obligatoria.
- Archivo no corresponde al tipo esperado.
- Filas con columnas incompletas.
- RUC no coincide.

### Advertencia

Permite generar archivo, pero debe mostrarse al usuario.

Ejemplos:

- Fecha de vencimiento vacia.
- Clasificacion de compras vacia.
- Moneda extranjera.
- Nota sin referencia completa.
- Detraccion detectada.

### Informativo

No afecta el proceso.

Ejemplos:

- Cantidad de comprobantes.
- Totales por tipo de comprobante.
- Totales por serie.

## 17. Pantallas del MVP

### 17.1 Panel Principal

Debe mostrar:

- Nueva conversion.
- Empresas.
- Historial.
- Configuracion.

### 17.2 Empresas

Debe permitir:

- Crear empresa.
- Editar empresa.
- Eliminar o desactivar empresa.
- Ver parametros por defecto.

### 17.3 Nueva Conversion

Campos:

- Empresa.
- Periodo.
- Archivo ventas.
- Archivo compras.

Acciones:

- Validar.
- Generar archivos.
- Cancelar.

### 17.4 Vista Previa

Debe mostrar:

- Empresa detectada.
- Periodo.
- Tipo de archivo.
- Cantidad de registros.
- Total base.
- Total IGV.
- Total CP.
- Observaciones.

### 17.5 Resultado

Debe mostrar:

- Estado de conversion.
- Boton descargar ventas.
- Boton descargar compras.
- Boton ver observaciones.
- Boton iniciar nueva conversion.

### 17.6 Historial

Debe mostrar:

- Fecha de conversion.
- Empresa.
- Periodo.
- Cantidad de registros compras.
- Cantidad de registros ventas.
- Estado.
- Archivos generados.

## 18. Configuracion Inicial

Configuraciones generales:

- Condicion por defecto: `CON`
- Medio de pago por defecto: `008`
- IGV por defecto: `18`
- Moneda nacional Contasis: `S`
- Moneda extranjera Contasis: `D`
- Separador TXT SIRE: `|`

## 19. Cuentas Contables

En el MVP, las cuentas contables no se automatizan.

El sistema puede:

- Dejarlas vacias.
- O permitir valores por defecto simples.

La decision final se debe tomar antes del desarrollo.

Campos que pueden quedar vacios:

- `cctabase`
- `cctaicbper`
- `cctaotrib`
- `cctatot`
- `ccodcos`
- `ccodcos2`

## 20. Seguridad y Privacidad

SOFTBQ debe tratar los archivos como informacion sensible.

Requisitos:

- No enviar archivos a servidores externos.
- No almacenar claves SOL.
- No conectarse a SUNAT en el MVP.
- Guardar archivos generados solo en el equipo o servidor local.
- Permitir borrar historial o archivos generados.

## 21. Criterios de Aceptacion del MVP

El MVP se considera aceptado si:

1. Permite crear una empresa.
2. Permite cargar un TXT SIRE de ventas.
3. Permite cargar un TXT SIRE de compras.
4. Detecta correctamente compras y ventas.
5. Valida columnas obligatorias.
6. Valida cantidad de columnas por fila.
7. Valida totales principales.
8. Genera Excel de ventas para Contasis.
9. Genera Excel de compras para Contasis.
10. Mantiene RUC, DNI, serie y numero como texto cuando corresponde.
11. Convierte fechas correctamente.
12. Permite descargar los archivos generados.
13. Procesa correctamente archivos grandes, por ejemplo mas de 2000 ventas.
14. Muestra resumen antes de generar.
15. Muestra observaciones claras.

## 22. Casos de Prueba Iniciales

### Caso 1: Ventas pequenas

Entrada:

- Archivo SIRE ventas con 2 registros.

Resultado esperado:

- Excel Contasis ventas generado.
- Totales correctos.
- Sin errores criticos.

### Caso 2: Compras pequenas

Entrada:

- Archivo SIRE compras con 1 registro.

Resultado esperado:

- Excel Contasis compras generado.
- Totales correctos.
- Sin errores criticos.

### Caso 3: Ventas grandes

Entrada:

- Archivo SIRE ventas con 2156 registros.

Resultado esperado:

- Excel Contasis ventas generado.
- 2156 registros procesados.
- Sin perdida por paginacion.
- Sin filas truncadas.

### Caso 4: RUC incorrecto

Entrada:

- Empresa seleccionada con RUC distinto al del archivo.

Resultado esperado:

- Error critico.
- No generar archivo hasta confirmar o corregir.

### Caso 5: Nota de credito sin referencia

Entrada:

- Comprobante tipo `07` sin datos de documento modificado.

Resultado esperado:

- Advertencia o error segun configuracion.

## 23. Pendientes Para Definir Antes del Desarrollo

1. Si las cuentas contables quedan vacias o con valores por defecto.
2. Si se generaran ambos archivos siempre o solo el archivo cargado.
3. Si el historial guardara los archivos generados o solo el registro de conversion.
4. Si se permitira editar datos antes de generar.
5. Si se agregara una salida adicional para el Excel mensual del estudio.
6. Si varios usuarios usaran SOFTBQ al mismo tiempo.
7. Donde se guardaran los archivos generados.

## 24. Versiones Futuras Fuera del MVP

Posibles mejoras:

- Reglas automaticas de cuentas contables.
- Generacion del Excel mensual del estudio.
- Comparacion contra archivos historicos.
- Importacion masiva por carpeta.
- Reporte de inconsistencias por cliente.
- Dashboard de conversiones mensuales.
- Integracion con API SIRE.
- Gestion de usuarios y permisos.

## 25. Resumen Ejecutivo

SOFTBQ debe iniciar como un convertidor interno, simple y confiable:

- Entrada: archivos TXT/CSV del SIRE.
- Proceso: validacion y conversion.
- Salida: Excel listo para importar en Contasis SQL.

El MVP debe priorizar precision, rapidez y seguridad local antes que automatizaciones avanzadas.

## 26. Usuarios y Accesos del MVP

SOFTBQ tendra login local desde el MVP.

No sera un login conectado a internet, correo o servicios externos. Los usuarios se guardaran en la base local de SOFTBQ.

Usuarios iniciales:

### 26.1 Usuario `admin`

Perfil: administrador del sistema.

Puede:

- Iniciar sesion.
- Ver panel principal.
- Crear clientes.
- Editar clientes.
- Inhabilitar clientes.
- Importar clientes desde Excel.
- Crear conversiones.
- Cargar archivos SIRE.
- Validar archivos.
- Generar archivos Contasis.
- Descargar archivos generados.
- Ver historial.
- Cambiar configuracion general.
- Cambiar contrasenas si se implementa esa opcion.

Restricciones:

- Ninguna dentro del MVP.

### 26.2 Usuario `armando`

Perfil: contador principal / usuario operativo avanzado.

Puede:

- Iniciar sesion.
- Ver panel principal.
- Crear clientes.
- Editar clientes.
- Inhabilitar clientes.
- Cambiar estado mensual de clientes.
- Crear conversiones.
- Cargar archivos SIRE.
- Validar archivos.
- Generar archivos Contasis.
- Descargar archivos generados.
- Ver historial.

No puede:

- Cambiar configuracion tecnica global.
- Cambiar usuarios o contrasenas de otros usuarios.
- Eliminar definitivamente clientes.
- Borrar historial definitivo.

Nota:

- `armando` si puede inhabilitar clientes, porque cumple el rol de contador principal y conoce el estado real de la cartera.
- En el MVP se recomienda evitar la eliminacion definitiva de clientes para prevenir perdida accidental de informacion.

## 27. Login

La pantalla de login debe solicitar:

- Usuario.
- Contrasena.

Usuarios iniciales:

- `admin`
- `armando`

Reglas:

- La sesion debe bloquear el acceso a las pantallas internas si no existe login activo.
- Debe existir opcion de cerrar sesion.
- La contrasena debe guardarse protegida, no como texto plano.
- No habra recuperacion por correo en el MVP.
- Las contrasenas iniciales se definiran al instalar o durante la primera configuracion.

## 28. Vistas Definitivas del MVP

### 28.1 Login

Objetivo:

- Proteger el acceso a SOFTBQ.

Elementos:

- Campo usuario.
- Campo contrasena.
- Boton ingresar.
- Mensaje de error si las credenciales son incorrectas.

### 28.2 Panel Principal

Objetivo:

- Mostrar el estado mensual de la cartera de clientes.

Elementos:

- Selector de periodo.
- Total de clientes activos.
- Clientes pendientes.
- Clientes con ventas procesadas.
- Clientes con compras procesadas.
- Clientes con archivos generados.
- Clientes revisados.
- Clientes declarados.
- Boton nueva conversion.
- Tabla de clientes y estado del periodo.

Estados sugeridos:

- Pendiente.
- Ventas cargadas.
- Compras cargadas.
- Generado.
- Revisado.
- Declarado.

### 28.3 Clientes

Objetivo:

- Administrar la base de clientes del estudio.

Elementos:

- Buscador por RUC, razon social o nombre corto.
- Tabla de clientes.
- Boton crear cliente.
- Boton importar clientes.
- Accion editar.
- Accion inhabilitar.

Campos:

- RUC.
- Razon social.
- Nombre corto.
- Estado activo/inactivo.
- Codigo entidad Contasis.
- Descripcion entidad Contasis.
- Condicion por defecto.
- Medio de pago por defecto.
- IGV por defecto.

### 28.4 Importar Clientes

Objetivo:

- Cargar la base inicial de clientes desde Excel.

Flujo:

1. Subir archivo Excel.
2. Detectar hojas disponibles.
3. Detectar columnas.
4. Mapear columnas a campos de SOFTBQ.
5. Mostrar vista previa.
6. Confirmar importacion.
7. Mostrar resumen:
   - Clientes creados.
   - Clientes actualizados.
   - Clientes omitidos.
   - Errores.

### 28.5 Nueva Conversion

Objetivo:

- Cargar archivos SIRE y preparar conversion a Contasis.

Elementos:

- Selector de cliente.
- Selector de periodo.
- Carga de archivo SIRE ventas.
- Carga de archivo SIRE compras.
- Boton validar.
- Boton cancelar.

Regla:

- Debe permitir cargar solo ventas, solo compras o ambos archivos.

### 28.6 Validacion / Vista Previa

Objetivo:

- Revisar los archivos antes de generar los Excel.

Debe mostrar por archivo:

- Tipo detectado: compras o ventas.
- RUC detectado.
- Periodo detectado.
- Cantidad de registros.
- Total base imponible.
- Total IGV.
- Total comprobantes.
- Errores criticos.
- Advertencias.
- Observaciones informativas.

Acciones:

- Generar Excel Contasis.
- Volver a cargar.
- Cancelar.

### 28.7 Resultado de Conversion

Objetivo:

- Descargar los archivos generados.

Elementos:

- Estado de la conversion.
- Archivo ventas generado, si aplica.
- Archivo compras generado, si aplica.
- Botones de descarga.
- Observaciones.
- Boton nueva conversion.
- Boton ir al panel.

### 28.8 Historial

Objetivo:

- Consultar conversiones realizadas.

Debe mostrar:

- Fecha de conversion.
- Usuario.
- Cliente.
- RUC.
- Periodo.
- Cantidad de registros de ventas.
- Cantidad de registros de compras.
- Estado.
- Archivos generados.

Filtros:

- Periodo.
- Cliente.
- Estado.
- Tipo de archivo.

### 28.9 Configuracion

Objetivo:

- Administrar parametros generales del sistema.

Acceso:

- Solo `admin`.

Parametros:

- Moneda soles Contasis: `S`.
- Moneda dolares Contasis: `D`.
- Condicion por defecto: `CON`.
- Medio de pago por defecto: `008`.
- IGV por defecto: `18`.
- Carpeta de salida.
- Formato de nombre de archivos.

## 29. Flujo Operativo Completo

### 29.1 Preparacion Inicial

1. `admin` ingresa a SOFTBQ.
2. Importa la base de clientes desde Excel.
3. Revisa clientes creados.
4. Ajusta datos base si corresponde.
5. Cierra sesion.

### 29.2 Flujo Mensual

1. `armando` ingresa a SOFTBQ.
2. Selecciona el periodo mensual.
3. Revisa el panel de clientes.
4. Selecciona un cliente pendiente.
5. Ingresa a nueva conversion.
6. Carga ventas SIRE, compras SIRE o ambos.
7. Valida archivos.
8. Revisa vista previa.
9. Genera archivos Contasis.
10. Descarga archivos generados.
11. Completa cuentas contables manualmente si corresponde.
12. Importa archivos en Contasis SQL.
13. Actualiza estado del cliente:
    - Generado.
    - Revisado.
    - Declarado.

### 29.3 Flujo de Cliente Inactivo

1. `armando` o `admin` ingresa a clientes.
2. Busca el cliente.
3. Selecciona inhabilitar.
4. SOFTBQ solicita confirmacion.
5. El cliente deja de aparecer como pendiente en periodos futuros.
6. El historial anterior se mantiene.

## 30. Stack Tecnologico Recomendado

El stack debe priorizar:

- Uso local.
- Facilidad para leer TXT/CSV.
- Facilidad para generar Excel.
- Base de datos portable.
- Posibilidad de empaquetar como aplicacion instalable o portable.
- Mantenimiento sencillo.

### 30.1 Recomendacion Principal

Frontend:

- React.

Backend local:

- Node.js.

Base de datos:

- SQLite.

Generacion Excel:

- Libreria `.xlsx` para Node.js.

Empaquetado futuro:

- Aplicacion local tipo escritorio o servidor local portable.

### 30.2 Motivo de la Recomendacion

React permite construir una interfaz moderna y comoda para:

- Panel mensual.
- Carga de archivos.
- Tablas de validacion.
- Historial.
- Gestion de clientes.

Node.js permite:

- Leer archivos TXT/CSV.
- Procesar grandes volumenes de registros.
- Generar Excel.
- Crear una API local para el frontend.
- Empaquetar el sistema para otra PC.

SQLite permite:

- Tener una base local en un solo archivo `.db`.
- No instalar motor de base de datos adicional.
- Copiar o respaldar la informacion facilmente.
- Mover SOFTBQ a otra PC con menor complejidad.

### 30.3 Alternativa Considerada

Python tambien es una buena opcion por su fortaleza con Excel y datos.

Sin embargo, para una aplicacion web local con interfaz moderna, React + Node.js + SQLite puede ser mas uniforme y facil de empaquetar en una sola experiencia.

### 30.4 Concepto de Instalacion

Primera etapa:

- SOFTBQ se desarrolla en la laptop principal.
- Se ejecuta localmente en navegador.

Entrega al contador:

- Se entrega como carpeta portable o instalador.
- No requiere instalar SQLite por separado.
- La base sera un archivo local, por ejemplo:

```text
SOFTBQ/
  SOFTBQ.exe
  data/
    softbq.db
  outputs/
    ventas_contasis/
    compras_contasis/
```

Etapa futura:

- Si varios usuarios necesitan entrar desde la misma oficina, SOFTBQ puede instalarse en una PC o servidor interno y usarse por red local.

## 31. Base de Datos Inicial

La base local debe guardar:

- Usuarios.
- Clientes.
- Periodos.
- Conversiones.
- Archivos generados.
- Observaciones.
- Configuracion general.

Tablas iniciales sugeridas:

- `users`
- `clients`
- `periods`
- `conversions`
- `conversion_files`
- `conversion_observations`
- `settings`

### 31.1 Tabla `users`

Campos sugeridos:

- `id`
- `username`
- `password_hash`
- `role`
- `active`
- `created_at`
- `updated_at`

Roles iniciales:

- `admin`
- `principal_accountant`

### 31.2 Tabla `clients`

Campos sugeridos:

- `id`
- `ruc`
- `business_name`
- `short_name`
- `active`
- `contasis_entity_code`
- `contasis_entity_description`
- `default_condition`
- `default_payment_method`
- `default_igv_percent`
- `created_at`
- `updated_at`

### 31.3 Tabla `conversions`

Campos sugeridos:

- `id`
- `client_id`
- `period`
- `created_by`
- `status`
- `sales_status`
- `purchases_status`
- `sales_records_count`
- `purchases_records_count`
- `sales_total`
- `purchases_total`
- `created_at`
- `updated_at`

## 32. Estados del Cliente por Periodo

Estados sugeridos:

- `pendiente`
- `ventas_cargadas`
- `compras_cargadas`
- `generado`
- `revisado`
- `declarado`

Reglas:

- Un cliente activo aparece en el panel mensual.
- Un cliente inactivo no aparece como pendiente en nuevos periodos.
- El historial de clientes inactivos no debe eliminarse.
- `armando` puede cambiar estos estados.

## 33. Decision Actual del MVP

Queda definido:

- SOFTBQ sera software web local.
- Tendra login.
- Usuarios iniciales: `admin` y `armando`.
- `armando` podra crear, editar e inhabilitar clientes.
- Las cuentas contables se manejaran manualmente.
- El sistema trabajara con descargas TXT/CSV del SIRE.
- La paginacion del SIRE no afecta el proceso.
- La base de clientes se importara desde Excel al iniciar el proyecto.
- La base local recomendada sera SQLite.
- El stack recomendado sera React + Node.js + SQLite.

## 34. Stack Tecnologico Aprobado

Queda aprobado el siguiente stack para el desarrollo de SOFTBQ.

### 34.1 Lenguaje Principal

- TypeScript.

Uso:

- Frontend.
- Backend.
- Funciones compartidas.
- Mapeos SIRE.
- Mapeos Contasis.
- Validaciones.

Motivo:

- SOFTBQ manejara muchos campos, columnas, tipos de comprobante, fechas e importes.
- TypeScript ayudara a reducir errores en nombres de campos y estructuras de datos.

### 34.2 Frontend

Tecnologias:

- React.
- Vite.
- TypeScript.
- Tailwind CSS.
- shadcn/ui.
- TanStack Table.
- React Hook Form.
- Zod.
- date-fns.

Uso:

- Pantallas.
- Formularios.
- Tablas.
- Validaciones de formularios.
- Vista previa de conversiones.
- Panel mensual.

### 34.3 Backend

Tecnologias:

- Node.js.
- TypeScript.
- Fastify.
- Zod.
- bcrypt.

Uso:

- API local.
- Login.
- Gestion de clientes.
- Gestion de conversiones.
- Procesamiento de archivos.
- Generacion de archivos Contasis.
- Historial.

### 34.4 Base de Datos

Tecnologias:

- SQLite.
- Drizzle ORM.

Uso:

- Usuarios.
- Clientes.
- Configuracion.
- Historial.
- Conversiones.
- Observaciones.

Motivo:

- SQLite no requiere instalar un motor de base de datos aparte.
- La base es un archivo local.
- Facilita respaldo y traslado a otra PC.
- Drizzle es liviano y funciona bien con TypeScript.

### 34.5 Excel y Archivos

Tecnologias:

- ExcelJS.
- Parser CSV/TXT controlado desde backend.

Uso:

- Leer base de clientes desde Excel.
- Generar archivos Excel para Contasis.
- Mantener textos con ceros iniciales.
- Formatear fechas.
- Formatear importes.
- Procesar TXT del SIRE separado por `|`.
- Procesar CSV del SIRE si corresponde.

### 34.6 Empaquetado Futuro

Opciones futuras:

- Electron.
- Tauri.
- Instalador local.
- Carpeta portable.

Decision actual:

- No se empaquetara en la primera etapa.
- Primero se desarrollara como web local.
- El empaquetado se evaluara cuando el MVP este funcional.

### 34.7 Stack Final Resumido

```text
Frontend:
  React
  Vite
  TypeScript
  Tailwind CSS
  shadcn/ui
  TanStack Table
  React Hook Form
  Zod
  date-fns

Backend:
  Node.js
  TypeScript
  Fastify
  Zod
  bcrypt

Base de datos:
  SQLite
  Drizzle ORM

Archivos:
  ExcelJS
  Parser TXT/CSV

Futuro:
  Electron o Tauri
```

## 35. Arquitectura General del Proyecto

SOFTBQ se construira separando claramente:

- UI.
- API.
- Servicios.
- Repositorios.
- Funciones de conversion.
- Funciones de Excel.
- Jobs.
- Storage.

Regla principal:

- La UI no debe contener logica de conversion SIRE a Contasis.
- La UI solo muestra pantallas, envia archivos, consume APIs y muestra resultados.
- El backend coordina validacion, conversion, generacion de archivos e historial.
- Los paquetes internos contienen la logica reutilizable.

## 36. Estructura de Carpetas Recomendada

Estructura base:

```text
softbq/
  apps/
    web/
    server/

  packages/
    core/
    sire/
    contasis/
    excel/
    db/
    config/

  storage/
    uploads/
    outputs/
    temp/

  docs/
  scripts/
```

## 37. Estructura del Frontend

Ruta:

```text
apps/web/
  src/
    app/
    routes/
    layouts/
    pages/
    features/
    components/
    hooks/
    services/
    lib/
    styles/
```

### 37.1 Features del Frontend

```text
features/
  auth/
    LoginPage.tsx
    authApi.ts
    authStore.ts

  dashboard/
    DashboardPage.tsx
    DashboardCards.tsx
    ClientPeriodStatusTable.tsx

  clients/
    ClientsPage.tsx
    ClientForm.tsx
    ImportClientsPage.tsx
    clientsApi.ts

  conversions/
    NewConversionPage.tsx
    ValidationPreviewPage.tsx
    ConversionResultPage.tsx
    conversionApi.ts

  history/
    HistoryPage.tsx
    historyApi.ts

  settings/
    SettingsPage.tsx
    settingsApi.ts
```

### 37.2 Responsabilidad del Frontend

El frontend debe:

- Mostrar login.
- Mostrar panel mensual.
- Mostrar clientes.
- Permitir importar clientes.
- Permitir cargar archivos SIRE.
- Mostrar validaciones.
- Permitir descargar archivos generados.
- Mostrar historial.

El frontend no debe:

- Parsear SIRE.
- Generar Excel Contasis.
- Acceder directamente a SQLite.
- Contener reglas de negocio tributarias.

## 38. Estructura del Backend

Ruta:

```text
apps/server/
  src/
    main.ts
    routes/
    controllers/
    services/
    jobs/
    repositories/
    middlewares/
    validators/
    modules/
    utils/
```

### 38.1 Modulos del Backend

```text
modules/
  auth/
    auth.routes.ts
    auth.controller.ts
    auth.service.ts
    auth.repository.ts

  clients/
    clients.routes.ts
    clients.controller.ts
    clients.service.ts
    clients.repository.ts

  conversions/
    conversions.routes.ts
    conversions.controller.ts
    conversions.service.ts
    conversions.repository.ts

  files/
    files.service.ts
    storage.service.ts

  settings/
    settings.routes.ts
    settings.controller.ts
    settings.service.ts
    settings.repository.ts
```

### 38.2 Responsabilidad de Capas Backend

Controllers:

- Reciben request.
- Validan entrada basica.
- Llaman servicios.
- Devuelven respuesta.

Services:

- Contienen reglas del sistema.
- Coordinan conversiones.
- Coordinan validaciones.
- Coordinan escritura de archivos.
- Coordinan historial.

Repositories:

- Acceden a SQLite.
- No contienen reglas de negocio complejas.

Jobs:

- Ejecutan procesos largos o pesados.
- Procesan conversiones grandes.
- Importan clientes.
- Limpian temporales.

Middlewares:

- Autenticacion.
- Manejo de errores.
- Validacion de sesion.

## 39. Paquetes Internos

### 39.1 `packages/core`

Responsabilidad:

- Tipos compartidos.
- Constantes.
- Errores.
- Utilidades comunes.

Estructura:

```text
packages/core/
  src/
    types/
    constants/
    errors/
    result.ts
```

### 39.2 `packages/sire`

Responsabilidad:

- Entender archivos del SIRE.
- Detectar si son compras o ventas.
- Leer TXT/CSV.
- Validar columnas.
- Normalizar datos.

Funciones sugeridas:

```text
detectSireFileType.ts
parseSireCsv.ts
parseSireTxt.ts
validateSireSales.ts
validateSirePurchases.ts
normalizeSales.ts
normalizePurchases.ts
```

### 39.3 `packages/contasis`

Responsabilidad:

- Definir campos tecnicos de Contasis.
- Mapear datos normalizados hacia Contasis.
- Validar filas finales antes de generar Excel.

Estructura:

```text
packages/contasis/
  src/
    fields/
      salesFields.ts
      purchaseFields.ts
    mappers/
      mapSalesToContasis.ts
      mapPurchasesToContasis.ts
    validators/
      validateContasisRows.ts
```

### 39.4 `packages/excel`

Responsabilidad:

- Crear archivos Excel.
- Leer Excel de clientes.
- Escribir Excel final para Contasis.

Funciones sugeridas:

```text
createWorkbook.ts
writeContasisSalesExcel.ts
writeContasisPurchasesExcel.ts
readClientsExcel.ts
```

### 39.5 `packages/db`

Responsabilidad:

- Conexion SQLite.
- Esquema.
- Migraciones.
- Seed inicial.

Estructura:

```text
packages/db/
  src/
    schema/
    migrations/
    client.ts
    seed.ts
```

Seed inicial:

- Crear usuario `admin`.
- Crear usuario `armando`.
- Crear configuracion base.

## 40. Jobs del Sistema

Jobs iniciales:

```text
jobs/
  processConversionJob.ts
  importClientsJob.ts
  cleanupTempFilesJob.ts
```

### 40.1 `processConversionJob`

Responsabilidad:

- Recibir archivos cargados.
- Parsear SIRE.
- Validar SIRE.
- Normalizar datos.
- Mapear a Contasis.
- Generar Excel.
- Guardar historial.
- Guardar observaciones.

### 40.2 `importClientsJob`

Responsabilidad:

- Leer Excel de clientes.
- Detectar columnas.
- Crear clientes.
- Actualizar clientes existentes.
- Reportar errores.

### 40.3 `cleanupTempFilesJob`

Responsabilidad:

- Limpiar archivos temporales.
- Evitar acumulacion de archivos innecesarios.

## 41. Flujo Tecnico de Conversion

### 41.1 Validacion

```text
UI
  -> POST /conversions/validate
  -> Backend recibe archivos
  -> SIRE detecta tipo de archivo
  -> SIRE valida columnas
  -> SIRE valida filas
  -> Backend calcula resumen
  -> UI muestra vista previa
```

### 41.2 Generacion

```text
UI
  -> POST /conversions/generate
  -> Backend crea conversion
  -> processConversionJob procesa archivos
  -> SIRE normaliza datos
  -> Contasis mapea filas
  -> Excel genera archivos .xlsx
  -> DB guarda historial
  -> UI recibe links de descarga
```

## 42. Reglas de Separacion

Reglas obligatorias:

- Ningun componente React debe leer o transformar archivos SIRE.
- Ningun componente React debe generar Excel.
- Ningun controller debe contener mapeos SIRE a Contasis.
- Ningun repository debe contener reglas de negocio.
- Todo mapeo SIRE debe vivir en `packages/sire` o `packages/contasis`.
- Toda escritura Excel debe vivir en `packages/excel`.
- Toda consulta SQLite debe pasar por repositories o por el paquete `db`.

## 43. Orden Recomendado de Desarrollo

1. Crear estructura del monorepo.
2. Configurar TypeScript.
3. Configurar frontend React con Vite.
4. Configurar backend Fastify.
5. Configurar SQLite + Drizzle.
6. Crear seed de usuarios `admin` y `armando`.
7. Implementar login.
8. Implementar layout principal.
9. Implementar clientes.
10. Implementar importacion de clientes desde Excel.
11. Implementar parser SIRE ventas.
12. Implementar parser SIRE compras.
13. Implementar validacion de archivos.
14. Implementar mapeo Contasis ventas.
15. Implementar mapeo Contasis compras.
16. Implementar generacion Excel.
17. Implementar nueva conversion.
18. Implementar vista previa.
19. Implementar resultado y descargas.
20. Implementar historial.
21. Implementar panel mensual.
22. Pulir configuracion.
23. Probar con archivos pequenos.
24. Probar con archivo grande de 2156 ventas.

## 44. Riesgos Tecnicos a Validar Temprano

1. Generacion correcta de Excel con ExcelJS.
2. Preservar ceros iniciales en RUC, DNI, series y numeros.
3. Procesamiento de archivos grandes sin bloquear la UI.
4. Manejo correcto de tildes y caracteres especiales.
5. Lectura de TXT SIRE separado por `|`.
6. Lectura de CSV SIRE cuando sea necesario.
7. Portabilidad de SQLite a otra PC.
8. Empaquetado futuro en Windows.

## 45. Decision Final de Arquitectura

SOFTBQ se desarrollara como una aplicacion web local con arquitectura modular.

La estructura debe permitir:

- Construir el MVP rapido.
- Mantener separacion limpia entre UI y logica.
- Escalar a mas validaciones.
- Escalar a mas usuarios.
- Escalar a version portable o instalable.
- Agregar reglas contables en el futuro sin romper la base.
- Agregar integracion SIRE en el futuro si se decide.
