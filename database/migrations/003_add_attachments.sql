-- Migration: Add attachments table
-- Created: 2025-10-20
-- Description: Add support for file attachments on tasks

-- Create attachments table
CREATE TABLE IF NOT EXISTS attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_attachments_task_id ON attachments(task_id);
CREATE INDEX IF NOT EXISTS idx_attachments_uploaded_by ON attachments(uploaded_by);

-- Add comment
COMMENT ON TABLE attachments IS 'File attachments for tasks';
COMMENT ON COLUMN attachments.file_name IS 'Original file name';
COMMENT ON COLUMN attachments.file_path IS 'Path to file on server';
COMMENT ON COLUMN attachments.file_type IS 'MIME type of file';
COMMENT ON COLUMN attachments.file_size IS 'File size in bytes';

