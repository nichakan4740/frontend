### STAGE 1: Build ###
FROM node  AS build-stage
RUN /frontend
COPY package*.json ./
COPY . .
RUN npm install
RUN npm install vue-router@4
RUN install moment --save
ARG VITE_API_URL
ARG BASE_URL
RUN ["npm","run","build","--","--base","$BASE_URL"]

### STAGE 2: Run ###
FROM nginx as production-stage
COPY --from=build-stage /frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf


