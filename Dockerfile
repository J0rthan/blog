# ---------- build frontend ----------
    FROM node:20-alpine AS fe-builder
    WORKDIR /app/frontend
    COPY frontend/package*.json ./
    RUN npm ci
    COPY frontend/ ./
    RUN npm run build
    
    # ---------- build backend ----------
    FROM maven:3.9-eclipse-temurin-21 AS be-builder
    WORKDIR /app/backend
    COPY backend/pom.xml ./
    RUN mvn -q -DskipTests dependency:go-offline
    COPY backend/ ./
    RUN mvn -q -DskipTests package
    
    # ---------- runtime ----------
    FROM nginx:1.27-alpine
    
    # 安装 JRE + envsubst 所需 gettext
    RUN apk add --no-cache openjdk21-jre gettext
    
    # 前端 dist -> nginx html
    COPY --from=fe-builder /app/frontend/dist /usr/share/nginx/html
    
    # 后端 jar
    COPY --from=be-builder /app/backend/target/*.jar /app/app.jar
    
    # nginx 配置
    COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
    
    # 启动脚本
    COPY deploy/start.sh /start.sh
    RUN chmod +x /start.sh
    
    ENV PORT=10000
    EXPOSE 10000
    
    CMD ["/start.sh"]