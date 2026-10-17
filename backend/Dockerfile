# ---- Build stage: compile the Spring Boot jar inside Docker ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -q -DskipTests package

# ---- Run stage: slim JRE ----
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/carrymate-0.1.0.jar app.jar

# Required at runtime (the app refuses to start without it):
#   -e AUTH_JWT_SECRET=$(openssl rand -hex 32)
# Optional overrides:
#   -e SPRING_PROFILES_ACTIVE=prod
#   -e APP_DEMO_SEED=false        (skip demo data; property app.demo-seed)
#   -e APP_CORS_ALLOWED_ORIGINS=https://<user>.github.io
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
