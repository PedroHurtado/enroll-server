# Etapa 1: Builder
FROM node:20-alpine AS builder

# Configura variables de entorno de pnpm
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copia solo los archivos necesarios para instalar dependencias
COPY package.json pnpm-lock.yaml ./

# Instala dependencias con cache dedicada
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --shamefully-hoist

# Copia el resto de los archivos
COPY . .

# Build de producción
RUN pnpm build

# Etapa 2: Runtime
FROM node:20-alpine AS runner
WORKDIR /app

# Copia solo lo necesario para producción
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Configura usuario no-root
RUN chown -R node:node /app
USER node

# Salud del contenedor
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:3000/health')"

EXPOSE 3000
CMD ["node", "dist/index.js"]