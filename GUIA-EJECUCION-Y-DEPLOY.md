# Guia para correr y desplegar la aplicacion

Este documento explica paso a paso como ejecutar y hacer deploy del proyecto **Batallas de Freestyle Costa Rica**.

## 1. Requisitos previos

Asegurate de tener instalado:

- Node.js 20 o superior
- npm 10 o superior
- Firebase CLI

Para verificar versiones:

```bash
node -v
npm -v
firebase --version
```

## 2. Instalar dependencias

Desde la raiz del proyecto (`C:\Calendar`):

```bash
npm install
```

## 3. Configurar variables de entorno

Crea un archivo `.env` a partir de `.env.example`.

En Linux/macOS:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Luego completa los valores en `.env` con los datos de tu proyecto Firebase:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_ADMIN_EMAIL=admin@example.com
```

## 4. Correr en modo desarrollo

```bash
npm run dev
```

Vite mostrara una URL local, normalmente:

```text
http://localhost:5173/
```

## 4.1 Flujo recomendado de uso

1. Entra a `/admin` y crea las competencias (nombre, ciudad e imagen URL).
2. Luego entra a `/submit` y registra eventos seleccionando una competencia en el dropdown.
3. Cada evento hereda automaticamente la imagen y nombre de la competencia elegida.

## 5. Verificar calidad y build

Antes de deployar, valida que todo compila correctamente:

```bash
npm run lint
npm run build
```

Si ambos comandos terminan sin errores, el proyecto esta listo para produccion.

## 6. Configurar Firebase para deploy

### 6.1 Iniciar sesion en Firebase

```bash
firebase login
```

### 6.2 Configurar el project id

Edita `.firebaserc` y reemplaza:

```json
{
  "projects": {
    "default": "YOUR_FIREBASE_PROJECT_ID"
  }
}
```

por el ID real de tu proyecto Firebase.

### 6.3 Configurar el correo admin en reglas

En `firestore.rules`, reemplaza `admin@example.com` por el correo real del administrador.

Debe coincidir con `VITE_ADMIN_EMAIL` en tu `.env`.

## 7. Deploy a Firebase Hosting

Tienes dos opciones:

### Opcion A: comando completo del proyecto

```bash
npm run deploy
```

Este comando ejecuta build y luego deploy.

### Opcion B: manual

```bash
npm run build
firebase deploy
```

## 8. Deploy solo de servicios especificos (opcional)

Si quieres desplegar solo hosting, por ejemplo:

```bash
firebase deploy --only hosting
```

Para reglas/indexes de Firestore:

```bash
firebase deploy --only firestore
```

## 9. Solucion de problemas comunes

- Error de autenticacion Firebase CLI: vuelve a ejecutar `firebase login`.
- Error por variables faltantes: revisa `.env` y confirma que no haya campos vacios.
- Error de permisos admin: valida que el usuario exista en Firebase Auth y que su correo coincida con `VITE_ADMIN_EMAIL` y con `firestore.rules`.
- Error de proyecto Firebase: confirma que el project id en `.firebaserc` sea correcto.
- Imagen no visible: verifica que la URL de imagen sea publica y comience con `http://` o `https://`.
- No aparece una competencia en el dropdown: verifica que exista en la coleccion `competitions` y que tenga permisos de lectura publica en `firestore.rules`.

## 10. Resumen rapido de comandos

```bash
npm install
npm run dev
npm run lint
npm run build
firebase login
npm run deploy
```
