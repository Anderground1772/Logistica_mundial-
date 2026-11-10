# Etapa 1: Compilación de la aplicación de React
FROM registry.access.redhat.com/ubi9/nodejs-20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servidor web seguro compatible con OpenShift (S2I / UBI Nginx)
FROM registry.access.redhat.com/ubi9/nginx-122
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
