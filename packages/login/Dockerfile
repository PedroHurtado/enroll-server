FROM node:20-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar solo lo necesario
COPY packages/login/dist/ ./

# Instalar dependencias
RUN npm install

# Exponer el puerto 3000
EXPOSE 3000

# Ejecutar la aplicación
CMD ["node", "."]