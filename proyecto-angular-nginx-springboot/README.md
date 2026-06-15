# Sistema de Control Escolar - Angular + Spring Boot + Nginx

Este proyecto une dos partes:

- `sistema-escolar-frontend/` -> Angular 20+ (standalone, signals), basado en el
  `index.html` original (tabla de estudiantes, formulario en drawer, busqueda,
  exportar a Excel).
- `estudiantes-service/` -> tu microservicio Spring Boot + PostgreSQL (sin
  cambios funcionales, solo se hizo configurable la conexion a la BD via
  variables de entorno).

Hay dos formas de correrlo: **todo local** (sin Docker) o con
**docker-compose**.

---

## Opcion A: Todo local (Nginx + Spring Boot + Angular en tu maquina)

### 1) Backend (Spring Boot)

1. Asegurate de tener PostgreSQL corriendo en `localhost:5432` con la BD
   `estudiantes_db` (usuario `postgres`, password `1234`, o ajusta
   `application.yaml`).
2. En `estudiantes-service/`:
   ```bash
   ./mvnw spring-boot:run
   ```
   Esto deja la API en `http://localhost:8080/api/estudiantes`.

### 2) Frontend (Angular)

1. Instala dependencias (solo la primera vez):
   ```bash
   cd sistema-escolar-frontend
   npm install
   ```
2. Para desarrollar con recarga en vivo (usa `proxy.conf.json` para mandar
   `/api` a `localhost:8080` automaticamente):
   ```bash
   npm start
   ```
   Abre `http://localhost:4200`.

3. Para generar el build de produccion:
   ```bash
   npm run build
   ```
   Esto genera `dist/sistema-escolar-frontend/browser/` con los archivos
   estaticos listos para Nginx.

### 3) Nginx

1. Instala Nginx (Windows: descomprime el zip oficial; Linux:
   `sudo apt install nginx`).
2. Copia el contenido de `dist/sistema-escolar-frontend/browser/` a la
   carpeta que sirva Nginx (por defecto en `nginx.conf` se usa
   `C:/nginx/html/sistema-escolar-frontend`, ajustalo a tu ruta real).
3. Reemplaza el `nginx.conf` por el incluido en este proyecto
   (`sistema-escolar-frontend/nginx.conf`) — ya trae:
   - `location /` -> sirve el `index.html` de Angular (con soporte de rutas
     internas via `try_files`).
   - `location /api/` -> reenvia a `http://127.0.0.1:8080/api/` (tu Spring
     Boot local).
4. Inicia/recarga Nginx:
   ```bash
   nginx -s reload
   ```
5. Abre `http://localhost` (puerto 80). El navegador habla solo con Nginx;
   Nginx reparte entre los archivos estaticos de Angular y el proxy hacia
   Spring Boot. Como todo queda bajo el mismo origen, no necesitas CORS.

---

## Opcion B: Todo con Docker (docker-compose)

Levanta los 3 servicios (PostgreSQL, Spring Boot, Nginx + Angular) con un
solo comando desde la raiz del proyecto:

```bash
docker compose up --build
```

- PostgreSQL queda en el puerto `5432`.
- Spring Boot queda accesible solo dentro de la red de Docker (puerto
  `8080`, sin publicarlo al host).
- Nginx (sirviendo el build de Angular + proxy a `/api`) queda publicado en
  `http://localhost`.

La configuracion de base de datos del backend se toma de variables de
entorno (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`), definidas
en `docker-compose.yml`. Para correrlo local (Opcion A) no necesitas
definirlas: los valores por defecto en `application.yaml` siguen siendo
`localhost:5432 / estudiantes_db / postgres / 1234`.

---

## Estructura de carpetas relevante

```
proyecto-completo/
├── docker-compose.yml
├── estudiantes-service/
│   ├── Dockerfile
│   └── src/...
└── sistema-escolar-frontend/
    ├── nginx.conf              <- usar con Nginx local (Opcion A)
    ├── proxy.conf.json         <- usado por "npm start" (ng serve)
    ├── docker/
    │   ├── Dockerfile.frontend  <- usado por docker-compose (Opcion B)
    │   └── nginx.docker.conf
    └── src/app/
        ├── models/estudiante.model.ts
        ├── services/estudiante.service.ts
        ├── estudiantes/estudiante-lista/      (tabla + busqueda + Excel)
        └── estudiantes/estudiante-formulario/ (drawer crear/editar)
```

## Notas

- El `EstudianteService` apunta a la ruta relativa `/api/estudiantes`, por lo
  que **nunca** hay que tocar el codigo Angular al cambiar de entorno: quien
  resuelve a donde va `/api` es siempre Nginx (o `proxy.conf.json` en
  desarrollo).
- Las validaciones del formulario (nombre, edad 1-120, telefono de 10
  digitos, correo, matricula, carrera, semestre 1-12) replican las
  anotaciones `@NotBlank/@Size/@Min/@Max/@Pattern/@Email` de la entidad
  `Estudiante.java`.
- El login/registro con `localStorage` del `index.html` original no se migro
  todavia (no estaba conectado al backend). Si lo quieres en Angular, se
  puede agregar despues como un `AuthService` + guard de rutas.
