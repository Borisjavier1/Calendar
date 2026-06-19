# Script para Cargar Datos de Prueba en Firestore

Este script cargará automáticamente todas las competencias y eventos del calendario 2026 en tu base de datos Firestore.

## Requisitos previos

- Node.js instalado
- Firebase Admin SDK (se instala automáticamente con `npm install`)

## Pasos para ejecutar

### 1. Descargar las credenciales de Firebase

1. Abre [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto: **calendario-batallas-33c30**
3. Ve a **Configuración del Proyecto** (engranaje arriba a la izquierda)
4. Ve a la pestaña **Cuentas de Servicio**
5. Haz clic en **Generar nueva clave privada**
6. Se descargará un archivo JSON
7. **Renómbralo exactamente a: `service-account-key.json`**
8. **Muévelo a la carpeta `c:\Calendar\`** (la raíz del proyecto)

### 2. Instalar dependencias del script

En PowerShell en `c:\Calendar`:

```powershell
npm install firebase-admin
```

### 3. Ejecutar el script

En PowerShell en `c:\Calendar`:

```powershell
node seed-data.js
```

### 4. Esperar a que termine

El script:
- Creará **15 competencias** (Bronx 04, Perros de Traba, Central, etc.)
- Creará **50+ eventos** con fechas y descripciones
- Mostrará progreso en la consola
- Se cerrará automáticamente cuando termine

## Qué hace el script

El script `seed-data.js` contiene:

1. **Competencias** extraídas de tu calendario:
   - Bronx 04
   - Perros de Traba
   - Central
   - Leyendas 420
   - Ritmoverso
   - Código Øccidente
   - Gallos de pelea
   - Pacífico Flow Battles
   - Elander 1v1
   - Hunter Battles
   - 03 Under
   - Reyes de Desampa
   - ZHH
   - Empire Battles
   - Brumas Battles

2. **Eventos** de Junio a Diciembre 2026 con:
   - Nombre
   - Fecha y hora
   - Ciudad
   - Lugar
   - Competencia asociada
   - Descripción

## Después de ejecutar

1. Abre http://localhost:5173 en tu navegador
2. **¡Todos los eventos deberían aparecer en la app!**
3. Los eventos aparecerán en:
   - Página de inicio (próximos eventos)
   - Calendario
   - Filtro por competencia
   - Detalle de evento

## Próximo paso

**Ahora puedes personalizar las imágenes de las competencias:**

1. Ve a /admin e inicia sesión
2. Haz clic en **Editar** en cada competencia
3. Reemplaza la URL de la imagen (placeholder) por imágenes reales
4. Clic en **Actualizar competencia**

## Solución de problemas

### Error: "service-account-key.json no encontrado"

- Verifica que descargaste el archivo desde Firebase Console
- Verifica que lo renombraste exactamente a `service-account-key.json`
- Verifica que está en `c:\Calendar\` (carpeta raíz del proyecto)

### Error: "Permission denied"

- Verifica que tu usuario admin en Firebase Auth tiene permisos
- Verifica que el archivo `.env` tiene el correo admin correcto
- Verifica que las reglas en `firestore.rules` están publicadas en Firebase

### El script se queda esperando

- Espera unos segundos, es normal en la primera ejecución
- Si sigue bloqueado, presiona Ctrl+C y revisa si hay mensajes de error
