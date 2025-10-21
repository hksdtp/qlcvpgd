// PostgreSQL Database Connection Pool
// Author: Nguyen Hai Ninh
// Full Vietnamese Support

import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Parse DATABASE_URL
const databaseUrl = process.env.DATABASE_URL || '';

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const url = new URL(databaseUrl);

const pool = new Pool({
  host: url.hostname,
  port: parseInt(url.port) || 5432,
  database: url.pathname.slice(1),
  user: url.username,
  password: url.password,
  max: 10, // Reduced from 20
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased from 2000 to 10000
  query_timeout: 30000, // Add query timeout
  statement_timeout: 30000, // Add statement timeout
  keepAlive: true, // Enable TCP keep-alive
  keepAliveInitialDelayMillis: 10000,
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;

