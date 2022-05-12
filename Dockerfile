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
COPY nginx.conf /
COPY --from=build /frontend/dist /kw2/assets/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


