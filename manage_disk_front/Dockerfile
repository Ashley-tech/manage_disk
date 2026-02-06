FROM node:18-alpine

WORKDIR /app

# Installer les dépendances
COPY package.json package-lock.json* ./
RUN npm install

# Copier le reste
COPY . .

# Expo Web
EXPOSE 8079

# Lancer Expo en mode web
CMD ["npm", "run", "web"]
