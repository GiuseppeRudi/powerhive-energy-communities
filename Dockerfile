# ===== STAGE 1: Build =====
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY energycommunities/pom.xml .
RUN mvn dependency:go-offline

COPY energycommunities/ .

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
