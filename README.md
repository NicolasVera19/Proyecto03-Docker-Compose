# Proyecto 03 — Aplicación multicontenedor

Aplicación académica para demostrar servicios, comunicación entre contenedores, volúmenes, puertos y redes usando Docker Compose.

## Arquitectura

- **visualizacion**: Node.js + Express, interfaz web en `http://localhost:3000`.
- **web**: API Flask en `http://localhost:5000`.
- **procesamiento**: API Flask interna en el puerto `5001`.
- **redis**: almacenamiento clave-valor persistente.

Los servicios se comunican por la red interna `red-proyecto`. Redis no se expone a internet; el puerto `6379` se publica únicamente en el equipo local para facilitar pruebas de clase.

## Requisitos

- Docker Desktop con el motor iniciado.
- Git.
- Cuenta de Docker Hub y cuenta de GitHub para la publicación.

## Ejecutar en Windows 11

Desde la carpeta raíz del proyecto, en la terminal de VS Code:

```powershell
docker compose config
docker compose up --build -d
docker compose ps
```

Abrir en el navegador:

- Interfaz: http://localhost:3000
- API web: http://localhost:5000
- Salud de web: http://localhost:5000/salud
- Redis desde web: http://localhost:5000/redis
- Salud de procesamiento desde web: http://localhost:5000/api/procesamiento/salud

En la interfaz, escribe una clave y un valor para guardarlo; luego consúltalo usando la misma clave. Los datos se guardan en Redis.

## Servicios, conexiones y persistencia

| Servicio | Puerto publicado | Depende de | Volumen |
|---|---:|---|---|
| visualizacion | 3000 | web, procesamiento | visualizacion_data |
| web | 5000 | procesamiento, redis | web_logs |
| procesamiento | solo interno 5001 | redis | procesamiento_data |
| redis | 6379 | — | redis_data |

Hay una red bridge común `red-proyecto`. Los volúmenes persisten datos/archivos al recrear contenedores. Redis utiliza AOF para persistencia.

## Pruebas por PowerShell

Comprobar estado:
```powershell
docker compose ps
```

Comprobar web:
```powershell
Invoke-RestMethod http://localhost:5000/salud
```

Comprobar Redis:
```powershell
Invoke-RestMethod http://localhost:5000/redis
```

Guardar dato:
```powershell
Invoke-RestMethod -Uri http://localhost:5000/api/datos -Method Post -ContentType "application/json" -Body '{"clave":"curso","valor":"Docker Compose"}'
```

Consultar dato:
```powershell
Invoke-RestMethod http://localhost:5000/api/datos/curso
```

Ver registros:
```powershell
docker compose logs --tail 100
```

Detener servicios sin borrar datos:
```powershell
docker compose down
```

Para borrar también los volúmenes (esto elimina los datos persistidos):
```powershell
docker compose down -v
```

## Publicar en GitHub

1. Crea un repositorio público vacío en GitHub.
2. En la carpeta raíz, reemplaza la URL del ejemplo por la URL de TU repositorio:

```powershell
git init
git add .
git commit -m "Proyecto 03: aplicación multicontenedor"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

No subas archivos `.env` con secretos.

## Publicar imágenes en Docker Hub

1. Crea un repositorio público en Docker Hub o usa tu nombre de usuario.
2. Copia `.env.example` a `.env` y edita `DOCKERHUB_USER` con tu usuario real.
3. Inicia sesión:
```powershell
docker login
```
4. Construye y publica las tres imágenes:
```powershell
docker compose build
docker compose push
```

Las imágenes se etiquetan como `TU_USUARIO/proyecto03-web:1.0`, `TU_USUARIO/proyecto03-visualizacion:1.0` y `TU_USUARIO/proyecto03-procesamiento:1.0`. Debes sustituir `DOCKERHUB_USER` por el usuario real antes de publicar. Redis utiliza la imagen pública oficial `redis:7-alpine`.

Para que otras personas ejecuten las imágenes publicadas, deben descargar el repositorio GitHub, configurar `.env` con el usuario de Docker Hub y ejecutar:
```powershell
docker compose pull
docker compose up -d
```

## Guion sugerido para el video de sustentación

1. Presentar el objetivo y la arquitectura de cuatro servicios.
2. Explicar `services`, `build` e `image`.
3. Mostrar los enlaces con `depends_on` y la comunicación por nombres DNS dentro de la red.
4. Explicar los puertos 3000, 5000, 5001 interno y 6379.
5. Mostrar la red `red-proyecto` y los cuatro volúmenes.
6. Ejecutar `docker compose config`, `docker compose up --build -d` y `docker compose ps`.
7. Abrir `http://localhost:3000`, guardar un dato y consultarlo.
8. Mostrar la publicación de imágenes en Docker Hub y el push del código a GitHub.
9. Cada integrante debe participar en la grabación según las indicaciones de la guía.

## Alcance y seguridad

Este es un proyecto didáctico, no un servicio listo para producción. No incluye autenticación, TLS, límites de recursos ni secretos gestionados. No publiques credenciales. La publicación en GitHub/Docker Hub y la grabación del video requieren realizar las acciones en tus cuentas y equipo.
