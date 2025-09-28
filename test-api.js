// Test script to verify Google Apps Script API
const API_URL = 'https://script.google.com/macros/s/AKfycbxLorIPeEcj9VmLHkIjGnC4C5codab-nZpak8TguMFTCkMsanfvtgQa_JfazYbjYk5K/exec';

// Test task with subtasks and comments
const testTask = {
  id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  title: 'Test Task với Subtasks và Comments',
  description: 'Đây là task test để kiểm tra subtasks và comments',
  status: 'Chưa làm',
  department: 'Marketing',
  subtasks: [
    {
      id: `s-${Date.now()}`,
      title: 'Subtask 1 - Hoàn thành thiết kế',
      completed: true,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    },
    {
      id: `s-${Date.now() + 1}`,
      title: 'Subtask 2 - Review nội dung',
      completed: false,
      createdAt: new Date().toISOString()
    }
  ],
  comments: [
    {
      id: `c-${Date.now()}`,
      content: 'Đây là comment test để kiểm tra',
      author: { id: '4', name: 'Ninh', role: 'member' },
      createdAt: new Date().toISOString()
    }
  ],
  createdAt: new Date().toISOString()
};

async function testCreateTask() {
  console.log('🧪 Testing CREATE task with subtasks and comments...');
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'createTask',
        task: testTask
      })
    });

    const responseText = await response.text();
    console.log('📥 Raw response:', responseText);
    
    const result = JSON.parse(responseText);
    console.log('✅ CREATE result:', result);
    
    return result.data;
  } catch (error) {
    console.error('❌ CREATE failed:', error);
    return null;
  }
}

async function testGetTasks() {
  console.log('🧪 Testing GET tasks...');
  
  try {
    const response = await fetch(`${API_URL}?action=getTasks`);
    const responseText = await response.text();
    console.log('📥 Raw response:', responseText);
    
    const result = JSON.parse(responseText);
    console.log('✅ GET result:', result);
    
    return result.data;
  } catch (error) {
    console.error('❌ GET failed:', error);
    return null;
  }
}

async function testUpdateTask(taskId) {
  console.log('🧪 Testing UPDATE task...');
  
  const updatedTask = {
    ...testTask,
    id: taskId,
    title: 'UPDATED: Test Task với Subtasks và Comments',
    subtasks: [
      ...testTask.subtasks,
      {
        id: `s-${Date.now() + 2}`,
        title: 'Subtask 3 - ADDED VIA UPDATE',
        completed: false,
        createdAt: new Date().toISOString()
      }
    ],
    comments: [
      ...testTask.comments,
      {
        id: `c-${Date.now() + 1}`,
        content: 'Comment ADDED VIA UPDATE',
        author: { id: '3', name: 'Ms Nhung', role: 'marketing_lead' },
        createdAt: new Date().toISOString()
      }
    ]
  };
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'updateTask',
        task: updatedTask
      })
    });

    const responseText = await response.text();
    console.log('📥 Raw response:', responseText);
    
    const result = JSON.parse(responseText);
    console.log('✅ UPDATE result:', result);
    
    return result.data;
  } catch (error) {
    console.error('❌ UPDATE failed:', error);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting API tests...\n');
  
  // Test 1: Create task
  const createdTask = await testCreateTask();
  if (!createdTask) {
    console.log('❌ Cannot continue tests - CREATE failed');
    return;
  }
  
  console.log('\n⏳ Waiting 2 seconds...\n');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 2: Get tasks
  const tasks = await testGetTasks();
  if (tasks) {
    const foundTask = tasks.find(t => t.id === createdTask.id);
    if (foundTask) {
      console.log('✅ Task found in GET response');
      console.log('📊 Subtasks:', foundTask.subtasks);
      console.log('💬 Comments:', foundTask.comments);
    } else {
      console.log('❌ Task not found in GET response');
    }
  }
  
  console.log('\n⏳ Waiting 2 seconds...\n');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 3: Update task
  const updatedTask = await testUpdateTask(createdTask.id);
  if (updatedTask) {
    console.log('✅ Task updated successfully');
  }
  
  console.log('\n⏳ Waiting 2 seconds...\n');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 4: Get tasks again to verify update
  const tasksAfterUpdate = await testGetTasks();
  if (tasksAfterUpdate) {
    const foundUpdatedTask = tasksAfterUpdate.find(t => t.id === createdTask.id);
    if (foundUpdatedTask) {
      console.log('✅ Updated task found in GET response');
      console.log('📊 Updated Subtasks:', foundUpdatedTask.subtasks);
      console.log('💬 Updated Comments:', foundUpdatedTask.comments);
    } else {
      console.log('❌ Updated task not found in GET response');
    }
  }
  
  console.log('\n🎉 Tests completed!');
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  runTests();
}
