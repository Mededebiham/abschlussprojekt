# Use an appropriate base image with Java installed
FROM openjdk:17-oracle

# Set the working directory inside the container
WORKDIR /backend

# Copy the compiled Java application JAR file into the container
COPY target/bank-0.0.1-SNAPSHOT.jar /backend/bank-0.0.1-SNAPSHOT.jar

# Expose the port your application runs on
EXPOSE 8088


# Command to run your application
CMD ["java", "-jar", "bank-0.0.1-SNAPSHOT.jar"]
