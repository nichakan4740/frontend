### STAGE 1: Build ###
FROM node  AS build
RUN mkdir -p /frontend
WORKDIR /frontend
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

### STAGE 2: Run ###
FROM nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /frontend/dist /usr/share/nginx/html
EXPOSE 80


