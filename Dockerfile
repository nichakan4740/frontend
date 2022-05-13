### STAGE 1: Build ###
FROM node  AS build-stage
RUN mkdir -p /frontend
WORKDIR /frontend
COPY  package.json ./
RUN npm install
COPY . .
RUN npm run build

### STAGE 2: Run ###
FROM nginx as production-stage
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /frontend/dist /usr/share/nginx/html



