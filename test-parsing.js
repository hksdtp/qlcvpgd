// Test parsing logic directly
const API_URL = 'https://script.google.com/macros/s/AKfycbxLorIPeEcj9VmLHkIjGnC4C5codab-nZpak8TguMFTCkMsanfvtgQa_JfazYbjYk5K/exec';

// Simulate the rowToTask function
function rowToTask(row) {
  if (!row || row.length < 7) {
    console.log('❌ Row too short:', row?.length || 0);
    return null;
  }

  // Skip header row and invalid data
  if (row[0] === 'ID' || typeof row[0] !== 'string' || row[0].trim() === '') {
    console.log('❌ Header or empty row:', row[0]);
    return null;
  }
  
  // Accept both task_ and test_ prefixes (and any other valid IDs)
  if (!row[0].includes('task_') && !row[0].includes('test_')) {
    console.log('⚠️ Skipping row with unexpected ID format:', row[0]);
    return null;
  }

  try {
    const task = {
      id: row[0] || '',
      title: row[1] || '',
      description: row[2] || undefined,
      status: row[3] || 'Chưa làm',
      department: row[4] || undefined,
      subtasks: row[5] ? JSON.parse(row[5]) : [],
      createdAt: row[6] || new Date().toISOString(),
      comments: row[8] ? JSON.parse(row[8]).map((comment) => ({
        ...comment,
        likes: comment.likes || 0,
        likedBy: comment.likedBy || [],
        isEdited: comment.isEdited || false
      })) : [],
    };
    
    console.log('✅ Parsed task:', task.id, task.title);
    return task;
  } catch (error) {
    console.error('❌ Error parsing row:', error, row);
    return null;
  }
}

async function testParsing() {
  console.log('🧪 TESTING PARSING LOGIC...\n');
  
  try {
    // Get raw data from API
    const response = await fetch(`${API_URL}?action=getTasks`);
    const result = JSON.parse(await response.text());
    
    if (!result.success || !result.data) {
      console.log('❌ API failed');
      return;
    }
    
    console.log('📊 API returned tasks:', result.data.length);
    
    // Simulate what frontend would do
    console.log('\n🔄 Simulating frontend parsing...');
    
    // Convert tasks back to row format (simulate Google Sheets API response)
    const simulatedRows = [
      ['ID', 'Title', 'Description', 'Status', 'Department', 'Subtasks', 'CreatedAt', 'UpdatedAt', 'Comments'] // Header
    ];
    
    result.data.forEach(task => {
      simulatedRows.push([
        task.id,
        task.title,
        task.description || '',
        task.status,
        task.department || '',
        JSON.stringify(task.subtasks || []),
        task.createdAt,
        task.updatedAt || '',
        JSON.stringify(task.comments || [])
      ]);
    });
    
    console.log('📊 Simulated rows:', simulatedRows.length);
    
    // Test header detection
    const dataRows = simulatedRows.length > 0 && simulatedRows[0][0] === 'ID' ? simulatedRows.slice(1) : simulatedRows;
    console.log('📊 Data rows after header filter:', dataRows.length);
    
    // Test parsing each row
    console.log('\n🔍 Testing row parsing:');
    const parsedTasks = [];
    
    dataRows.forEach((row, index) => {
      console.log(`\nRow ${index + 1}:`);
      console.log('- Raw row:', row.slice(0, 5)); // First 5 columns
      
      const task = rowToTask(row);
      if (task) {
        parsedTasks.push(task);
        console.log(`✅ Parsed: "${task.title}" (${task.department})`);
      } else {
        console.log('❌ Failed to parse');
      }
    });
    
    console.log(`\n📊 FINAL RESULTS:`);
    console.log(`- Original API tasks: ${result.data.length}`);
    console.log(`- Simulated rows: ${simulatedRows.length - 1} (excluding header)`);
    console.log(`- Successfully parsed: ${parsedTasks.length}`);
    console.log(`- Lost in parsing: ${result.data.length - parsedTasks.length}`);
    
    if (result.data.length !== parsedTasks.length) {
      console.log('\n❌ PARSING ISSUE DETECTED!');
      
      const originalIds = result.data.map(t => t.id);
      const parsedIds = parsedTasks.map(t => t.id);
      const lostIds = originalIds.filter(id => !parsedIds.includes(id));
      
      console.log('🔍 Lost task IDs:', lostIds);
      
      lostIds.forEach(id => {
        const originalTask = result.data.find(t => t.id === id);
        console.log(`- Lost: "${originalTask.title}" (ID: ${id})`);
      });
    } else {
      console.log('\n✅ PARSING IS WORKING CORRECTLY!');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

async function testDirectAPI() {
  console.log('\n🌐 TESTING DIRECT API ACCESS...\n');
  
  try {
    const response = await fetch(`${API_URL}?action=getTasks`);
    const text = await response.text();
    
    console.log('📥 Response length:', text.length);
    console.log('📥 First 200 chars:', text.substring(0, 200));
    
    const result = JSON.parse(text);
    console.log('✅ JSON parsed successfully');
    console.log('📊 Success:', result.success);
    console.log('📊 Data count:', result.data?.length || 0);
    
    if (result.data && result.data.length > 0) {
      console.log('\n📋 All tasks from API:');
      result.data.forEach((task, index) => {
        console.log(`${index + 1}. "${task.title}" (${task.department || 'No Dept'}) - ID: ${task.id}`);
      });
      
      // Check ID patterns
      const taskIds = result.data.map(t => t.id);
      const taskPrefixes = taskIds.map(id => id.split('_')[0]);
      const uniquePrefixes = [...new Set(taskPrefixes)];
      
      console.log('\n🔍 ID Analysis:');
      console.log('- Unique prefixes:', uniquePrefixes);
      uniquePrefixes.forEach(prefix => {
        const count = taskPrefixes.filter(p => p === prefix).length;
        console.log(`  * ${prefix}_: ${count} tasks`);
      });
    }
    
  } catch (error) {
    console.error('❌ Direct API test failed:', error);
  }
}

async function runTests() {
  console.log('🚀 STARTING COMPREHENSIVE PARSING TESTS...\n');
  
  await testDirectAPI();
  await testParsing();
  
  console.log('\n🎯 NEXT STEPS:');
  console.log('1. Check browser console for debug output');
  console.log('2. Verify all 10 tasks are being parsed');
  console.log('3. Check if frontend filtering is working correctly');
  console.log('4. Clear browser cache if needed');
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  runTests();
}
