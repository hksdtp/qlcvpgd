# TASKGD Database

Database cho hệ thống quản lý công việc phòng giám đốc.

## 📊 Database Information

```yaml
Database: taskgd_db
Host: 100.115.191.19 (Tailscale)
Port: 5432
User: nihdev
Password: haininh1
Version: PostgreSQL 16.10 (Docker)
```

## 🗂️ Schema Overview

### Tables

1. **users** - Người dùng hệ thống
2. **tasks** - Công việc chính
3. **subtasks** - Công việc con
4. **comments** - Bình luận
5. **comment_likes** - Like bình luận

### Enums

- `task_status`: Chưa làm, Lên Kế Hoạch, Cần làm, Đang làm, Hoàn thành, Tồn đọng, Dừng
- `task_priority`: CAO, TRUNG BÌNH, THẤP
- `user_role`: admin, manager, marketing_lead, member
- `department`: Kinh Doanh, Sản xuất/ Kỹ Thuật, Hành Chính Nhân Sự, Marketing, CV Chung, CV Khác

### Views

- `task_summary` - Tổng hợp thông tin task với subtasks và comments

## 🚀 Quick Start

### Apply Schema

```bash
# From Mac
PGPASSWORD=haininh1 psql -h 100.115.191.19 -U nihdev -d taskgd_db -f database/schema.sql

# From Server
docker exec -i postgresql-16 psql -U nihdev -d taskgd_db < /data/Ninh/projects/taskgd/database/schema.sql
```

### Connect to Database

```bash
# From Mac
PGPASSWORD=haininh1 psql -h 100.115.191.19 -U nihdev -d taskgd_db

# From Server
docker exec -it postgresql-16 psql -U nihdev -d taskgd_db
```

## 📝 Common Queries

### Get all tasks with summary

```sql
SELECT * FROM task_summary ORDER BY created_at DESC;
```

### Get tasks by department

```sql
SELECT * FROM tasks WHERE department = 'Marketing' ORDER BY created_at DESC;
```

### Get tasks by status

```sql
SELECT * FROM tasks WHERE status = 'Đang làm' ORDER BY priority DESC;
```

### Get user's tasks

```sql
SELECT t.*, u.name AS creator_name
FROM tasks t
LEFT JOIN users u ON t.created_by = u.id
WHERE t.created_by = '550e8400-e29b-41d4-a716-446655440004'
ORDER BY t.created_at DESC;
```

## 🔧 Maintenance

### Backup Database

```bash
# Full backup
docker exec postgresql-16 pg_dump -U nihdev taskgd_db > backup-$(date +%Y%m%d).sql

# Schema only
docker exec postgresql-16 pg_dump -U nihdev -s taskgd_db > schema-$(date +%Y%m%d).sql

# Data only
docker exec postgresql-16 pg_dump -U nihdev -a taskgd_db > data-$(date +%Y%m%d).sql
```

### Restore Database

```bash
cat backup.sql | docker exec -i postgresql-16 psql -U nihdev -d taskgd_db
```

### Reset Database

```bash
# Drop and recreate
PGPASSWORD=haininh1 psql -h 100.115.191.19 -U nihdev -d postgres -c "DROP DATABASE IF EXISTS taskgd_db;"
PGPASSWORD=haininh1 psql -h 100.115.191.19 -U nihdev -d postgres -c "CREATE DATABASE taskgd_db OWNER nihdev;"
PGPASSWORD=haininh1 psql -h 100.115.191.19 -U nihdev -d taskgd_db -f database/schema.sql
```

## 👥 Default Users

| ID | Name | Role | Departments |
|----|------|------|-------------|
| 550e8400-e29b-41d4-a716-446655440001 | Sếp Hạnh | admin | All |
| 550e8400-e29b-41d4-a716-446655440002 | Mr Hùng | manager | All except CV Khác |
| 550e8400-e29b-41d4-a716-446655440003 | Ms Nhung | marketing_lead | Marketing, CV Chung |
| 550e8400-e29b-41d4-a716-446655440004 | Ninh | member | All |

## 🔐 Connection Strings

### Development (Mac)

```bash
DATABASE_URL=postgresql://nihdev:haininh1@100.115.191.19:5432/taskgd_db
```

### Production (Server)

```bash
DATABASE_URL=postgresql://nihdev:haininh1@localhost:5432/taskgd_db
```

### Environment Variables

```bash
DB_HOST=100.115.191.19  # or localhost on server
DB_PORT=5432
DB_USER=nihdev
DB_PASSWORD=haininh1
DB_NAME=taskgd_db
```

## 📚 Schema Details

### users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    role user_role NOT NULL,
    allowed_departments department[],
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN
);
```

### tasks Table

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status task_status NOT NULL,
    priority task_priority,
    department department,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    is_read BOOLEAN
);
```

## 🎯 Features

### Auto-Update Timestamps

- `updated_at` tự động cập nhật khi record thay đổi
- `completed_at` tự động set khi subtask completed

### Auto-Update Likes Count

- `likes` count tự động tăng/giảm khi có like/unlike

### Cascading Deletes

- Xóa task → xóa tất cả subtasks và comments
- Xóa comment → xóa tất cả likes

### Constraints

- Title không được rỗng
- Content không được rỗng
- Email unique

## 📊 Statistics Queries

### Task Statistics by Status

```sql
SELECT 
    status,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM tasks
GROUP BY status
ORDER BY count DESC;
```

### Task Statistics by Department

```sql
SELECT 
    department,
    COUNT(*) as total_tasks,
    COUNT(CASE WHEN status = 'Hoàn thành' THEN 1 END) as completed_tasks,
    ROUND(COUNT(CASE WHEN status = 'Hoàn thành' THEN 1 END) * 100.0 / COUNT(*), 2) as completion_rate
FROM tasks
WHERE department IS NOT NULL
GROUP BY department
ORDER BY total_tasks DESC;
```

### User Activity

```sql
SELECT 
    u.name,
    COUNT(DISTINCT t.id) as tasks_created,
    COUNT(DISTINCT c.id) as comments_made,
    COUNT(DISTINCT cl.id) as likes_given
FROM users u
LEFT JOIN tasks t ON u.id = t.created_by
LEFT JOIN comments c ON u.id = c.author_id
LEFT JOIN comment_likes cl ON u.id = cl.user_id
GROUP BY u.id, u.name
ORDER BY tasks_created DESC;
```

## 🔍 Useful Commands

```sql
-- List all tables
\dt

-- Describe table structure
\d tasks

-- List all indexes
\di

-- List all triggers
\dy

-- Show table sizes
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(tablename::text)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::text) DESC;
```

