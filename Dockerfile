### STAGE 1: Build ###
FROM node:14-alpine  AS builder
RUN mkdir -p /frontend
WORKDIR /frontend
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

### STAGE 2: Run ###
FROM nginx:1.13.12-alpine
COPY .nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


