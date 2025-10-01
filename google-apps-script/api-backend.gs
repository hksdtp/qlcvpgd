/**
 * 🚀 Google Apps Script API Backend
 * Provides full CRUD operations for Task Management App
 * 
 * Deploy as Web App:
 * 1. Save this script
 * 2. Deploy → New deployment
 * 3. Type: Web app
 * 4. Execute as: Me
 * 5. Who has access: Anyone
 * 6. Deploy → Copy Web App URL
 */

// ===== CONFIGURATION =====
const CONFIG = {
  SPREADSHEET_ID: '1nQVX_Jtwhwl3ApGlXuV6NthROZkejy6EMrFztw1k_vU', // Task Management Database - 27/9/2025
  SHEET_NAME: 'Tasks',
  CORS_ORIGINS: [
    'http://localhost:3001',
    'http://localhost:3000',
    'http://localhost:3003',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3003',
    'https://yourdomain.com' // Add your production domain
  ]
};

// ===== MAIN API HANDLER =====
/**
 * 🎯 Main function - handles all HTTP requests
 */
function doGet(e) {
  return handleRequest(e, 'GET');
}

function doPost(e) {
  return handleRequest(e, 'POST');
}

function doOptions(e) {
  return handleRequest(e, 'OPTIONS');
}

function handleRequest(e, method) {
  try {
    // Handle preflight OPTIONS request
    // Google Apps Script automatically adds CORS headers when deployed as Web App with "Anyone" access
    if (method === 'OPTIONS') {
      return ContentService
        .createTextOutput('')
        .setMimeType(ContentService.MimeType.TEXT);
    }

    // Get action from POST body or URL parameter
    let action = 'getTasks';
    if (method === 'POST' && e.postData && e.postData.contents) {
      try {
        const postData = JSON.parse(e.postData.contents);
        action = postData.action || 'getTasks';
      } catch (parseError) {
        console.error('Failed to parse POST data:', parseError);
        action = 'getTasks';
      }
    } else if (e && e.parameter && e.parameter.action) {
      action = e.parameter.action;
    }

    console.log(`📥 Processing ${method} request with action: ${action}`);

    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);

    // Setup headers if needed
    setupHeaders(sheet);

    let result;

    switch (action) {
      case 'getTasks':
        result = getTasks(sheet);
        break;
      case 'createTask':
        result = createTask(sheet, e);
        break;
      case 'updateTask':
        result = updateTask(sheet, e);
        break;
      case 'deleteTask':
        result = deleteTask(sheet, e);
        break;
      case 'healthCheck':
        result = { status: 'ok', timestamp: new Date().toISOString() };
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    const responseData = {
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    };

    // Check if JSONP callback is requested
    const callback = (e && e.parameter && e.parameter.callback);
    if (callback) {
      return ContentService
        .createTextOutput(`${callback}(${JSON.stringify(responseData)})`)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }

    // Google Apps Script automatically adds CORS headers when deployed as Web App with "Anyone" access
    return ContentService
      .createTextOutput(JSON.stringify(responseData))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('API Error:', error);

    const errorData = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };

    // Check if JSONP callback is requested
    const callback = (e && e.parameter && e.parameter.callback);
    if (callback) {
      return ContentService
        .createTextOutput(`${callback}(${JSON.stringify(errorData)})`)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }

    // Google Apps Script automatically adds CORS headers when deployed as Web App with "Anyone" access
    return ContentService
      .createTextOutput(JSON.stringify(errorData))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ===== CRUD OPERATIONS =====

/**
 * 📋 Setup sheet headers if needed
 */
function setupHeaders(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length === 0 || !data[0] || data[0].length < 10) {
    const headers = ['ID', 'Title', 'Description', 'Status', 'Priority', 'Department', 'Subtasks', 'CreatedAt', 'UpdatedAt', 'Comments'];
    sheet.clear();
    sheet.appendRow(headers);
    console.log('✅ Headers setup complete with Priority column');
  }
}

/**
 * �📖 Get all tasks
 */
function getTasks(sheet) {
  console.log('📖 Getting all tasks...');
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return []; // No data or only headers
  
  const headers = data[0];
  const tasks = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue; // Skip empty rows
    
    try {
      // Convert English status back to Vietnamese for frontend
      const englishStatus = row[3] || 'todo';

      // Map English statuses back to Vietnamese for display
      const statusMap = {
        'need-to-do': 'Cần làm',
        'todo': 'Chưa làm',
        'planning': 'Lên Kế Hoạch',
        'in-progress': 'Đang làm',
        'review': 'Đang Review',
        'completed': 'Hoàn thành',
        'on-hold': 'Tồn đọng',
        'paused': 'Dừng',
        'cancelled': 'Hủy bỏ'
      };

      const vietnameseStatus = statusMap[englishStatus] || 'Chưa làm';

      console.log(`🔄 Status conversion: "${englishStatus}" → "${vietnameseStatus}"`);

      const task = {
        id: row[0],
        title: row[1] || '',
        description: row[2] || '',
        status: vietnameseStatus, // Convert back to Vietnamese for frontend
        priority: row[4] || 'TRUNG BÌNH', // Priority field (default: TRUNG BÌNH)
        department: row[5] || '',
        subtasks: row[6] ? JSON.parse(row[6]) : [],
        createdAt: row[7] || new Date().toISOString(),
        updatedAt: row[8] || new Date().toISOString(),
        comments: row[9] ? JSON.parse(row[9]) : []
      };
      tasks.push(task);
    } catch (error) {
      console.warn(`Error parsing row ${i}:`, error);
    }
  }
  
  console.log(`✅ Retrieved ${tasks.length} tasks`);
  return tasks;
}

/**
 * ➕ Create new task
 */
function createTask(sheet, e) {
  console.log('➕ Creating new task...');

  let task;

  // Handle both POST and GET requests
  if (e.postData && e.postData.contents) {
    // POST request
    const postData = JSON.parse(e.postData.contents);
    task = postData.task;
  } else if (e.parameter && e.parameter.taskData) {
    // GET request with taskData parameter
    task = JSON.parse(decodeURIComponent(e.parameter.taskData));
  } else {
    throw new Error('No task data provided');
  }

  // Validate required fields
  if (!task.id || !task.title) {
    throw new Error('Missing required fields: id, title');
  }
  
  // Prepare row data with status mapping
  const now = new Date().toISOString();

  // Convert Vietnamese status to English for Google Sheets validation
  const statusMap = {
    'Cần làm': 'need-to-do',
    'Chưa làm': 'todo',
    'Lên Kế Hoạch': 'planning',
    'Đang làm': 'in-progress',
    'Đang Review': 'review',
    'Hoàn thành': 'completed',
    'Tồn đọng': 'on-hold',
    'Dừng': 'paused',
    'Hủy bỏ': 'cancelled'
  };

  const vietnameseStatus = task.status || 'Chưa làm';
  const englishStatus = statusMap[vietnameseStatus] || 'todo';

  console.log(`🔄 Create task status mapping: "${vietnameseStatus}" → "${englishStatus}"`);

  // Validate priority
  const validPriorities = ['CAO', 'TRUNG BÌNH', 'THẤP'];
  const priority = validPriorities.includes(task.priority) ? task.priority : 'TRUNG BÌNH';
  console.log(`🎯 Task priority: "${task.priority}" → "${priority}"`);

  const rowData = [
    task.id,
    task.title,
    task.description || '',
    englishStatus, // Use English status for Google Sheets
    priority, // Priority field
    task.department || '',
    JSON.stringify(task.subtasks || []),
    task.createdAt || now,
    now, // updatedAt
    JSON.stringify(task.comments || [])
  ];
  
  // Add to sheet
  sheet.appendRow(rowData);
  
  const createdTask = {
    ...task,
    createdAt: task.createdAt || now,
    updatedAt: now
  };
  
  console.log(`✅ Created task: ${task.title}`);
  return createdTask;
}

/**
 * ✏️ Update existing task
 */
function updateTask(sheet, e) {
  console.log('✏️ Updating task...');

  let task;

  // Handle both POST and GET requests
  if (e.postData && e.postData.contents) {
    // POST request
    const postData = JSON.parse(e.postData.contents);
    task = postData.task;
    console.log('📥 Received POST data:', JSON.stringify(postData, null, 2));
  } else if (e.parameter && e.parameter.taskData) {
    // GET request with taskData parameter
    task = JSON.parse(decodeURIComponent(e.parameter.taskData));
    console.log('📥 Received GET data:', JSON.stringify(task, null, 2));
  } else {
    throw new Error('No task data provided');
  }

  // Debug logging
  console.log('📋 Task subtasks:', task.subtasks?.length || 0, task.subtasks);
  console.log('💬 Task comments:', task.comments?.length || 0, task.comments);

  if (!task.id) {
    throw new Error('Missing required field: id');
  }
  
  // Find task row
  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === task.id) {
      rowIndex = i + 1; // Sheet rows are 1-indexed
      break;
    }
  }
  
  if (rowIndex === -1) {
    throw new Error(`Task not found: ${task.id}`);
  }
  
  // Update row data with enhanced logging
  const now = new Date().toISOString();

  // Convert Vietnamese status to English if needed (frontend should send English, but handle both)
  const statusMapViToEn = {
    'Cần làm': 'need-to-do',
    'Chưa làm': 'todo',
    'Lên Kế Hoạch': 'planning',
    'Đang làm': 'in-progress',
    'Đang Review': 'review',
    'Hoàn thành': 'completed',
    'Tồn đọng': 'on-hold',
    'Dừng': 'paused',
    'Hủy bỏ': 'cancelled'
  };

  // Check if status is Vietnamese or English
  let englishStatus = task.status;
  if (statusMapViToEn[task.status]) {
    // Status is Vietnamese, convert to English
    englishStatus = statusMapViToEn[task.status];
    console.log(`🔄 Status conversion (Vi→En): "${task.status}" → "${englishStatus}"`);
  } else {
    // Status is already English, validate it
    const validStatuses = ['need-to-do', 'todo', 'planning', 'in-progress', 'review', 'completed', 'on-hold', 'paused', 'cancelled'];
    englishStatus = validStatuses.includes(task.status) ? task.status : 'todo';
    console.log(`✅ Status validation: "${task.status}" → "${englishStatus}"`);
  }

  // Debug serialization
  const subtasksJson = JSON.stringify(task.subtasks || []);
  const commentsJson = JSON.stringify(task.comments || []);

  console.log('🔧 Serialization debug:');
  console.log('- Subtasks JSON length:', subtasksJson.length);
  console.log('- Comments JSON length:', commentsJson.length);
  console.log('- Subtasks JSON preview:', subtasksJson.substring(0, 200));
  console.log('- Comments JSON preview:', commentsJson.substring(0, 200));

  // Validate priority
  const validPriorities = ['CAO', 'TRUNG BÌNH', 'THẤP'];
  const priority = validPriorities.includes(task.priority) ? task.priority : 'TRUNG BÌNH';
  console.log(`🎯 Task priority: "${task.priority}" → "${priority}"`);

  const rowData = [
    task.id,
    task.title,
    task.description || '',
    englishStatus, // Use English status for Google Sheets
    priority, // Priority field
    task.department || '',
    subtasksJson,
    task.createdAt || now,
    now, // updatedAt
    commentsJson
  ];

  console.log('📝 Row data being written:', rowData.map((item, index) =>
    `${index}: ${typeof item} (${String(item).length} chars)`
  ));

  // Update sheet (now 10 columns including Priority)
  sheet.getRange(rowIndex, 1, 1, 10).setValues([rowData]);
  
  const updatedTask = {
    ...task,
    updatedAt: now
  };
  
  console.log(`✅ Updated task: ${task.title}`);
  return updatedTask;
}

/**
 * 🗑️ Delete task
 */
function deleteTask(sheet, e) {
  console.log('🗑️ Deleting task...');
  
  const taskId = e.parameter.taskId;
  
  if (!taskId) {
    throw new Error('Missing required parameter: taskId');
  }
  
  // Find task row
  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === taskId) {
      rowIndex = i + 1; // Sheet rows are 1-indexed
      break;
    }
  }
  
  if (rowIndex === -1) {
    throw new Error(`Task not found: ${taskId}`);
  }
  
  // Delete row
  sheet.deleteRow(rowIndex);
  
  console.log(`✅ Deleted task: ${taskId}`);
  return { id: taskId, deleted: true };
}

// ===== UTILITY FUNCTIONS =====

/**
 * 🧪 Test function - create sample task
 */
function testCreateTask() {
  const sampleTask = {
    id: `test_${Date.now()}`,
    title: 'Test Task from API',
    description: 'Created via Google Apps Script API',
    status: 'Chưa làm',
    department: 'Testing',
    subtasks: [
      { id: 'sub1', title: 'Test subtask', completed: false }
    ]
  };
  
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.SHEET_NAME);
  const result = createTask(sheet, {
    postData: {
      contents: JSON.stringify({ task: sampleTask })
    }
  });
  
  console.log('Test result:', result);
  return result;
}

/**
 * 🧪 Test function - get all tasks
 */
function testGetTasks() {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.SHEET_NAME);
  const tasks = getTasks(sheet);
  console.log(`Found ${tasks.length} tasks:`, tasks);
  return tasks;
}

/**
 * 🧪 Test function - update task with subtasks and comments
 */
function testUpdateTaskWithData() {
  console.log('🧪 Testing task update with subtasks and comments...');

  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.SHEET_NAME);

  // Get first task
  const tasks = getTasks(sheet);
  if (tasks.length === 0) {
    console.log('❌ No tasks found to test with');
    return;
  }

  const testTask = tasks[0];
  console.log(`✅ Testing with task: ${testTask.title} (${testTask.id})`);

  // Create test data
  const updatedTask = {
    ...testTask,
    title: 'UPDATED: Test Task với Subtasks và Comments',
    description: 'Đây là task test để kiểm tra subtasks và comments',
    subtasks: [
      {
        id: `s-${Date.now()}`,
        title: 'Subtask 1 - Hoàn thành báo cáo',
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: `s-${Date.now() + 1}`,
        title: 'Subtask 2 - Review và approve',
        completed: true,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      }
    ],
    comments: [
      {
        id: `c-${Date.now()}`,
        content: 'Comment test với tiếng Việt: ăn, ê, ô, ơ, ư, đ',
        author: {
          id: '1',
          name: 'Sếp Hạnh',
          role: 'admin'
        },
        createdAt: new Date().toISOString(),
        likes: 5,
        likedBy: ['2', '3', '4', '5', '6'],
        isEdited: true
      },
      {
        id: `c-${Date.now() + 1000}`,
        content: 'Comment mới không có like nào. Test zero state.',
        author: {
          id: '4',
          name: 'Ninh',
          role: 'member'
        },
        createdAt: new Date().toISOString(),
        likes: 0,
        likedBy: [],
        isEdited: false
      }
    ]
  };

  console.log(`📤 Updating task with ${updatedTask.subtasks.length} subtasks and ${updatedTask.comments.length} comments`);

  // Simulate the updateTask function
  const mockEvent = {
    parameter: {
      taskData: encodeURIComponent(JSON.stringify(updatedTask))
    }
  };

  try {
    const result = updateTask(sheet, mockEvent);
    console.log('✅ Update successful:', result);

    // Verify the update
    const verifyTasks = getTasks(sheet);
    const verifiedTask = verifyTasks.find(t => t.id === testTask.id);

    if (verifiedTask) {
      console.log(`✅ Verification: ${verifiedTask.subtasks?.length || 0} subtasks, ${verifiedTask.comments?.length || 0} comments`);
      return verifiedTask;
    } else {
      console.log('❌ Task not found after update');
    }

  } catch (error) {
    console.error('❌ Update failed:', error);
  }
}

/**
 * 📋 Get deployment info
 */
function getDeploymentInfo() {
  console.log('=== 🚀 DEPLOYMENT INFO ===');
  console.log(`Spreadsheet ID: ${CONFIG.SPREADSHEET_ID}`);
  console.log(`Sheet Name: ${CONFIG.SHEET_NAME}`);
  console.log('\n=== 📋 API ENDPOINTS ===');
  console.log('GET  ?action=getTasks');
  console.log('POST ?action=createTask (body: {task: {...}})');
  console.log('POST ?action=updateTask (body: {task: {...}})');
  console.log('GET  ?action=deleteTask&taskId=xxx');
  console.log('GET  ?action=healthCheck');
  console.log('\n=== 🎯 NEXT STEPS ===');
  console.log('1. Deploy as Web App');
  console.log('2. Copy Web App URL');
  console.log('3. Update frontend API_BASE_URL');
  console.log('4. Test CRUD operations');
}
