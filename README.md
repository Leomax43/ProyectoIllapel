#  Proyecto Illapel - Sistema de Ayudas Sociales y Billetera Digital

Este repositorio contiene el código fuente completo del ecosistema digital desarrollado para la Municipalidad de Illapel. El sistema está compuesto por una plataforma de administración web, una aplicación móvil para beneficiarios/comercios, y una API RESTful que centraliza la lógica de negocio.

## Estructura del Proyecto

El repositorio está dividido en tres módulos principales:
* `backend/`: API RESTful construida con Node.js, Express y PostgreSQL.
* `frontend/frontend-web/`: Panel de administración web construido con React y Vite.
* `app-movil/`: Aplicación móvil multiplataforma construida con React Native y Expo.

---

## Guía de Instalación Paso a Paso

Sigue estas instrucciones estrictamente en orden para levantar el proyecto en tu entorno local.

### Requisitos Previos
* [Node.js](https://nodejs.org/) (v16 o superior)
* [PostgreSQL](https://www.postgresql.org/) (o Docker para usar el `docker-compose.yml` incluido)
* Aplicación [Expo Go](https://expo.dev/client) en tu dispositivo móvil (para probar la app).

### 1. Clonar el repositorio
```
git clone [https://github.com/Leomax43/ProyectoIllapel.git](https://github.com/Leomax43/ProyectoIllapel.git)
cd ProyectoIllapel
```

---

### 2. Configuración del Backend (Base de Datos y API)
Abre una terminal y navega a la carpeta del backend para instalar las dependencias.

```
cd backend
npm install
```

**Instalación de dependencias críticas:**
Asegúrate de instalar los siguientes paquetes requeridos para el manejo de archivos, autenticación y encriptación. En tu terminal del backend, ejecuta:

```
# Para el manejo de subida de archivos (PDFs, comprobantes)
npm install multer

# Para la generación y validación de tokens de seguridad
npm install jsonwebtoken

# Para la encriptación segura de contraseñas
npm install bcrypt
```

Configuración de la Base de Datos:

Si utilizas Docker para la base de datos, abre una terminal en la raíz del proyecto (donde está el archivo docker-compose.yml) y levanta el contenedor antes de continuar:

docker-compose up -d
Una vez que la base de datos esté corriendo, vuelve a la carpeta backend/, inicializa las tablas y pobla la base de datos con información de prueba ejecutando:

**Configuración de la Base de Datos:**
1. Crea un archivo `.env` en la carpeta `backend/` basándote en un posible `.env.example` o configura las variables de conexión a tu base de datos PostgreSQL local.
2. Inicializa las tablas y pobla la base de datos con información de prueba ejecutando:
```
node initDB.js
node seedDB.js
```

**Levantar el servidor:**
```
npm run dev
```
*(El servidor quedará corriendo normalmente en `http://localhost:3000` o el puerto configurado).*

---

### 3. Configuración del Frontend Web (Panel de Administración)
Abre una **nueva pestaña** en tu terminal y navega a la carpeta del frontend web.

```
cd frontend/frontend-web
npm install
npm run dev
```
*(La plataforma web se abrirá automáticamente en tu navegador o indicará una ruta como `http://localhost:5173`).*

---

### 4. Configuración de la Aplicación Móvil
Abre una **tercera pestaña** en tu terminal y navega a la carpeta de la app.

```
cd app-movil
npm install
npx expo start
```
*(Se desplegará un código QR en la terminal. Escanéalo con la app **Expo Go** desde tu teléfono Android o iOS para abrir la aplicación).*

---


### 5. Preparación para Producción (Cambio de IP a Servidor Municipal)
Si deseas levantar este proyecto en un servidor real en lugar de tu entorno local (localhost), debes ajustar las direcciones apuntando a la IP pública del servidor.

Ajuste en Backend (API):

Abre el archivo .env del servidor y asegúrate de configurar las credenciales definitivas de la base de datos.

Actualiza los permisos de CORS en el código para permitir conexiones entrantes desde el dominio oficial de la municipalidad.

Ajuste en Frontend Web:

En la carpeta frontend/frontend-web, abre o crea el archivo .env.

Declara la variable de entorno con la IP del servidor:
VITE_API_URL=http://<IP_DEL_SERVIDOR_MUNICIPAL>:3000/api

Compila el proyecto para producción ejecutando: npm run build

Ajuste en Aplicación Móvil:

En la carpeta app-movil, busca el archivo de configuración central (ej. src/config/api.js).

Cambia la constante de conexión:
export const API_URL = 'http://<IP_DEL_SERVIDOR_MUNICIPAL>:3000/api';

Genera el instalador final (.apk o .aab) ejecutando: eas build -p android --profile preview


##  Credenciales de Prueba (SeedDB)
Si ejecutaste el comando `node seedDB.js` correctamente, puedes acceder al sistema con los siguientes usuarios de prueba (La clave para todos es: **1234**):

**Usuarios Administrativos (Web):**
* Super Admin: `11111111-1`
* Jefatura: `22222222-2`
* Asistente Social: `33333333-3`

**Usuarios App Móvil:**
* Familia (Beneficiario): `12345678-9`
* Comercio (Supermercado El Centro): `77777777-7`
