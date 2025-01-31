# Usa Node 20 en Alpine
FROM node:20-alpine AS builder

# Activa PNPM
RUN corepack enable && corepack prepare pnpm@latest --activate

# Establece el directorio de trabajo
WORKDIR /app

# Copia solo package.json y pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Fuerza una instalación sin symlinks
RUN pnpm install --frozen-lockfile --shamefully-hoist --no-verify-store-integrity

# Copia el resto del código fuente
COPY . .

# Compila si es necesario
RUN pnpm build

# Usa una imagen más ligera para producción
FROM node:20-alpine AS runner
WORKDIR /app

# Copia solo lo necesario
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expone el puerto
EXPOSE 3000

# Comando de inicio
CMD ["node", "dist/index.js"]
