// Run database migration
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from tqlcv/.env
dotenv.config({ path: path.join(__dirname, '../tqlcv/.env') });

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
    const client = await pool.connect();
    try {
        const migrationFile = path.join(__dirname, 'migrations/003_add_attachments.sql');
        const sql = fs.readFileSync(migrationFile, 'utf8');
        
        console.log('🔄 Running migration: 003_add_attachments.sql');
        await client.query(sql);
        console.log('✅ Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

runMigration();

