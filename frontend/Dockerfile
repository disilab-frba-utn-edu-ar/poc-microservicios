# --- ETAPA 1: CONSTRUCCIÓN (Build) ---
# Usamos una imagen de Node 20 (LTS) que soluciona tu problema de versión de Vite
FROM node:20-alpine AS builder

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos package.json y package-lock.json (o yarn.lock, etc.)
COPY package.json package-lock.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Ejecutamos el build de Vite
RUN npm run build

# --- ETAPA 2: SERVIDOR (Serve) ---
# Usamos un servidor Nginx súper ligero para servir los archivos estáticos
FROM nginx:1.27-alpine

# Exponemos el puerto 80 (el puerto por defecto de Nginx)
EXPOSE 80

# Copiamos los archivos estáticos construidos en la Etapa 1
# La salida de Vite está en la carpeta 'dist', la copiamos a la raíz web de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiamos nuestra configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf