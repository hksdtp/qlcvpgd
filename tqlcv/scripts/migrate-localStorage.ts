// Script to migrate localStorage data to PostgreSQL
// Author: Nguyen Hai Ninh
// Run this in browser console to export localStorage data

interface LocalStorageTask {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  department?: string;
  subtasks: Array<{
    id: string;
    title: string;
    completed: boolean;
    createdAt: string;
    completedAt?: string;
  }>;
  comments: Array<{
    id: string;
    content: string;
    author: {
      id: string;
      name: string;
      role: string;
    };
    createdAt: string;
    updatedAt?: string;
    likes: number;
    likedBy: string[];
    isEdited?: boolean;
  }>;
  createdAt: string;
  createdBy?: string;
  isRead?: boolean;
}

// Export localStorage data
function exportLocalStorageData() {
  const data: { [key: string]: any } = {};
  
  // Get all localStorage keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          data[key] = JSON.parse(value);
        }
      } catch (e) {
        data[key] = localStorage.getItem(key);
      }
    }
  }
  
  console.log('📦 LocalStorage Data:', data);
  
  // Download as JSON file
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `localStorage-backup-${new Date().toISOString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  return data;
}

// Extract tasks from localStorage
function extractTasks(): LocalStorageTask[] {
  const allTasks: LocalStorageTask[] = [];
  
  // Check all possible user keys
  const userIds = ['u1', 'u2', 'u3', 'u4'];
  
  for (const userId of userIds) {
    const key = `tasks_${userId}`;
    const tasksJson = localStorage.getItem(key);
    
    if (tasksJson) {
      try {
        const tasks = JSON.parse(tasksJson);
        console.log(`✅ Found ${tasks.length} tasks for user ${userId}`);
        allTasks.push(...tasks);
      } catch (e) {
        console.error(`❌ Error parsing tasks for user ${userId}:`, e);
      }
    }
  }
  
  // Also check generic tasks key
  const genericTasks = localStorage.getItem('tasks');
  if (genericTasks) {
    try {
      const tasks = JSON.parse(genericTasks);
      console.log(`✅ Found ${tasks.length} generic tasks`);
      allTasks.push(...tasks);
    } catch (e) {
      console.error('❌ Error parsing generic tasks:', e);
    }
  }
  
  // Remove duplicates by ID
  const uniqueTasks = Array.from(
    new Map(allTasks.map(task => [task.id, task])).values()
  );
  
  console.log(`📊 Total unique tasks: ${uniqueTasks.length}`);
  
  return uniqueTasks;
}

// Convert to PostgreSQL format
function convertToPostgreSQLFormat(tasks: LocalStorageTask[]) {
  const statusMap: { [key: string]: string } = {
    'Chưa làm': 'CHUA_LAM',
    'Lên Kế Hoạch': 'LEN_KE_HOACH',
    'Cần làm': 'CAN_LAM',
    'Đang làm': 'DANG_LAM',
    'Hoàn thành': 'HOAN_THANH',
    'Tồn đọng': 'TON_DONG',
    'Dừng': 'DUNG',
  };
  
  const priorityMap: { [key: string]: string } = {
    'CAO': 'CAO',
    'TRUNG BÌNH': 'TRUNG_BINH',
    'THẤP': 'THAP',
  };
  
  const departmentMap: { [key: string]: string } = {
    'Kinh Doanh': 'KINH_DOANH',
    'Sản xuất/ Kỹ Thuật': 'SAN_XUAT',
    'Hành Chính Nhân Sự': 'HANH_CHINH',
    'Marketing': 'MARKETING',
    'CV Chung': 'CV_CHUNG',
    'CV Khác': 'CV_KHAC',
  };
  
  return tasks.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description || null,
    status: statusMap[task.status] || 'CHUA_LAM',
    priority: task.priority ? priorityMap[task.priority] : 'TRUNG_BINH',
    department: task.department ? departmentMap[task.department] : null,
    createdById: task.createdBy || '550e8400-e29b-41d4-a716-446655440004', // Default to Ninh
    createdAt: task.createdAt,
    isRead: task.isRead || false,
    subtasks: task.subtasks || [],
    comments: task.comments || [],
  }));
}

// Main export function
function exportForMigration() {
  console.log('🚀 Starting localStorage migration export...');
  
  const tasks = extractTasks();
  const converted = convertToPostgreSQLFormat(tasks);
  
  const migrationData = {
    tasks: converted,
    exportedAt: new Date().toISOString(),
    totalTasks: converted.length,
  };
  
  console.log('📦 Migration Data:', migrationData);
  
  // Download as JSON
  const blob = new Blob([JSON.stringify(migrationData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `migration-data-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  console.log('✅ Migration data exported!');
  console.log('📋 Copy this to use in migration script:');
  console.log(JSON.stringify(migrationData, null, 2));
  
  return migrationData;
}

// Instructions
console.log(`
🔧 MIGRATION INSTRUCTIONS:

1. Open browser console (F12)
2. Run: exportForMigration()
3. Download the JSON file
4. Use the data to seed PostgreSQL database

Or copy the output and use it directly in the migration script.
`);

// Export functions to window for browser console access
if (typeof window !== 'undefined') {
  (window as any).exportLocalStorageData = exportLocalStorageData;
  (window as any).extractTasks = extractTasks;
  (window as any).exportForMigration = exportForMigration;
}

