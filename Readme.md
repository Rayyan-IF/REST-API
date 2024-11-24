# Express API App 🚀

**Express API app**! This API is built using **Express.js** and powered by a **PostgreSQL** database.

## Project Setup 🔧

### Database Schema

The database schema is included in the `schema.sql` file. You can use this file to set up the necessary tables and relationships for your PostgreSQL database. Simply execute the SQL commands in the `schema.sql` to initialize the database.

### Required Environment Variables

Before running the app, make sure to configure the following environment variables in your `.env` file:

#### Application Environment

- `APP_PORT`: The port number on which the app will run.
- `ACCESS_TOKEN_SECRET`: Secret key used for signing and verifying JWT access tokens.

#### Database Connection

- `DB_USER`: Your PostgreSQL database username.
- `DB_NAME`: The name of your PostgreSQL database.
- `DB_HOST`: The host of your PostgreSQL database.
- `DB_PORT`: The port where your PostgreSQL database is running.
- `DB_PASSWORD`: The password for your PostgreSQL database user.