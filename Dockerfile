# ===== STAGE 1: Build =====
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copia solo il progetto vero
COPY energycommunities/pom.xml .
RUN mvn dependency:go-offline

COPY energycommunities/ .

# MODIFICA QUESTA RIGA:
# Da: RUN mvn clean package -DskipTests
# A:
RUN mvn clean verify

# ===== STAGE 2: Run =====
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Questo copierà il .jar creato dalla fase 'verify' (che include 'package')
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
