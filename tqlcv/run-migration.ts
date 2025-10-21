// Run database migration
import pool from './lib/db';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
    const client = await pool.connect();
    try {
        const migrationFile = path.join(__dirname, '../database/migrations/003_add_attachments.sql');
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

