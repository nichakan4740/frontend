### STAGE 1: Build ###
FROM node  AS build-stage
RUN mkdir -p /frontend
WORKDIR /frontend
COPY  package.json ./
RUN npm install
COPY . .
RUN npm run build
ARG VITE_API_URL
ARG BASE_URL
RUN ["npm","run","build","--","--base","$BASE_URL"]

### STAGE 2: Run ###
FROM nginx as production-stage
COPY --from=build-stage /frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf


