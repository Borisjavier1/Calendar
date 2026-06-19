# Batallas de Freestyle Costa Rica

Aplicacion web full-stack para publicar y administrar eventos de batallas de freestyle en Costa Rica.

## Stack

- React + Vite
- TailwindCSS
- React Router
- Firebase Firestore
- Firebase Auth (solo admin)
- Firebase Hosting
- FullCalendar

## Estructura

```text
src/
	components/
	hooks/
	pages/
	services/
	utils/
```

## Requisitos

- Node.js 20+
- npm 10+
- Firebase CLI

## Instalacion local

1. Instalar dependencias:

```bash
npm install
```

2. Crear archivo de entorno:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Completar variables Firebase en .env:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_ADMIN_EMAIL=admin@example.com
```

4. Ejecutar en desarrollo:

```bash
npm run dev
```

## Configuracion Firebase

1. Crear un proyecto en Firebase (plan Spark).
2. Activar Authentication con Email/Password.
3. Crear el usuario admin en Firebase Auth con el correo definido en VITE_ADMIN_EMAIL.
4. Activar Firestore en modo produccion.
5. Ajustar .firebaserc con tu project id real:

```json
{
	"projects": {
		"default": "tu-project-id"
	}
}
```

6. Editar firestore.rules y reemplazar admin@example.com por tu correo admin real.

## Coleccion Firestore

Coleccion: events

Campos:
- id (autogenerado)
- name (string)
- date (timestamp)
- city (string)
- place (string)
- description (string)
- competitionId (string)
- competitionName (string)
- type (string, replica de competitionName para compatibilidad)
- imageUrl (string)
- createdAt (timestamp)

Coleccion: competitions

Campos:
- id (autogenerado)
- name (string)
- city (string)
- imageUrl (string)
- createdAt (timestamp)

## Funcionalidades

- Publicacion de eventos sin login
- Seleccion de competencia desde dropdown en formulario publico
- Visualizacion inmediata de eventos
- Calendario mensual con colores por tipo
- Filtro por competencia
- Orden por fecha
- Vista de detalle
- Imagen asociada automaticamente desde la competencia
- Panel admin con login para editar y eliminar
- Panel admin para crear/editar/eliminar competencias

## Build y deploy

1. Login en Firebase CLI:

```bash
firebase login
```

2. Construir proyecto:

```bash
npm run build
```

3. Desplegar:

```bash
firebase deploy
```

Tambien disponible:

```bash
npm run deploy
```

## Notas de seguridad

- Esta version permite creacion publica de eventos con imagen por URL (sin costos de Storage), segun el requerimiento funcional.
- Para produccion avanzada, se recomienda agregar validaciones server-side, rate limiting y reglas mas estrictas.

## Guia operativa

- Revisar GUIA-ROLES-Y-CREDENCIALES.md para roles, usuarios organizador y comandos de reset de claves.
