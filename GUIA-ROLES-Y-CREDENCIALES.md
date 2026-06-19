# Guia de Roles, Organizadores y Claves

Este documento resume como funciona el acceso por roles y como administrar claves de organizadores.

## Roles activos

### Vista normal (publico)
- Puede ver eventos.
- No puede crear, editar ni borrar.

### Vista organizador
- Accede con usuario y clave.
- Solo ve y administra eventos de su competencia asignada.
- Puede crear, editar y borrar sus propios eventos.
- Puede cambiar su propia clave en Panel Organizador.

### Vista admin
- Es el correo administrador definido en entorno y reglas.
- Puede administrar competencias, eventos y organizadores.
- Puede crear organizadores.

## Formato de usuarios organizador

- Usuario: nombre de competencia pegado y en minuscula.
- Correo tecnico: usuario@organizador.bfcr.local
- Clave inicial: usuario123

Ejemplos:
- bronx04 -> bronx04123
- 03under -> 03under123

## Usuarios organizador definidos

- bronx04
- perrosdetraba
- centralbattles
- leyendas420
- ritmoverso
- codigooccidente
- gallosdepelea
- pacificoflowbattles
- elander
- hunterbattles
- 03under
- reyesdedesampa
- zhh
- brumasbattles

## Como resetear claves

### Reset de un solo usuario

Comando:

npm run organizers:reset-one -- USUARIO

Ejemplo:

npm run organizers:reset-one -- bronx04

Si no pasas clave manual, el reset deja la clave en usuario123.

Opcional con clave personalizada:

npm run organizers:reset-one -- bronx04 --password=ClaveNueva123

Salida esperada:
- usuario=...
- email=...
- nuevaClave=...

### Reset masivo de todos los organizadores

Comando:

npm run organizers:reset-all

Esto aplica a todos la clave por defecto usuario123.

## Cambio de clave por el organizador

Dentro de Panel Organizador hay seccion Cambiar clave:
- Clave actual
- Nueva clave
- Confirmar nueva clave

La nueva clave debe tener al menos 6 caracteres.

## Archivos clave en este flujo

- firestore.rules
- src/pages/AdminPage.jsx
- src/pages/OrganizerPage.jsx
- src/services/authService.js
- src/services/organizersService.js
- reset-organizer-password.mjs
- reset-all-organizer-passwords.mjs
- create-organizers.mjs

## Nota de seguridad

- Firebase Auth no permite leer claves actuales en texto plano.
- Solo se pueden definir al crear, cambiar por el propio usuario o resetear por admin.
