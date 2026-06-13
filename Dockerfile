# Multi-stage Dockerfile to build and package order-service in this multi-module monorepo
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy parent and modules POMs
COPY pom.xml .
COPY order-service/pom.xml order-service/
COPY payment-service/pom.xml payment-service/
COPY kitchen-service/pom.xml kitchen-service/
COPY delivery-service/pom.xml delivery-service/

# Fetch dependencies (cached layer)
RUN mvn dependency:go-offline -B

# Copy source code of all modules
COPY order-service/src order-service/src
COPY payment-service/src payment-service/src
COPY kitchen-service/src kitchen-service/src
COPY delivery-service/src delivery-service/src

# Package all services
RUN mvn clean package -DskipTests

# JRE Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the built order-service jar
COPY --from=build /app/order-service/target/order-service-1.0.0-SNAPSHOT.jar app.jar

# Expose port 8081 for order-service
EXPOSE 8081

# Run the jar with production variables
ENTRYPOINT ["java", "-jar", "app.jar"]
