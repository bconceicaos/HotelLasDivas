# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Divas Project

Divas Project es una aplicación web desarrollada con Node.js y Vite que simula la gestión de habitaciones, posiblemente con propósitos educativos o de presentación.

## Requisitos

Antes de empezar, asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) (versión recomendada: 16.x o superior)
- [npm](https://www.npmjs.com/) (viene con Node.js)
- (Opcional) [Vercel CLI](https://vercel.com/cli) si deseas desplegar

## Instalación

1. Clona este repositorio:

git clone <url-del-repositorio>
cd Divas-project

2. Instala las dependencias:

npm install

(express, dotenv, cors, axios, cookie-parser, helmet, express-mongo-sanitize , mongoose, jsonwebtoken, bcryptjs, ws, multer, express-validator, bootstrap, react-bootstrap-icons, react-responsive-carousel, react-bootstrap)

3. Crea los archivos de entorno .env y .env.client si no existen, basados en los ejemplos proporcionados (o configúralos según tus variables necesarias):

# .env
PORT=5000  # Puerto para el backend 
MONGO_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/<base_de_datos>?retryWrites=true&w=majority&appName=<nombre_app>
NODE_ENV=production
JWT_SECRET=tu_clave_secreta
JWT_SECRET_REFRESH=tu_clave_refresh
EMAIL_USER=tu_correo@ejemplo.com
EMAIL_PASS=tu_contraseña_de_correo

# .env.client
VITE_API_URL=https://hotellasdivas.onrender.com/api


## Desarrollo (Frontend + Backend)

1. Para iniciar el servidor backend:

node server.js

2. Para iniciar el entorno de desarrollo del frontend:

npm run dev


## Despliegue
Puedes desplegar fácilmente (SOLO) en Vercel (en Render desgraciadamente no). Ya incluye un archivo vercel.json de configuración.
