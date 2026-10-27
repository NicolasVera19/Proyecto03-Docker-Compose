# Guía breve de sustentación — Proyecto 03

## Objetivo
Mostrar una aplicación multicontenedor con Docker Compose y explicar cómo se definen servicios, conexiones, puertos, volúmenes y redes.

## Arquitectura
1. `visualizacion` usa Node.js/Express y entrega la interfaz en el puerto 3000.
2. `web` usa Python/Flask y expone una API en el puerto 5000.
3. `procesamiento` usa Python/Flask y escucha internamente en 5001.
4. `redis` almacena datos clave-valor y persiste su base en un volumen.

## Conceptos que debo explicar
- `services`: define cada contenedor lógico de la aplicación.
- `build`: construye la imagen a partir del Dockerfile de cada carpeta.
- `ports`: publica un puerto del contenedor en el equipo anfitrión.
- `expose`: documenta el puerto interno del servicio sin publicarlo al anfitrión.
- `depends_on`: indica orden de inicio, pero por sí solo no garantiza que el servicio esté listo.
- `networks`: permite que los servicios se encuentren por nombre dentro de Docker.
- `volumes`: conserva datos/archivos fuera del ciclo de vida del contenedor.
- `restart: unless-stopped`: permite que Docker reinicie el contenedor si se detiene inesperadamente.

## Demostración
1. `docker compose config`
2. `docker compose up --build -d`
3. `docker compose ps`
4. Abrir `http://localhost:3000`
5. Guardar una clave y valor en la interfaz y consultar la misma clave.
6. `docker compose logs --tail 50`
7. Explicar cómo publicar las imágenes y el repositorio.

## Recordatorio
La rúbrica pide que todos los integrantes participen y que se muestre el proceso de publicación en GitHub y Docker Hub. No afirmar que está publicado hasta completar y comprobar ambos procesos.
