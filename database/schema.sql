-- TASKGD Database Schema
-- Author: Nguyen Hai Ninh
-- Created: 2025-10-18
-- Description: Schema cho hệ thống quản lý công việc phòng giám đốc

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

-- Task Status
CREATE TYPE task_status AS ENUM (
    'Chưa làm',
    'Lên Kế Hoạch',
    'Cần làm',
    'Đang làm',
    'Hoàn thành',
    'Tồn đọng',
    'Dừng'
);

-- Task Priority
CREATE TYPE task_priority AS ENUM (
    'CAO',
    'TRUNG BÌNH',
    'THẤP'
);

-- User Role
CREATE TYPE user_role AS ENUM (
    'admin',
    'manager',
    'marketing_lead',
    'member'
);

-- Department
CREATE TYPE department AS ENUM (
    'Kinh Doanh',
    'Sản xuất/ Kỹ Thuật',
    'Hành Chính Nhân Sự',
    'Marketing',
    'CV Chung',
    'CV Khác'
);

-- =====================================================
-- TABLES
-- =====================================================

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    role user_role NOT NULL DEFAULT 'member',
    allowed_departments department[] DEFAULT '{}',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Tasks Table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status task_status NOT NULL DEFAULT 'Chưa làm',
    priority task_priority DEFAULT 'TRUNG BÌNH',
    department department,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE,
    
    -- Indexes
    CONSTRAINT tasks_title_not_empty CHECK (LENGTH(TRIM(title)) > 0)
);

-- Subtasks Table
CREATE TABLE subtasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT subtasks_title_not_empty CHECK (LENGTH(TRIM(title)) > 0)
);

-- Comments Table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_edited BOOLEAN DEFAULT FALSE,
    likes INTEGER DEFAULT 0,
    
    CONSTRAINT comments_content_not_empty CHECK (LENGTH(TRIM(content)) > 0)
);

-- Comment Likes Table (Many-to-Many)
CREATE TABLE comment_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(comment_id, user_id)
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Tasks indexes
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_department ON tasks(department);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX idx_tasks_is_read ON tasks(is_read);

-- Subtasks indexes
CREATE INDEX idx_subtasks_task_id ON subtasks(task_id);
CREATE INDEX idx_subtasks_completed ON subtasks(completed);

-- Comments indexes
CREATE INDEX idx_comments_task_id ON comments(task_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- Comment Likes indexes
CREATE INDEX idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX idx_comment_likes_user_id ON comment_likes(user_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update comment likes count
CREATE OR REPLACE FUNCTION update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE comments SET likes = likes + 1 WHERE id = NEW.comment_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE comments SET likes = likes - 1 WHERE id = OLD.comment_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_comment_likes_count_trigger
    AFTER INSERT OR DELETE ON comment_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_comment_likes_count();

-- Auto-update subtask completed_at
CREATE OR REPLACE FUNCTION update_subtask_completed_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.completed = TRUE AND OLD.completed = FALSE THEN
        NEW.completed_at = NOW();
    ELSIF NEW.completed = FALSE AND OLD.completed = TRUE THEN
        NEW.completed_at = NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subtask_completed_at_trigger
    BEFORE UPDATE ON subtasks
    FOR EACH ROW
    EXECUTE FUNCTION update_subtask_completed_at();

-- =====================================================
-- VIEWS
-- =====================================================

-- Task Summary View
CREATE OR REPLACE VIEW task_summary AS
SELECT 
    t.id,
    t.title,
    t.status,
    t.priority,
    t.department,
    t.created_at,
    u.name AS created_by_name,
    COUNT(DISTINCT s.id) AS total_subtasks,
    COUNT(DISTINCT CASE WHEN s.completed THEN s.id END) AS completed_subtasks,
    COUNT(DISTINCT c.id) AS total_comments
FROM tasks t
LEFT JOIN users u ON t.created_by = u.id
LEFT JOIN subtasks s ON t.id = s.task_id
LEFT JOIN comments c ON t.id = c.task_id
GROUP BY t.id, u.name;

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Insert default users
INSERT INTO users (id, name, email, role, allowed_departments) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Sếp Hạnh', 'hanh@company.com', 'admin', 
     ARRAY['Kinh Doanh', 'Sản xuất/ Kỹ Thuật', 'Hành Chính Nhân Sự', 'Marketing', 'CV Chung', 'CV Khác']::department[]),
    ('550e8400-e29b-41d4-a716-446655440002', 'Mr Hùng', 'hung@company.com', 'manager', 
     ARRAY['Kinh Doanh', 'Sản xuất/ Kỹ Thuật', 'Hành Chính Nhân Sự', 'Marketing', 'CV Chung']::department[]),
    ('550e8400-e29b-41d4-a716-446655440003', 'Ms Nhung', 'nhung@company.com', 'marketing_lead', 
     ARRAY['Marketing', 'CV Chung']::department[]),
    ('550e8400-e29b-41d4-a716-446655440004', 'Ninh', 'ninh@company.com', 'member', 
     ARRAY['Kinh Doanh', 'Sản xuất/ Kỹ Thuật', 'Hành Chính Nhân Sự', 'Marketing', 'CV Chung', 'CV Khác']::department[])
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE users IS 'Bảng người dùng hệ thống';
COMMENT ON TABLE tasks IS 'Bảng công việc chính';
COMMENT ON TABLE subtasks IS 'Bảng công việc con';
COMMENT ON TABLE comments IS 'Bảng bình luận';
COMMENT ON TABLE comment_likes IS 'Bảng like bình luận';

COMMENT ON COLUMN tasks.is_read IS 'Trạng thái đã đọc/chưa đọc (Gmail-style)';
COMMENT ON COLUMN comments.is_edited IS 'Đánh dấu comment đã được chỉnh sửa';

