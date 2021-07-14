import pg from 'pg';
import { config } from 'dotenv';
config()
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_PORT } = process.env;

const databaseConfig = {
    user: DB_USERNAME,
    host: DB_HOST,
    port: DB_PORT,
    database: DB_DATABASE,
    password: DB_PASSWORD,
};

const { Pool } = pg;
const connection = new Pool(
    process.env?.NODE_ENV === "development"
      ? databaseConfig
      : {
          connectionString: process.env.DATABASE_URL,
          ssl: {
            rejectUnauthorized: false,
          },
        }
  );

export default connection;
