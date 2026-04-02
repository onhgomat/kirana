# Build Stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve Stage with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Note: we use default Nginx conf, which serves static on port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
