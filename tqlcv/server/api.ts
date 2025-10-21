// Express API Server for TASKGD - Raw SQL Version
// Author: Nguyen Hai Ninh
// Full Vietnamese Support

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import pool from '../lib/db';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.API_PORT || 3001;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext);
        cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow images and common document types
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|txt|zip|rar/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ cho phép upload ảnh và file văn bản!'));
        }
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from dist directory
const distPath = path.join(__dirname, '../dist');
console.log('📂 __dirname:', __dirname);
console.log('📂 distPath:', distPath);
app.use(express.static(distPath));

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: true });
  } catch (error) {
    res.status(500).json({ status: 'error', database: false });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        name, 
        email, 
        role, 
        allowed_departments as "allowedDepartments",
        avatar_url as "avatarUrl"
      FROM users 
      WHERE is_active = true
      ORDER BY name
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const { department, status } = req.query;
    
    let query = `
      SELECT
        t.id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.department,
        t.created_by as "createdBy",
        t.created_at as "createdAt",
        t.updated_at as "updatedAt",
        t.is_read as "isRead",
        t.likes,
        t.start_date as "startDate",
        t.due_date as "dueDate",
        u.name as "createdByName",

        -- Task likes as JSON array
        COALESCE(
          (
            SELECT json_agg(tl.user_id)
            FROM task_likes tl
            WHERE tl.task_id = t.id
          ),
          '[]'
        ) as "likedBy",

        -- Subtasks as JSON array
        COALESCE(
          (
            SELECT json_agg(
              jsonb_build_object(
                'id', s.id,
                'title', s.title,
                'completed', s.completed,
                'createdAt', s.created_at,
                'completedAt', s.completed_at
              )
            )
            FROM subtasks s
            WHERE s.task_id = t.id
          ),
          '[]'
        ) as subtasks,

        -- Comments as JSON array (using subquery to avoid duplicates)
        COALESCE(
          (
            SELECT json_agg(
              jsonb_build_object(
                'id', c.id,
                'content', c.content,
                'createdAt', c.created_at,
                'updatedAt', c.updated_at,
                'isEdited', c.is_edited,
                'likes', c.likes,
                'parentId', c.parent_id,
                'author', jsonb_build_object(
                  'id', cu.id,
                  'name', cu.name,
                  'role', cu.role
                ),
                'likedBy', COALESCE(
                  (
                    SELECT json_agg(cl.user_id)
                    FROM comment_likes cl
                    WHERE cl.comment_id = c.id
                  ),
                  '[]'
                )
              )
            )
            FROM comments c
            LEFT JOIN users cu ON c.author_id = cu.id
            WHERE c.task_id = t.id
          ),
          '[]'
        ) as comments

      FROM tasks t
      LEFT JOIN users u ON t.created_by = u.id
    `;
    
    const params: any[] = [];
    const conditions: string[] = [];
    
    if (department) {
      params.push(department);
      conditions.push(`t.department = $${params.length}`);
    }
    
    if (status) {
      params.push(status);
      conditions.push(`t.status = $${params.length}`);
    }
    
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += `
      ORDER BY t.created_at DESC
    `;
    
    const result = await pool.query(query, params);

    // Debug: Log comments for first task
    if (result.rows.length > 0) {
      console.log('📊 Sample task comments:', JSON.stringify(result.rows[0].comments, null, 2));
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get task by ID
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT
        t.id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.department,
        t.created_by as "createdBy",
        t.created_at as "createdAt",
        t.updated_at as "updatedAt",
        t.is_read as "isRead",

        COALESCE(
          (
            SELECT json_agg(
              jsonb_build_object(
                'id', s.id,
                'title', s.title,
                'completed', s.completed,
                'createdAt', s.created_at,
                'completedAt', s.completed_at
              )
            )
            FROM subtasks s
            WHERE s.task_id = t.id
          ),
          '[]'
        ) as subtasks,

        COALESCE(
          (
            SELECT json_agg(
              jsonb_build_object(
                'id', c.id,
                'content', c.content,
                'createdAt', c.created_at,
                'updatedAt', c.updated_at,
                'isEdited', c.is_edited,
                'likes', c.likes,
                'parentId', c.parent_id,
                'author', jsonb_build_object(
                  'id', cu.id,
                  'name', cu.name,
                  'role', cu.role
                ),
                'likedBy', COALESCE(
                  (
                    SELECT json_agg(cl.user_id)
                    FROM comment_likes cl
                    WHERE cl.comment_id = c.id
                  ),
                  '[]'
                )
              )
            )
            FROM comments c
            LEFT JOIN users cu ON c.author_id = cu.id
            WHERE c.task_id = t.id
          ),
          '[]'
        ) as comments

      FROM tasks t
      WHERE t.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// Create task
app.post('/api/tasks', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { title, description, status, priority, department, createdBy, subtasks, startDate, dueDate } = req.body;

    await client.query('BEGIN');

    // Insert task
    const taskResult = await client.query(`
      INSERT INTO tasks (title, description, status, priority, department, created_by, start_date, due_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      title,
      description || null,
      status || 'Chưa làm',
      priority || 'TRUNG BÌNH',
      department || null,
      createdBy || null,
      startDate || null,
      dueDate || null
    ]);

    const task = taskResult.rows[0];

    // Insert subtasks if provided
    if (subtasks && subtasks.length > 0) {
      for (const subtask of subtasks) {
        await client.query(`
          INSERT INTO subtasks (task_id, title, completed)
          VALUES ($1, $2, $3)
        `, [task.id, subtask.title, subtask.completed || false]);
      }
    }

    await client.query('COMMIT');

    // Fetch complete task with subtasks
    const completeTask = await pool.query(`
      SELECT 
        t.*,
        COALESCE(
          json_agg(
            jsonb_build_object(
              'id', s.id,
              'title', s.title,
              'completed', s.completed,
              'createdAt', s.created_at
            )
          ) FILTER (WHERE s.id IS NOT NULL),
          '[]'
        ) as subtasks
      FROM tasks t
      LEFT JOIN subtasks s ON t.id = s.task_id
      WHERE t.id = $1
      GROUP BY t.id
    `, [task.id]);

    res.status(201).json(completeTask.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  } finally {
    client.release();
  }
});

// Update task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, department, isRead, startDate, dueDate } = req.body;

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }
    if (priority !== undefined) {
      updates.push(`priority = $${paramCount++}`);
      values.push(priority);
    }
    if (department !== undefined) {
      updates.push(`department = $${paramCount++}`);
      values.push(department);
    }
    if (isRead !== undefined) {
      updates.push(`is_read = $${paramCount++}`);
      values.push(isRead);
    }
    if (startDate !== undefined) {
      updates.push(`start_date = $${paramCount++}`);
      values.push(startDate);
    }
    if (dueDate !== undefined) {
      updates.push(`due_date = $${paramCount++}`);
      values.push(dueDate);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);

    const result = await pool.query(`
      UPDATE tasks
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING *
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      DELETE FROM tasks WHERE id = $1 RETURNING id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// ==================== SUBTASKS ROUTES ====================

// Create subtask
app.post('/api/tasks/:taskId/subtasks', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, completed } = req.body;

    const result = await pool.query(`
      INSERT INTO subtasks (task_id, title, completed)
      VALUES ($1, $2, $3)
      RETURNING
        id,
        task_id as "taskId",
        title,
        completed,
        created_at as "createdAt",
        completed_at as "completedAt"
    `, [taskId, title, completed || false]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating subtask:', error);
    res.status(500).json({ error: 'Failed to create subtask' });
  }
});

// Update subtask
app.put('/api/tasks/:taskId/subtasks/:subtaskId', async (req, res) => {
  try {
    const { subtaskId } = req.params;
    const { title, completed } = req.body;

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }
    if (completed !== undefined) {
      updates.push(`completed = $${paramCount++}`);
      values.push(completed);
      if (completed) {
        updates.push(`completed_at = NOW()`);
      } else {
        updates.push(`completed_at = NULL`);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(subtaskId);

    const result = await pool.query(`
      UPDATE subtasks
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING
        id,
        task_id as "taskId",
        title,
        completed,
        created_at as "createdAt",
        completed_at as "completedAt"
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subtask not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating subtask:', error);
    res.status(500).json({ error: 'Failed to update subtask' });
  }
});

// Toggle subtask completion
app.post('/api/tasks/:taskId/subtasks/:subtaskId/toggle', async (req, res) => {
  try {
    const { subtaskId } = req.params;

    const result = await pool.query(`
      UPDATE subtasks
      SET
        completed = NOT completed,
        completed_at = CASE WHEN NOT completed THEN NOW() ELSE NULL END
      WHERE id = $1
      RETURNING
        id,
        task_id as "taskId",
        title,
        completed,
        created_at as "createdAt",
        completed_at as "completedAt"
    `, [subtaskId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subtask not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error toggling subtask:', error);
    res.status(500).json({ error: 'Failed to toggle subtask' });
  }
});

// Delete subtask
app.delete('/api/tasks/:taskId/subtasks/:subtaskId', async (req, res) => {
  try {
    const { subtaskId } = req.params;

    const result = await pool.query(`
      DELETE FROM subtasks WHERE id = $1 RETURNING id
    `, [subtaskId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subtask not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting subtask:', error);
    res.status(500).json({ error: 'Failed to delete subtask' });
  }
});

// ==================== COMMENTS ROUTES ====================

// Create comment
app.post('/api/tasks/:taskId/comments', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { content, authorId, parentId } = req.body;

    console.log('🔍 Create comment request:', { taskId, authorId, content, parentId, body: req.body });

    const result = await pool.query(`
      INSERT INTO comments (task_id, author_id, content, parent_id)
      VALUES ($1, $2, $3, $4)
      RETURNING
        id,
        content,
        created_at as "createdAt",
        updated_at as "updatedAt",
        is_edited as "isEdited",
        likes,
        parent_id as "parentId"
    `, [taskId, authorId, content, parentId || null]);

    console.log('✅ Comment saved to database:', result.rows[0]);

    // Get author info
    const author = await pool.query(`
      SELECT id, name, role FROM users WHERE id = $1
    `, [authorId]);

    const comment = {
      ...result.rows[0],
      author: author.rows[0],
      likedBy: []
    };

    console.log('✅ Returning comment to frontend:', comment);
    res.status(201).json(comment);
  } catch (error) {
    console.error('❌ Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Update comment
app.patch('/api/comments/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    console.log('🔍 Update comment request:', { commentId, content });

    const result = await pool.query(`
      UPDATE comments
      SET content = $1, is_edited = true, updated_at = NOW()
      WHERE id = $2
      RETURNING
        id,
        content,
        created_at as "createdAt",
        updated_at as "updatedAt",
        is_edited as "isEdited",
        likes,
        parent_id as "parentId",
        author_id as "authorId"
    `, [content, commentId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Get author info
    const author = await pool.query(`
      SELECT id, name, role FROM users WHERE id = $1
    `, [result.rows[0].authorId]);

    // Get likedBy
    const likes = await pool.query(`
      SELECT user_id FROM comment_likes WHERE comment_id = $1
    `, [commentId]);

    const comment = {
      ...result.rows[0],
      author: author.rows[0],
      likedBy: likes.rows.map(l => l.user_id)
    };

    console.log('✅ Comment updated:', comment);
    res.json(comment);
  } catch (error) {
    console.error('❌ Error updating comment:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// Delete comment
app.delete('/api/comments/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;

    console.log('🔍 Delete comment request:', { commentId });

    // Delete all replies first (cascade)
    await pool.query(`DELETE FROM comments WHERE parent_id = $1`, [commentId]);

    // Delete the comment
    const result = await pool.query(`
      DELETE FROM comments WHERE id = $1 RETURNING id
    `, [commentId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    console.log('✅ Comment deleted:', commentId);
    res.status(204).send();
  } catch (error) {
    console.error('❌ Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// Update comment
app.put('/api/tasks/:taskId/comments/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const result = await pool.query(`
      UPDATE comments
      SET content = $1, is_edited = true, updated_at = NOW()
      WHERE id = $2
      RETURNING
        id,
        content,
        created_at as "createdAt",
        updated_at as "updatedAt",
        is_edited as "isEdited",
        likes,
        author_id
    `, [content, commentId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Get author info
    const author = await pool.query(`
      SELECT id, name, role FROM users WHERE id = $1
    `, [result.rows[0].author_id]);

    // Get liked by
    const likedBy = await pool.query(`
      SELECT user_id FROM comment_likes WHERE comment_id = $1
    `, [commentId]);

    const comment = {
      ...result.rows[0],
      author: author.rows[0],
      likedBy: likedBy.rows.map(r => r.user_id)
    };

    delete comment.author_id;

    res.json(comment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// Delete comment
app.delete('/api/tasks/:taskId/comments/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;

    const result = await pool.query(`
      DELETE FROM comments WHERE id = $1 RETURNING id
    `, [commentId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// Like comment
app.post('/api/tasks/:taskId/comments/:commentId/like', async (req, res) => {
  const client = await pool.connect();

  try {
    const { commentId } = req.params;
    const { userId } = req.body;

    await client.query('BEGIN');

    // Check if already liked
    const existing = await client.query(`
      SELECT id FROM comment_likes WHERE comment_id = $1 AND user_id = $2
    `, [commentId, userId]);

    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Already liked' });
    }

    // Add like
    await client.query(`
      INSERT INTO comment_likes (comment_id, user_id)
      VALUES ($1, $2)
    `, [commentId, userId]);

    await client.query('COMMIT');

    // Get updated comment
    const comment = await pool.query(`
      SELECT
        c.id,
        c.content,
        c.created_at as "createdAt",
        c.updated_at as "updatedAt",
        c.is_edited as "isEdited",
        c.likes,
        json_build_object('id', u.id, 'name', u.name, 'role', u.role) as author,
        COALESCE(
          (SELECT json_agg(cl.user_id) FROM comment_likes cl WHERE cl.comment_id = c.id),
          '[]'
        ) as "likedBy"
      FROM comments c
      JOIN users u ON c.author_id = u.id
      WHERE c.id = $1
    `, [commentId]);

    res.json(comment.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error liking comment:', error);
    res.status(500).json({ error: 'Failed to like comment' });
  } finally {
    client.release();
  }
});

// Unlike comment
app.post('/api/tasks/:taskId/comments/:commentId/unlike', async (req, res) => {
  const client = await pool.connect();

  try {
    const { commentId } = req.params;
    const { userId } = req.body;

    await client.query('BEGIN');

    // Remove like
    const result = await client.query(`
      DELETE FROM comment_likes
      WHERE comment_id = $1 AND user_id = $2
      RETURNING id
    `, [commentId, userId]);

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Not liked yet' });
    }

    await client.query('COMMIT');

    // Get updated comment
    const comment = await pool.query(`
      SELECT
        c.id,
        c.content,
        c.created_at as "createdAt",
        c.updated_at as "updatedAt",
        c.is_edited as "isEdited",
        c.likes,
        json_build_object('id', u.id, 'name', u.name, 'role', u.role) as author,
        COALESCE(
          (SELECT json_agg(cl.user_id) FROM comment_likes cl WHERE cl.comment_id = c.id),
          '[]'
        ) as "likedBy"
      FROM comments c
      JOIN users u ON c.author_id = u.id
      WHERE c.id = $1
    `, [commentId]);

    res.json(comment.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error unliking comment:', error);
    res.status(500).json({ error: 'Failed to unlike comment' });
  } finally {
    client.release();
  }
});

// ==================== TASK LIKES ROUTES ====================

// Like task
app.post('/api/tasks/:taskId/like', async (req, res) => {
  const client = await pool.connect();

  try {
    const { taskId } = req.params;
    const { userId } = req.body;

    console.log('🔍 Like task request:', { taskId, userId, body: req.body });

    await client.query('BEGIN');

    // Check if already liked
    const existing = await client.query(`
      SELECT id FROM task_likes WHERE task_id = $1 AND user_id = $2
    `, [taskId, userId]);

    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Already liked' });
    }

    // Add like
    await client.query(`
      INSERT INTO task_likes (task_id, user_id)
      VALUES ($1, $2)
    `, [taskId, userId]);

    await client.query('COMMIT');

    // Get updated task likes count and likedBy array
    const result = await pool.query(`
      SELECT
        t.likes,
        COALESCE(
          (SELECT json_agg(tl.user_id) FROM task_likes tl WHERE tl.task_id = t.id),
          '[]'
        ) as "likedBy"
      FROM tasks t
      WHERE t.id = $1
    `, [taskId]);

    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error liking task:', error);
    res.status(500).json({ error: 'Failed to like task' });
  } finally {
    client.release();
  }
});

// Unlike task
app.post('/api/tasks/:taskId/unlike', async (req, res) => {
  const client = await pool.connect();

  try {
    const { taskId } = req.params;
    const { userId } = req.body;

    await client.query('BEGIN');

    // Remove like
    const result = await client.query(`
      DELETE FROM task_likes
      WHERE task_id = $1 AND user_id = $2
      RETURNING id
    `, [taskId, userId]);

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Not liked yet' });
    }

    await client.query('COMMIT');

    // Get updated task likes count and likedBy array
    const taskResult = await pool.query(`
      SELECT
        t.likes,
        COALESCE(
          (SELECT json_agg(tl.user_id) FROM task_likes tl WHERE tl.task_id = t.id),
          '[]'
        ) as "likedBy"
      FROM tasks t
      WHERE t.id = $1
    `, [taskId]);

    res.json(taskResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error unliking task:', error);
    res.status(500).json({ error: 'Failed to unlike task' });
  } finally {
    client.release();
  }
});

// =====================================================
// ATTACHMENTS ENDPOINTS
// =====================================================

// Upload attachment to task
app.post('/api/tasks/:taskId/attachments', upload.single('file'), async (req, res) => {
  const client = await pool.connect();
  try {
    const { taskId } = req.params;
    const { userId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('📎 Uploading attachment:', {
      taskId,
      userId,
      fileName: file.originalname,
      fileSize: file.size,
      fileType: file.mimetype
    });

    await client.query('BEGIN');

    // Insert attachment record
    const result = await client.query(`
      INSERT INTO attachments (task_id, file_name, file_path, file_type, file_size, uploaded_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        task_id as "taskId",
        file_name as "fileName",
        file_path as "filePath",
        file_type as "fileType",
        file_size as "fileSize",
        uploaded_by as "uploadedBy",
        created_at as "createdAt"
    `, [
      taskId,
      file.originalname,
      `/uploads/${file.filename}`,
      file.mimetype,
      file.size,
      userId
    ]);

    await client.query('COMMIT');

    console.log('✅ Attachment uploaded successfully:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error uploading attachment:', error);
    res.status(500).json({ error: 'Failed to upload attachment' });
  } finally {
    client.release();
  }
});

// Get attachments for a task
app.get('/api/tasks/:taskId/attachments', async (req, res) => {
  try {
    const { taskId } = req.params;

    const result = await pool.query(`
      SELECT
        a.id,
        a.task_id as "taskId",
        a.file_name as "fileName",
        a.file_path as "filePath",
        a.file_type as "fileType",
        a.file_size as "fileSize",
        a.uploaded_by as "uploadedBy",
        a.created_at as "createdAt",
        json_build_object(
          'id', u.id,
          'name', u.name,
          'email', u.email
        ) as uploader
      FROM attachments a
      LEFT JOIN users u ON a.uploaded_by = u.id
      WHERE a.task_id = $1
      ORDER BY a.created_at DESC
    `, [taskId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching attachments:', error);
    res.status(500).json({ error: 'Failed to fetch attachments' });
  }
});

// Delete attachment
app.delete('/api/attachments/:attachmentId', async (req, res) => {
  const client = await pool.connect();
  try {
    const { attachmentId } = req.params;

    await client.query('BEGIN');

    // Get file path before deleting
    const fileResult = await client.query(`
      SELECT file_path FROM attachments WHERE id = $1
    `, [attachmentId]);

    if (fileResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Attachment not found' });
    }

    const filePath = fileResult.rows[0].file_path;

    // Delete from database
    await client.query(`
      DELETE FROM attachments WHERE id = $1
    `, [attachmentId]);

    await client.query('COMMIT');

    // Delete file from disk
    const fullPath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log('🗑️ Deleted file:', fullPath);
    }

    res.json({ success: true });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting attachment:', error);
    res.status(500).json({ error: 'Failed to delete attachment' });
  } finally {
    client.release();
  }
});

// Serve index.html for all other routes (SPA fallback)
app.use((req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return next();
  }
  // Serve index.html for all other routes
  const indexPath = path.join(distPath, 'index.html');
  console.log('📄 Serving index.html from:', indexPath);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('❌ Error serving index.html:', err);
      res.status(500).json({ error: err.message, stack: err.stack });
    }
  });
});

// SPA fallback - MUST BE LAST (serve index.html for all non-API routes)
app.use((req, res, next) => {
  // Skip API routes and uploads
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  // Serve index.html for all other routes
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${process.env.DATABASE_URL?.split('@')[1]?.split('/')[0]}`);
  console.log(`🇻🇳 Vietnamese support: ENABLED`);
  console.log(`📁 Serving static files from: ${distPath}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});

export default app;

