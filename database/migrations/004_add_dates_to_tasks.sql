-- Migration: Add start_date and due_date to tasks table
-- Date: 2025-10-20
-- Description: Add date fields for task scheduling

-- Add start_date column
ALTER TABLE tasks
ADD COLUMN start_date TIMESTAMP WITH TIME ZONE;

-- Add due_date column
ALTER TABLE tasks
ADD COLUMN due_date TIMESTAMP WITH TIME ZONE;

-- Add index for due_date for faster queries
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Add index for start_date for faster queries
CREATE INDEX idx_tasks_start_date ON tasks(start_date);

-- Add comment
COMMENT ON COLUMN tasks.start_date IS 'Task start date';
COMMENT ON COLUMN tasks.due_date IS 'Task deadline/due date';

