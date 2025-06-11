# Aplicación de Prueba de The Cat API

Esta aplicación consiste en una API REST backend (Express/Node.js) y una SPA frontend (Angular) que interactúan con The Cat API para mostrar información sobre razas de gatos y permitir la gestión de usuarios.

## Configuración de Docker
# Servicio Externo de The Cat API
La aplicación está contenerizada usando Docker para facilitar su despliegue y mantener consistencia entre entornos.

### Prerequisitos

- Docker y Docker Compose instalados en su sistema
- Clave API de The Cat API (regístrese en https://thecatapi.com/ para obtener una)

### Configuración del Entorno

1. Copie el archivo de entorno de ejemplo:
   ```
   cp .env.example .env
   ```

2. Edite el archivo `.env` y complete sus valores específicos:
   - `JWT_SECRET`: Una cadena segura aleatoria para firmar los tokens JWT
   - `CAT_API_KEY`: Su clave API de The Cat API

### Ejecución con Docker Compose

Para iniciar todos los servicios (MongoDB, backend y frontend):

```bash
docker-compose up -d
```

La aplicación estará disponible en:
- Frontend: http://localhost:80
- API Backend: http://localhost:3000

Para detener todos los servicios:

```bash
docker-compose down
```

Si desea reconstruir los contenedores después de realizar cambios:

```bash
docker-compose up -d --build
```

### Configuración Individual de Contenedores

Si desea construir y ejecutar contenedores individualmente:

#### Backend (API Express)

```bash
cd thecatapi-rest
docker build -t thecatapi-backend .
docker run -p 3000:3000 --env-file ../.env thecatapi-backend
```

#### Frontend (Angular)

```bash
cd thecatapi-web
docker build -t thecatapi-frontend .
docker run -p 80:80 thecatapi-frontend
```

## Características de la Aplicación

- Registro de usuarios y autenticación
- Información del perfil de usuario
- Navegación por razas de gatos
- Búsqueda de razas específicas de gatos
- Visualización de información detallada sobre razas
- Visualización de imágenes de razas específicas

## Arquitectura

La aplicación sigue los principios de arquitectura limpia:
- Frontend: Angular con componentes independientes e inyección de dependencias
- Backend: Express.js con arquitectura limpia (controladores, casos de uso, repositorios)
- Base de datos: MongoDB para persistencia de datos
