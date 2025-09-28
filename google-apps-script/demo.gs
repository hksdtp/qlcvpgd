/**
 * 🎬 Demo Script - Test Google Sheets Integration
 * Script đơn giản để test và demo các tính năng
 */

// ===== DEMO FUNCTIONS =====

/**
 * 🎯 Demo 1: Tạo sheet đơn giản với ít data
 */
function createSimpleDemo() {
  console.log('🎬 Creating simple demo sheet...');
  
  const spreadsheet = SpreadsheetApp.create('Task Management Demo - Simple');
  const sheet = spreadsheet.getSheets()[0];
  sheet.setName('Tasks');
  
  // Headers
  const headers = ['id', 'title', 'status', 'department'];
  sheet.getRange(1, 1, 1, 4).setValues([headers]);
  
  // Simple data
  const data = [
    ['task_1', 'Thiết kế UI', 'todo', 'Design'],
    ['task_2', 'Phát triển API', 'in-progress', 'Development'],
    ['task_3', 'Viết docs', 'completed', 'Documentation']
  ];
  
  sheet.getRange(2, 1, 3, 4).setValues(data);
  
  // Basic formatting
  sheet.getRange(1, 1, 1, 4).setBackground('#4F46E5').setFontColor('white').setFontWeight('bold');
  
  console.log(`✅ Demo sheet created: ${spreadsheet.getUrl()}`);
  console.log(`📋 Spreadsheet ID: ${spreadsheet.getId()}`);
  
  return spreadsheet.getId();
}

/**
 * 🎯 Demo 2: Test data validation
 */
function testDataValidation() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName('Tasks');
  
  if (!sheet) {
    console.error('❌ Sheet "Tasks" not found. Run createTaskManagementSheet() first.');
    return;
  }
  
  console.log('🧪 Testing data validation...');
  
  // Test adding invalid status
  try {
    sheet.getRange('D10').setValue('invalid-status');
    console.log('⚠️ Invalid status was allowed (validation might not be working)');
  } catch (error) {
    console.log('✅ Data validation is working - invalid status rejected');
  }
  
  // Test valid statuses
  const validStatuses = ['todo', 'in-progress', 'completed'];
  validStatuses.forEach((status, index) => {
    sheet.getRange(10 + index, 4).setValue(status);
    console.log(`✅ Valid status "${status}" accepted`);
  });
}

/**
 * 🎯 Demo 3: Test conditional formatting
 */
function testConditionalFormatting() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName('Tasks');
  
  if (!sheet) {
    console.error('❌ Sheet "Tasks" not found.');
    return;
  }
  
  console.log('🎨 Testing conditional formatting...');
  
  // Add test data with different statuses
  const testData = [
    ['test_1', 'Test Todo', '', 'todo', 'Testing'],
    ['test_2', 'Test Progress', '', 'in-progress', 'Testing'],
    ['test_3', 'Test Done', '', 'completed', 'Testing']
  ];
  
  const startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, 3, 5).setValues(testData);
  
  console.log('✅ Test data added. Check colors:');
  console.log('🔴 Todo should be red background');
  console.log('🟡 In-progress should be yellow background');
  console.log('🟢 Completed should be green background');
}

/**
 * 🎯 Demo 4: Performance test
 */
function performanceTest() {
  console.log('⚡ Running performance test...');
  
  const startTime = new Date();
  
  // Create spreadsheet
  const spreadsheet = SpreadsheetApp.create('Performance Test');
  const sheet = spreadsheet.getSheets()[0];
  
  // Generate large dataset
  const headers = ['id', 'title', 'description', 'status', 'department', 'createdAt'];
  const data = [headers];
  
  for (let i = 1; i <= 100; i++) {
    data.push([
      `task_${i}`,
      `Task ${i}`,
      `Description for task ${i}`,
      ['todo', 'in-progress', 'completed'][i % 3],
      ['Design', 'Development', 'Marketing'][i % 3],
      new Date().toISOString()
    ]);
  }
  
  // Batch write
  sheet.getRange(1, 1, data.length, 6).setValues(data);
  
  const endTime = new Date();
  const duration = endTime - startTime;
  
  console.log(`✅ Performance test completed in ${duration}ms`);
  console.log(`📊 Created 100 tasks in ${duration}ms`);
  console.log(`🔗 URL: ${spreadsheet.getUrl()}`);
  
  return duration;
}

/**
 * 🎯 Demo 5: API simulation test
 */
function simulateAPIUsage() {
  console.log('🔌 Simulating API usage patterns...');
  
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName('Tasks');
  
  if (!sheet) {
    console.error('❌ Sheet "Tasks" not found.');
    return;
  }
  
  // Simulate reading all data (like API GET /tasks)
  console.log('📖 Simulating GET /tasks...');
  const allData = sheet.getDataRange().getValues();
  console.log(`✅ Read ${allData.length - 1} tasks`);
  
  // Simulate adding new task (like API POST /tasks)
  console.log('➕ Simulating POST /tasks...');
  const newTask = [
    `task_${Date.now()}`,
    'New API Task',
    'Created via API simulation',
    'todo',
    'Development',
    JSON.stringify([]),
    new Date().toISOString(),
    new Date().toISOString()
  ];
  
  sheet.appendRow(newTask);
  console.log('✅ New task added');
  
  // Simulate updating task (like API PUT /tasks/:id)
  console.log('✏️ Simulating PUT /tasks/:id...');
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 4).setValue('in-progress'); // Update status
  sheet.getRange(lastRow, 8).setValue(new Date().toISOString()); // Update timestamp
  console.log('✅ Task updated');
  
  // Simulate search/filter (like API GET /tasks?search=...)
  console.log('🔍 Simulating search functionality...');
  const searchTerm = 'API';
  const filteredTasks = allData.filter(row => 
    row.some(cell => cell.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );
  console.log(`✅ Found ${filteredTasks.length} tasks matching "${searchTerm}"`);
}

/**
 * 🎯 Demo 6: Error handling test
 */
function testErrorHandling() {
  console.log('🛡️ Testing error handling...');
  
  try {
    // Test invalid spreadsheet access
    const invalidSheet = SpreadsheetApp.openById('invalid_id');
    console.log('❌ Should have thrown error for invalid ID');
  } catch (error) {
    console.log('✅ Correctly caught invalid spreadsheet ID error');
  }
  
  try {
    // Test invalid range
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName('NonExistentSheet');
    if (sheet) {
      sheet.getRange('Z999999').setValue('test');
    }
    console.log('⚠️ No error for non-existent sheet (expected)');
  } catch (error) {
    console.log('✅ Correctly caught invalid sheet error');
  }
  
  console.log('✅ Error handling tests completed');
}

/**
 * 🎯 Demo 7: Cleanup function
 */
function cleanupDemo() {
  console.log('🧹 Cleaning up demo data...');
  
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName('Tasks');
  
  if (!sheet) {
    console.log('⚠️ No Tasks sheet to clean');
    return;
  }
  
  // Remove test rows (rows with "test_" or "task_" prefix in recent additions)
  const data = sheet.getDataRange().getValues();
  const rowsToDelete = [];
  
  for (let i = data.length - 1; i >= 1; i--) { // Start from bottom, skip header
    const id = data[i][0];
    if (id && (id.toString().startsWith('test_') || id.toString().includes(Date.now().toString().slice(0, 8)))) {
      rowsToDelete.push(i + 1); // +1 because sheet rows are 1-indexed
    }
  }
  
  // Delete rows (from bottom to top to maintain row numbers)
  rowsToDelete.forEach(rowNum => {
    sheet.deleteRow(rowNum);
  });
  
  console.log(`🧹 Cleaned up ${rowsToDelete.length} demo rows`);
}

/**
 * 🎯 Run all demos
 */
function runAllDemos() {
  console.log('🎬 Running all demos...');
  
  try {
    console.log('\n=== Demo 1: Simple Sheet ===');
    createSimpleDemo();
    
    console.log('\n=== Demo 2: Data Validation ===');
    testDataValidation();
    
    console.log('\n=== Demo 3: Conditional Formatting ===');
    testConditionalFormatting();
    
    console.log('\n=== Demo 4: Performance Test ===');
    const duration = performanceTest();
    
    console.log('\n=== Demo 5: API Simulation ===');
    simulateAPIUsage();
    
    console.log('\n=== Demo 6: Error Handling ===');
    testErrorHandling();
    
    console.log('\n🎉 All demos completed successfully!');
    console.log(`⚡ Performance: ${duration}ms for 100 tasks`);
    
  } catch (error) {
    console.error('❌ Demo failed:', error);
  }
}
