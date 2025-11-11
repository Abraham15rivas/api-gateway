# ===============================================
# STAGE 1: BUILD (Instalar dependencias)
# ===============================================
FROM node:20-slim AS builder

# 1. Crear directorio de trabajo
WORKDIR /usr/src/app

# 2. Copiar archivos de definición
COPY package*.json ./

# 3. Instalar dependencias
# El flag --only=production es opcional, pero ayuda a aligerar si solo tienes dependencias de producción.
RUN npm install

# 4. Copiar código fuente
# Esto incluye tu archivo principal (ej. app.js o server.js) y las carpetas de rutas/config.
COPY . .


# ===============================================
# STAGE 2: PRODUCTION (Imagen final y ligera)
# ===============================================
FROM node:20-slim AS production

# 1. Crear directorio de trabajo
WORKDIR /usr/src/app

# 2. Copiar archivos del builder (solo las dependencias de producción y el código)
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
# Copia todos tus archivos JS, rutas, y configuración
COPY --from=builder /usr/src/app/app.js ./app.js
COPY --from=builder /usr/src/app/routes ./routes
COPY --from=builder /usr/src/app/config ./config

# 3. Configurar el puerto de la aplicación (Documentación)
ENV PORT 4000
EXPOSE 4000

# 4. Comando de inicio
# Usamos 'node' directamente. Si tu archivo principal es 'app.js', úsalo.
# Asegúrate de que el script de inicio de tu app (donde tienes el app.listen) sea este archivo.
CMD [ "node", "app.js" ]