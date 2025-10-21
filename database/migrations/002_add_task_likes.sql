-- Migration: Add Task Likes Feature
-- Author: Nguyen Hai Ninh
-- Created: 2025-10-20
-- Description: Add task_likes table and update tasks table

-- =====================================================
-- CREATE TASK_LIKES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS task_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(task_id, user_id)
);

-- =====================================================
-- ADD INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_task_likes_task_id ON task_likes(task_id);
CREATE INDEX IF NOT EXISTS idx_task_likes_user_id ON task_likes(user_id);

-- =====================================================
-- ADD LIKES COLUMN TO TASKS TABLE
-- =====================================================

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;

-- =====================================================
-- CREATE TRIGGER TO AUTO-UPDATE TASK LIKES COUNT
-- =====================================================

CREATE OR REPLACE FUNCTION update_task_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE tasks SET likes = likes + 1 WHERE id = NEW.task_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE tasks SET likes = likes - 1 WHERE id = OLD.task_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_task_likes_count_trigger ON task_likes;

CREATE TRIGGER update_task_likes_count_trigger
    AFTER INSERT OR DELETE ON task_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_task_likes_count();

-- =====================================================
-- ADD PARENT_ID TO COMMENTS TABLE (FOR NESTED REPLIES)
-- =====================================================

ALTER TABLE comments ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES comments(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE task_likes IS 'Bảng like công việc';
COMMENT ON COLUMN tasks.likes IS 'Số lượng likes của công việc';
COMMENT ON COLUMN comments.parent_id IS 'ID của comment cha (cho nested replies)';

