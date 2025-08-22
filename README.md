# Simple Personal Finance Manager API

A robust and scalable backend service for a personal finance tracking application, built with NestJS. This API provides essential features for managing users, categories, and financial transactions, with a secure authentication system.

## ✨ Features

-   **User Management**: Secure user registration and authentication using JWT.
-   **Category Management**: Full CRUD (Create, Read, Update, Delete) functionality for personalized expense/income categories.
-   **Transaction Tracking**: Log, view, and manage financial transactions.
-   **API Documentation**: Interactive API documentation powered by Swagger (OpenAPI).
-   **Scalable Architecture**: Built with a modular structure to easily extend and maintain.

## 🛠️ Tech Stack

-   **Backend**: [NestJS](https://nestjs.com/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Database ORM**: [Prisma](https://www.prisma.io/)
-   **Database**: [MongoDB](https://www.mongodb.com/)
-   **Authentication**: [JWT (JSON Web Tokens)](https://jwt.io/)
-   **Validation**: [class-validator](https://github.com/typestack/class-validator) & [class-transformer](https://github.com/typestack/class-transformer)

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or newer)
-   [npm](https://www.npmjs.com/)
-   A running [MongoDB](https://www.mongodb.com/try/download/community) instance

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    https://github.com/majniko/SPFM-BE.git
    cd SPFM-BE
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following variables. Replace the placeholder values with your actual configuration.

    ```env
    # Your MongoDB connection string
    DATABASE_URL="mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"

    # A strong, secret key for signing JWTs
    JWT_SECRET="YOUR_SUPER_SECRET_KEY"
    ```

4.  **Generate the Prisma Client:**
    This command reads your `schema.prisma` file and generates the TypeScript types for your database models.
    ```bash
    npx prisma generate
    ```

5.  **Run the application:**
    ```bash
    npm run start:dev
    ```
    The server will start in watch mode, typically on `http://localhost:3000`.

##  API Documentation

This project uses Swagger to provide rich, interactive API documentation. Once the server is running, you can access the Swagger UI by navigating to:

**http://localhost:3000/api**

The documentation is automatically generated from the decorators in the controllers and DTOs. It allows you to view all available endpoints, see their expected request/response structures, and even try them out directly from your browser.

## Project Structure

The application is organized into modules to maintain a clean and scalable architecture:

-   `src/core`: Contains core functionalities like Prisma integration and configuration.
-   `src/domains/identity`: Handles user management (`users`) and authentication (`auth`).
-   `src/domains/finance`: Manages core business logic like `categories` and `transactions`.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.