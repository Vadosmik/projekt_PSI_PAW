FROM openjdk:21-ea-23-jdk-bullseye
WORKDIR /app
COPY checktogo-api/build/libs/checktogo-api-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
