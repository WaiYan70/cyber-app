require("dotenv").config();

const { Pool } = require("pg");

// if app is hosted in production, it will be true. 
// if app is hosted in development, it will be false. 
const isProduction = process.env.NODE_ENV === "production";

// podygresql connection
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

// if the app is in production and it is true, it's gonna process dot.env.databaseURL, otherwise we are going to use "connection string".
const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString
});

module.exports = { pool };