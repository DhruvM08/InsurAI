#1. Create base file
FROM eclipse-temurin:21-jdk

#2. Working Directory
WORKDIR /app

#3. Copy Jar file
COPY target/demo-0.0.1-SNAPSHOT.jar app.jar

#4.Expose port
EXPOSE 8080

 #5. Entry points

ENTRYPOINT ["java","-jar","app.jar"]

