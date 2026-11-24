# CRM School

A CRM system for managing customers, orders, managers, and groups.

## Technologies

**Backend:**
- Python 3.14
- Django 6.1.2
- Django REST Framework 3.18.3
- MySQL
- Poetry 2.3.3
- SimpleJWT

**Frontend:**
- JavaScript
- React 19.3.1
- Create React App 5.0.1
- React Router DOM 7.18.5
- Axios 1.21.0
- React Hook Form 7.91.0

**Infrastructure:**
- Docker
- Docker Compose
- Nginx Alpine

## Requirements

Before running the project, install:

- [Git](https://git-scm.com/downloads)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js and npm](https://nodejs.org/)

Make sure Docker Desktop is running.

## Installation and Setup

### 1. Clone the repository

Open a terminal and execute:

```bash
git clone https://github.com/fronexxx/crm-school.git
cd crm-school
```

### 2. Install frontend dependencies and build the application

Open a terminal in the `frontend` directory:

```bash
cd frontend/
npm install
npm run build
```

After the build is complete, return to the project root:

```bash
cd ..
```

### 3. Build and start the project

From the project root directory, run:

```bash
docker compose up --build
```

Docker Compose will automatically build and start the backend and frontend services.

During startup, the backend automatically:

1. Waits for the database connection.
2. Applies database migrations.
3. Creates the default administrator account.
4. Generates 500 sample orders if the orders table is empty.
5. Starts the Django development server.

The frontend is served by Nginx.

## Access the Application

After successful startup, the application is available at:

- **CRM Application:** [http://localhost]
- **Backend API:** [http://localhost/api/]
- **API Documentation:** [http://localhost/api/doc]

## Default Administrator Account

The administrator account is created automatically during the first startup.

```text
Email: admin@gmail.com
Password: admin
```

## Postman Collection

The Postman collection is available in the repository:

`postman/crm-postman-collection.json`

Import this file into Postman to access the API requests and test the backend endpoints.