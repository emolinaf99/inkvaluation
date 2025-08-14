# Usa una imagen oficial de Node.js
FROM node:20

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración y dependencias
COPY package*.json ./

# Instala dependencias (sin devDependencies en producción)
RUN npm install --production

# Copia el resto del código
COPY . .

# Expone el puerto que usa tu app (ajústalo si usas otro)
EXPOSE 2000

# Comando para ejecutar la aplicación
CMD ["node", "src/app.js"]