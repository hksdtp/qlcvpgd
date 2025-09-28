#!/usr/bin/env node

/**
 * 🚀 Node.js Script - Alternative Google Sheets Setup
 * Tạo Google Sheets từ command line sử dụng Google APIs
 * 
 * Requirements:
 * - Node.js
 * - Google Service Account credentials
 * - googleapis package
 * 
 * Usage:
 * npm install googleapis
 * node scripts/create-google-sheet.js
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  SPREADSHEET_NAME: `Task Management Database - ${new Date().toLocaleDateString('vi-VN')}`,
  SHEET_NAME: 'Tasks',
  CREDENTIALS_PATH: './service-account-key.json', // Path to service account JSON
  SCOPES: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file'
  ]
};

// Sample tasks data
const SAMPLE_TASKS = [
  {
    id: 'task_1',
    title: 'Thiết kế giao diện người dùng chính',
    description: 'Tạo mockup và wireframe cho trang chủ ứng dụng',
    status: 'in-progress',
    department: 'Design',
    subtasks: JSON.stringify([
      { id: 'sub_1_1', title: 'Research UI trends', completed: true },
      { id: 'sub_1_2', title: 'Create wireframes', completed: true },
      { id: 'sub_1_3', title: 'Design mockups', completed: false }
    ]),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'task_2',
    title: 'Phát triển API backend',
    description: 'Xây dựng REST API cho quản lý tasks và users',
    status: 'todo',
    department: 'Development',
    subtasks: JSON.stringify([
      { id: 'sub_2_1', title: 'Setup database schema', completed: false },
      { id: 'sub_2_2', title: 'Create API endpoints', completed: false },
      { id: 'sub_2_3', title: 'Write unit tests', completed: false }
    ]),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'task_3',
    title: 'Viết tài liệu hướng dẫn sử dụng',
    description: 'Tạo user manual và developer documentation',
    status: 'completed',
    department: 'Documentation',
    subtasks: JSON.stringify([
      { id: 'sub_3_1', title: 'User guide', completed: true },
      { id: 'sub_3_2', title: 'API documentation', completed: true }
    ]),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'task_4',
    title: 'Tối ưu hóa hiệu suất ứng dụng',
    description: 'Cải thiện tốc độ load và responsive design',
    status: 'in-progress',
    department: 'Development',
    subtasks: JSON.stringify([
      { id: 'sub_4_1', title: 'Code splitting', completed: true },
      { id: 'sub_4_2', title: 'Image optimization', completed: false },
      { id: 'sub_4_3', title: 'Bundle analysis', completed: false }
    ]),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'task_5',
    title: 'Chiến lược marketing sản phẩm',
    description: 'Lập kế hoạch quảng bá và thu hút người dùng',
    status: 'todo',
    department: 'Marketing',
    subtasks: JSON.stringify([
      { id: 'sub_5_1', title: 'Market research', completed: false },
      { id: 'sub_5_2', title: 'Content strategy', completed: false },
      { id: 'sub_5_3', title: 'Social media plan', completed: false }
    ]),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

/**
 * 🔐 Authenticate with Google APIs
 */
async function authenticate() {
  try {
    if (!fs.existsSync(CONFIG.CREDENTIALS_PATH)) {
      throw new Error(`Service account file not found: ${CONFIG.CREDENTIALS_PATH}`);
    }

    const credentials = JSON.parse(fs.readFileSync(CONFIG.CREDENTIALS_PATH, 'utf8'));
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: CONFIG.SCOPES,
    });

    return await auth.getClient();
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    throw error;
  }
}

/**
 * 📊 Create spreadsheet
 */
async function createSpreadsheet(auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  
  try {
    console.log('📊 Creating spreadsheet...');
    
    const response = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: CONFIG.SPREADSHEET_NAME,
        },
        sheets: [{
          properties: {
            title: CONFIG.SHEET_NAME,
          }
        }]
      },
    });

    const spreadsheetId = response.data.spreadsheetId;
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
    
    console.log(`✅ Spreadsheet created: ${CONFIG.SPREADSHEET_NAME}`);
    console.log(`📋 Spreadsheet ID: ${spreadsheetId}`);
    console.log(`🔗 URL: ${url}`);
    
    return { spreadsheetId, url, sheets };
  } catch (error) {
    console.error('❌ Failed to create spreadsheet:', error.message);
    throw error;
  }
}

/**
 * 📝 Setup headers and data
 */
async function setupSheetData(sheets, spreadsheetId) {
  try {
    console.log('📝 Setting up headers and data...');
    
    // Headers
    const headers = [
      'id', 'title', 'description', 'status', 
      'department', 'subtasks', 'createdAt', 'updatedAt'
    ];
    
    // Convert sample tasks to rows
    const rows = [
      headers,
      ...SAMPLE_TASKS.map(task => [
        task.id,
        task.title,
        task.description,
        task.status,
        task.department,
        task.subtasks,
        task.createdAt,
        task.updatedAt
      ])
    ];
    
    // Update sheet with data
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${CONFIG.SHEET_NAME}!A1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: rows,
      },
    });
    
    console.log(`✅ Added ${SAMPLE_TASKS.length} sample tasks`);
  } catch (error) {
    console.error('❌ Failed to setup data:', error.message);
    throw error;
  }
}

/**
 * 🎨 Format spreadsheet
 */
async function formatSpreadsheet(sheets, spreadsheetId) {
  try {
    console.log('🎨 Formatting spreadsheet...');
    
    const requests = [
      // Format header row
      {
        repeatCell: {
          range: {
            sheetId: 0,
            startRowIndex: 0,
            endRowIndex: 1,
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 0.31, green: 0.27, blue: 0.9 },
              textFormat: {
                foregroundColor: { red: 1, green: 1, blue: 1 },
                bold: true,
              },
              horizontalAlignment: 'CENTER',
            },
          },
          fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
        },
      },
      // Freeze header row
      {
        updateSheetProperties: {
          properties: {
            sheetId: 0,
            gridProperties: {
              frozenRowCount: 1,
            },
          },
          fields: 'gridProperties.frozenRowCount',
        },
      },
      // Auto-resize columns
      {
        autoResizeDimensions: {
          dimensions: {
            sheetId: 0,
            dimension: 'COLUMNS',
            startIndex: 0,
            endIndex: 8,
          },
        },
      },
    ];
    
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests },
    });
    
    console.log('✅ Formatting completed');
  } catch (error) {
    console.error('❌ Failed to format spreadsheet:', error.message);
    throw error;
  }
}

/**
 * 🔗 Share spreadsheet
 */
async function shareSpreadsheet(auth, spreadsheetId) {
  try {
    console.log('🔗 Setting up sharing permissions...');
    
    const drive = google.drive({ version: 'v3', auth });
    
    await drive.permissions.create({
      fileId: spreadsheetId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
    
    console.log('✅ Spreadsheet shared with "Anyone with link can view"');
  } catch (error) {
    console.warn('⚠️ Failed to setup sharing permissions:', error.message);
  }
}

/**
 * 📋 Generate integration config
 */
function generateConfig(spreadsheetId, url) {
  console.log('\n=== 🔧 INTEGRATION CONFIG ===');
  console.log(`Spreadsheet ID: ${spreadsheetId}`);
  console.log(`URL: ${url}`);
  console.log('\n=== 📋 .env.local CONFIG ===');
  console.log(`VITE_GOOGLE_SPREADSHEET_ID=${spreadsheetId}`);
  console.log('VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here');
  console.log('\n=== 🎯 NEXT STEPS ===');
  console.log('1. Copy Spreadsheet ID to .env.local');
  console.log('2. Create Google Cloud API Key');
  console.log('3. Restart app: npm run dev');
  console.log('4. Test at http://localhost:3001');
  
  // Save config to file
  const config = {
    spreadsheetId,
    url,
    timestamp: new Date().toISOString(),
    envConfig: {
      VITE_GOOGLE_SPREADSHEET_ID: spreadsheetId,
      VITE_GOOGLE_SHEETS_API_KEY: 'your_api_key_here'
    }
  };
  
  fs.writeFileSync('google-sheets-config.json', JSON.stringify(config, null, 2));
  console.log('💾 Config saved to google-sheets-config.json');
}

/**
 * 🚀 Main function
 */
async function main() {
  try {
    console.log('🚀 Starting Google Sheets setup...');
    
    // 1. Authenticate
    const auth = await authenticate();
    
    // 2. Create spreadsheet
    const { spreadsheetId, url, sheets } = await createSpreadsheet(auth);
    
    // 3. Setup data
    await setupSheetData(sheets, spreadsheetId);
    
    // 4. Format spreadsheet
    await formatSpreadsheet(sheets, spreadsheetId);
    
    // 5. Share spreadsheet
    await shareSpreadsheet(auth, spreadsheetId);
    
    // 6. Generate config
    generateConfig(spreadsheetId, url);
    
    console.log('\n🎉 SUCCESS! Google Sheets setup completed.');
    
  } catch (error) {
    console.error('\n❌ FAILED:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, CONFIG };
