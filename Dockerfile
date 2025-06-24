FROM node:20-alpine as build
COPY . /app
WORKDIR /app

# Accept the Mapbox API key as a build argument
ARG MAPBOX_ACCESS_TOKEN
# Set it as an environment variable for the build process
ENV VITE_MAPBOX_ACCESS_TOKEN=$MAPBOX_ACCESS_TOKEN

RUN npm i
RUN npm run build
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf  

EXPOSE 8080
CMD ["nginx","-g","daemon off;"]