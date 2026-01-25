# CheckToGo - Travel Planner

## Description
**CheckToGo** is a comprehensive web application designed for travel management, packing checklists, and location tracking. The system allows users to organize their trips in a SaaS model, ensuring all travel-related information is kept in one minimalist place.

## Features
- **Trip Management:** Create, edit, and delete trips with specific titles, descriptions, and dates.
- **Packing Lists:** Manage items categorized by types (e.g., Electronics, Clothes) with status tracking (packed/unpacked).
- **Places to Visit:** Track attractions and locations for each trip with "visited" status.
- **User Authentication:** Secure registration and login with password hashing.
- **Responsive Design:** Fully optimized for mobile and desktop views.

## Technology Stack
- **Database:** PostgreSQL.
- **Frontend:** Vite.
- **Backend (PSi):** Native PHP.
- **Backend (PAW):** Java with Spring Boot.
- **Containerization:** Docker & Docker Compose.

## Getting Started

### Prerequisites
- Docker & Docker Compose

### Clone the repository:
```bash
git clone https://github.com/Vadosmik/projekt_PSI_PAW.git
cd projekt_PSI_PAW
```
### Configure Services

#### Option A: Docker Compose (Recommended)
This mode is fully containerized. The backend services automatically receive database credentials via environment variables defined in `docker-compose.yml`.

1. **Select Backend**: Open `docker-compose.yml` and uncomment the service you want to run (`backend-php` or `api-java`). 
2. **Note for Java**: If you chose the Java backend, ensure you have built the JAR file first (see step 3 in Option B).
3. **Run**:
    ```bash
    docker-compose up --build
    ```
The Java container uses host.docker.internal to connect to the database host.

#### Option B: Local Development (IDE)

Use this mode if you want to run the Spring Boot application directly from your IDE or terminal for debugging.

1. **Database Config:** 

    Create a file `src/main/resources/application-local.yml` (this file is ignored by Git) and add your local PostgreSQL credentials:
    ```yml
    spring:
    datasource:
      url: jdbc:postgresql://localhost:5432/postgres
      username: postgres
      password: postgres
      driver-class-name: org.postgresql.Driver
      hikari:
        schema: project_java
    jpa:
      hibernate:
        ddl-auto: update
      properties:
        hibernate:
          dialect: org.hibernate.dialect.PostgreSQLDialect
    ```

2. **Build the Project:**

    ```bash
    ./gradlew clean build -x test
    ```

3. **Run Application:** 

    Run the main class in your IDE with the active profile `local` or use:
    ```bash
    ./gradlew bootRun --args='--spring.profiles.active=local'
    ```


### Start the services
```bash
# Build and launch the containers
docker-compose up --build
```

The dashboard will be available at: http://localhost:5173.

<!-- ## API Endpoints (Quick Reference)
The application follows a RESTful approach. Below are the primary endpoints: -->

## Author
* **Mikanovich Vadzim** - Student UMG **ID:** 51720.
* **Vadosmik** - [GitHub Profile](https://github.com/Vadosmik)

## License
This project is for educational purposes only.