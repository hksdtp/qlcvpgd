/**
 * 🚀 Task Management Google Sheets Auto Setup Script
 * Tự động tạo và cấu hình Google Sheets cho ứng dụng Task Management
 * 
 * Cách sử dụng:
 * 1. Mở script.google.com
 * 2. Tạo project mới
 * 3. Paste code này vào
 * 4. Chạy function createTaskManagementSheet()
 * 5. Authorize permissions
 * 6. Kiểm tra logs để lấy Spreadsheet ID
 */

// ===== CONFIGURATION =====
const CONFIG = {
  SPREADSHEET_NAME: `Task Management Database - ${new Date().toLocaleDateString('vi-VN')}`,
  SHEET_NAME: 'Tasks',
  SAMPLE_DATA_COUNT: 10,
  DEPARTMENTS: ['Design', 'Development', 'Marketing', 'Documentation', 'Testing', 'Management'],
  STATUSES: ['todo', 'in-progress', 'completed'],
  COLORS: {
    HEADER: '#4F46E5',
    TODO: '#EF4444',
    IN_PROGRESS: '#F59E0B', 
    COMPLETED: '#10B981'
  }
};

// ===== MAIN SETUP FUNCTION =====
/**
 * 🎯 Main function - Chạy function này để tạo toàn bộ setup
 */
function createTaskManagementSheet() {
  try {
    console.log('🚀 Bắt đầu tạo Task Management Google Sheet...');
    
    // 1. Tạo spreadsheet mới
    const spreadsheet = SpreadsheetApp.create(CONFIG.SPREADSHEET_NAME);
    const spreadsheetId = spreadsheet.getId();
    const url = spreadsheet.getUrl();
    
    console.log(`✅ Đã tạo spreadsheet: ${CONFIG.SPREADSHEET_NAME}`);
    console.log(`📊 Spreadsheet ID: ${spreadsheetId}`);
    console.log(`🔗 URL: ${url}`);
    
    // 2. Setup Tasks sheet
    setupTasksSheet(spreadsheet);
    
    // 3. Thêm sample data
    addSampleData(spreadsheet);
    
    // 4. Format sheet
    formatSheet(spreadsheet);
    
    // 5. Setup data validation
    setupDataValidation(spreadsheet);
    
    // 6. Setup sharing permissions
    shareSheet(spreadsheet);
    
    // 7. Generate integration config
    generateIntegrationConfig(spreadsheetId, url);
    
    console.log('🎉 HOÀN THÀNH! Google Sheets đã sẵn sàng sử dụng.');
    console.log('📋 Kiểm tra logs để lấy thông tin integration.');
    
    return {
      spreadsheetId: spreadsheetId,
      url: url,
      success: true
    };
    
  } catch (error) {
    console.error('❌ Lỗi khi tạo sheet:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

// ===== SETUP FUNCTIONS =====

/**
 * 📋 Setup cấu trúc sheet Tasks
 */
function setupTasksSheet(spreadsheet) {
  console.log('📋 Đang setup Tasks sheet...');
  
  // Xóa sheet mặc định và tạo sheet Tasks
  const defaultSheet = spreadsheet.getSheets()[0];
  defaultSheet.setName(CONFIG.SHEET_NAME);
  
  const sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
  
  // Tạo headers
  const headers = [
    'id',
    'title', 
    'description',
    'status',
    'department',
    'subtasks',
    'createdAt',
    'updatedAt'
  ];
  
  // Set headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  
  // Resize columns
  sheet.setColumnWidth(1, 120); // id
  sheet.setColumnWidth(2, 200); // title
  sheet.setColumnWidth(3, 300); // description
  sheet.setColumnWidth(4, 100); // status
  sheet.setColumnWidth(5, 120); // department
  sheet.setColumnWidth(6, 400); // subtasks
  sheet.setColumnWidth(7, 150); // createdAt
  sheet.setColumnWidth(8, 150); // updatedAt
  
  console.log('✅ Tasks sheet đã được setup');
}

/**
 * 📊 Thêm sample data
 */
function addSampleData(spreadsheet) {
  console.log('📊 Đang thêm sample data...');
  
  const sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
  const sampleTasks = generateSampleTasks();
  
  // Convert tasks to rows
  const rows = sampleTasks.map(task => [
    task.id,
    task.title,
    task.description || '',
    task.status,
    task.department || '',
    JSON.stringify(task.subtasks || []),
    task.createdAt,
    new Date().toISOString() // updatedAt
  ]);
  
  // Add data starting from row 2
  if (rows.length > 0) {
    const dataRange = sheet.getRange(2, 1, rows.length, 8);
    dataRange.setValues(rows);
  }
  
  console.log(`✅ Đã thêm ${rows.length} sample tasks`);
}

/**
 * 🎨 Format sheet
 */
function formatSheet(spreadsheet) {
  console.log('🎨 Đang format sheet...');
  
  const sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
  
  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, 8);
  headerRange.setBackground(CONFIG.COLORS.HEADER);
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Format data rows
  const dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, 8);
  dataRange.setVerticalAlignment('top');
  dataRange.setWrap(true);
  
  // Conditional formatting for status column
  const statusRange = sheet.getRange(2, 4, sheet.getLastRow() - 1, 1);
  
  // Todo - Red
  const todoRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('todo')
    .setBackground('#FEE2E2')
    .setFontColor('#DC2626')
    .setRanges([statusRange])
    .build();
    
  // In Progress - Yellow  
  const progressRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('in-progress')
    .setBackground('#FEF3C7')
    .setFontColor('#D97706')
    .setRanges([statusRange])
    .build();
    
  // Completed - Green
  const completedRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('completed')
    .setBackground('#D1FAE5')
    .setFontColor('#059669')
    .setRanges([statusRange])
    .build();
  
  sheet.setConditionalFormatRules([todoRule, progressRule, completedRule]);
  
  console.log('✅ Sheet formatting hoàn thành');
}

/**
 * ✅ Setup data validation
 */
function setupDataValidation(spreadsheet) {
  console.log('✅ Đang setup data validation...');
  
  const sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
  
  // Status validation
  const statusValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(CONFIG.STATUSES)
    .setAllowInvalid(false)
    .setHelpText('Chọn: todo, in-progress, hoặc completed')
    .build();
    
  const statusRange = sheet.getRange(2, 4, 1000, 1); // Column D (status)
  statusRange.setDataValidation(statusValidation);
  
  // Department validation
  const deptValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(CONFIG.DEPARTMENTS)
    .setAllowInvalid(true)
    .setHelpText('Chọn department hoặc để trống')
    .build();
    
  const deptRange = sheet.getRange(2, 5, 1000, 1); // Column E (department)
  deptRange.setDataValidation(deptValidation);
  
  console.log('✅ Data validation đã được setup');
}

/**
 * 🔗 Setup sharing permissions
 */
function shareSheet(spreadsheet) {
  console.log('🔗 Đang setup sharing permissions...');

  try {
    // Set to anyone with link can view
    const file = DriveApp.getFileById(spreadsheet.getId());
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    console.log('✅ Sheet đã được share với "Anyone with link can view"');
  } catch (error) {
    console.warn('⚠️ Không thể tự động setup sharing. Vui lòng share manually.');
  }
}

/**
 * 📝 Generate integration config
 */
function generateIntegrationConfig(spreadsheetId, url) {
  console.log('📝 Generating integration config...');

  console.log('\n=== 🔧 INTEGRATION CONFIG ===');
  console.log(`Spreadsheet ID: ${spreadsheetId}`);
  console.log(`URL: ${url}`);
  console.log('\n=== 📋 .env.local CONFIG ===');
  console.log(`VITE_GOOGLE_SPREADSHEET_ID=${spreadsheetId}`);
  console.log('VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here');
  console.log('\n=== 📊 SHEET STRUCTURE ===');
  console.log('Sheet Name: Tasks');
  console.log('Columns: id | title | description | status | department | subtasks | createdAt | updatedAt');
  console.log('\n=== 🎯 NEXT STEPS ===');
  console.log('1. Copy Spreadsheet ID vào .env.local');
  console.log('2. Tạo Google Cloud API Key');
  console.log('3. Restart ứng dụng: npm run dev');
  console.log('4. Test integration tại http://localhost:3001');
}

/**
 * 🎲 Generate sample tasks
 */
function generateSampleTasks() {
  const tasks = [
    {
      id: 'task_1',
      title: 'Thiết kế giao diện người dùng chính',
      description: 'Tạo mockup và wireframe cho trang chủ ứng dụng',
      status: 'in-progress',
      department: 'Design',
      subtasks: [
        { id: 'sub_1_1', title: 'Research UI trends', completed: true },
        { id: 'sub_1_2', title: 'Create wireframes', completed: true },
        { id: 'sub_1_3', title: 'Design mockups', completed: false }
      ],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'task_2',
      title: 'Phát triển API backend',
      description: 'Xây dựng REST API cho quản lý tasks và users',
      status: 'todo',
      department: 'Development',
      subtasks: [
        { id: 'sub_2_1', title: 'Setup database schema', completed: false },
        { id: 'sub_2_2', title: 'Create API endpoints', completed: false },
        { id: 'sub_2_3', title: 'Write unit tests', completed: false }
      ],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'task_3',
      title: 'Viết tài liệu hướng dẫn sử dụng',
      description: 'Tạo user manual và developer documentation',
      status: 'completed',
      department: 'Documentation',
      subtasks: [
        { id: 'sub_3_1', title: 'User guide', completed: true },
        { id: 'sub_3_2', title: 'API documentation', completed: true }
      ],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'task_4',
      title: 'Tối ưu hóa hiệu suất ứng dụng',
      description: 'Cải thiện tốc độ load và responsive design',
      status: 'in-progress',
      department: 'Development',
      subtasks: [
        { id: 'sub_4_1', title: 'Code splitting', completed: true },
        { id: 'sub_4_2', title: 'Image optimization', completed: false },
        { id: 'sub_4_3', title: 'Bundle analysis', completed: false }
      ],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'task_5',
      title: 'Chiến lược marketing sản phẩm',
      description: 'Lập kế hoạch quảng bá và thu hút người dùng',
      status: 'todo',
      department: 'Marketing',
      subtasks: [
        { id: 'sub_5_1', title: 'Market research', completed: false },
        { id: 'sub_5_2', title: 'Content strategy', completed: false },
        { id: 'sub_5_3', title: 'Social media plan', completed: false }
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: 'task_6',
      title: 'Testing và QA toàn diện',
      description: 'Kiểm tra lỗi và đảm bảo chất lượng sản phẩm',
      status: 'todo',
      department: 'Testing',
      subtasks: [
        { id: 'sub_6_1', title: 'Unit testing', completed: false },
        { id: 'sub_6_2', title: 'Integration testing', completed: false },
        { id: 'sub_6_3', title: 'User acceptance testing', completed: false }
      ],
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    }
  ];

  return tasks;
}

/**
 * 🧹 Helper function - Xóa tất cả data (để test lại)
 */
function clearAllData() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);

  if (sheet) {
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, 8).clearContent();
      console.log('🧹 Đã xóa tất cả data');
    }
  }
}

/**
 * 🔄 Helper function - Refresh sample data
 */
function refreshSampleData() {
  clearAllData();
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  addSampleData(spreadsheet);
  console.log('🔄 Đã refresh sample data');
}
