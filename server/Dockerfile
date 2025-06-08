# Stage 1: Build the app using Maven
FROM maven:3.9-eclipse-temurin-17 as builder

WORKDIR /app

# Copy the full project into the builder container
COPY . .

# Build the JAR (skip tests to speed it up)
RUN mvn clean package -DskipTests

# ────────────────────────────────────────────────

# Stage 2: Use a slim JDK image to run the app
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy the generated JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the port your Spring Boot app runs on
EXPOSE 8080

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
