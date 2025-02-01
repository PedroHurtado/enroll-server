FROM node:20-alpine AS builder
WORKDIR /app

# Copiar archivos de configuración del monorepo
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./

# Instalar PNPM a nivel global
RUN npm install -g pnpm

# Copiar todos los archivos de los paquetes
COPY packages/common/ ./packages/common/
COPY packages/login/ ./packages/login/

# Instalar dependencias sin modificar lockfile
RUN pnpm install --frozen-lockfile

# Construir el proyecto
RUN pnpm run build

FROM node:20-alpine AS runner
WORKDIR /app

# Copiar package.json y pnpm files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY --from=builder /app/packages/common/package.json ./packages/common/package.json
COPY --from=builder /app/packages/login/package.json ./packages/login/package.json

# Copiar los archivos compilados
COPY --from=builder /app/packages/common/dist ./packages/common/dist
COPY --from=builder /app/packages/login/dist ./packages/login/dist

# Instalar solo las dependencias de producción
RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile

# Exponer el puerto 3000
EXPOSE 3000

CMD ["node", "packages/login/dist/index.js"]