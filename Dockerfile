FROM node:17-alpine as builder

WORKDIR /vue-ui

# Copy the package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the files
COPY . .

# Build the project
RUN npm run build


FROM nginx:alpine as production-build
COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

RUN apk add --update python3 py3-pip
RUN apk add certbot certbot-nginx
RUN pip install certbot-nginx
RUN apk add --no-cache bash

# Copy from the stahg 1
COPY --from=builder /vue-ui/dist /usr/share/nginx/html

EXPOSE 80
EXPOSE 443
ENTRYPOINT ["nginx", "-g", "daemon off;"]