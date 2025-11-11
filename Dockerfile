# ===============================================
# STAGE 1: BUILD (Instalar dependencias)
# ===============================================
FROM node:22-slim AS builder

# 1. Crear directorio de trabajo
WORKDIR /usr/src/app

# 2. Copiar archivos de definición
COPY package*.json ./

# 3. Instalar dependencias
RUN npm install

# 4. Copiar código fuente
COPY . .

# ===============================================
# STAGE 2: PRODUCTION (Imagen final y ligera)
# ===============================================
FROM node:22-slim AS production

# 1. Crear directorio de trabajo
WORKDIR /usr/src/app

# 2. Copiar archivos del builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/app.js ./app.js
COPY --from=builder /usr/src/app/routes ./routes
COPY --from=builder /usr/src/app/config ./config

# 3. Configurar el puerto de la aplicación
ENV PORT=4000
EXPOSE 4000

# 4. Comando de inicio
CMD ["node", "app.js"]
