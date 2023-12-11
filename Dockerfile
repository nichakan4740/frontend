### STAGE 1: Build ###
FROM node:14.17.1  AS build-stage
RUN mkdir -p ./frontend
WORKDIR ./frontend
COPY ./frontend/package.json ./
RUN npm install
COPY . .
RUN npm run build
 
### STAGE 2: Run ###
FROM nginx:stable-alpine as production-stage
COPY ./frontend/nginx.conf :/etc/nginx/conf.d/default.conf
COPY --from=build ./frontend/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]




