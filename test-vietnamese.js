// Test Vietnamese input and current data structure
const API_URL = 'https://script.google.com/macros/s/AKfycbxLorIPeEcj9VmLHkIjGnC4C5codab-nZpak8TguMFTCkMsanfvtgQa_JfazYbjYk5K/exec';

// Test task with Vietnamese characters
const vietnameseTestTask = {
  id: `test_vietnamese_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  title: 'Công việc với tiếng Việt có dấu: ăn, ê, ô, ơ, ư, à, á, ả, ã, ạ',
  description: 'Mô tả công việc: Thực hiện các nhiệm vụ quan trọng với chất lượng cao',
  status: 'Chưa làm',
  department: 'Marketing',
  subtasks: [
    {
      id: `s-${Date.now()}`,
      title: 'Subtask tiếng Việt: Chuẩn bị tài liệu báo cáo',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: `s-${Date.now() + 1}`,
      title: 'Subtask 2: Họp với đội ngũ phát triển',
      completed: true,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    }
  ],
  comments: [
    {
      id: `c-${Date.now()}`,
      content: 'Comment tiếng Việt: Cần hoàn thành trước ngày 30/12. Chú ý chất lượng!',
      author: { id: '3', name: 'Ms Nhung', role: 'marketing_lead' },
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: []
    },
    {
      id: `c-${Date.now() + 1}`,
      content: 'Đã cập nhật tiến độ. Mọi thứ đang diễn ra tốt đẹp.',
      author: { id: '1', name: 'Sếp Hạnh', role: 'admin' },
      createdAt: new Date().toISOString(),
      likes: 2,
      likedBy: ['2', '4']
    }
  ],
  createdAt: new Date().toISOString()
};

async function testGetCurrentData() {
  console.log('🔍 Getting current data from Google Sheets...');
  
  try {
    const response = await fetch(`${API_URL}?action=getTasks`);
    const responseText = await response.text();
    console.log('📥 Raw response:', responseText.substring(0, 500) + '...');
    
    const result = JSON.parse(responseText);
    console.log('✅ Current tasks count:', result.data?.length || 0);
    
    if (result.data && result.data.length > 0) {
      const sampleTask = result.data[0];
      console.log('📊 Sample task structure:');
      console.log('- ID:', sampleTask.id);
      console.log('- Title:', sampleTask.title);
      console.log('- Subtasks type:', typeof sampleTask.subtasks, 'Length:', sampleTask.subtasks?.length || 0);
      console.log('- Comments type:', typeof sampleTask.comments, 'Length:', sampleTask.comments?.length || 0);
      
      if (sampleTask.subtasks && sampleTask.subtasks.length > 0) {
        console.log('- Sample subtask:', sampleTask.subtasks[0]);
      }
      if (sampleTask.comments && sampleTask.comments.length > 0) {
        console.log('- Sample comment:', sampleTask.comments[0]);
      }
    }
    
    return result.data;
  } catch (error) {
    console.error('❌ Failed to get current data:', error);
    return null;
  }
}

async function testVietnameseCreate() {
  console.log('\n🇻🇳 Testing Vietnamese character support...');
  
  try {
    const taskData = encodeURIComponent(JSON.stringify(vietnameseTestTask));
    const response = await fetch(`${API_URL}?action=createTask&taskData=${taskData}`, {
      method: 'GET',
      mode: 'no-cors'
    });

    console.log('✅ Vietnamese task creation request sent');
    
    // Wait a bit then check if it was saved
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const tasks = await testGetCurrentData();
    if (tasks) {
      const foundTask = tasks.find(t => t.id === vietnameseTestTask.id);
      if (foundTask) {
        console.log('✅ Vietnamese task found in database');
        console.log('📝 Title preserved:', foundTask.title);
        console.log('📝 Description preserved:', foundTask.description);
        console.log('📊 Subtasks preserved:', foundTask.subtasks?.length || 0);
        console.log('💬 Comments preserved:', foundTask.comments?.length || 0);
        
        if (foundTask.subtasks && foundTask.subtasks.length > 0) {
          console.log('📋 Sample subtask title:', foundTask.subtasks[0].title);
        }
        if (foundTask.comments && foundTask.comments.length > 0) {
          console.log('💬 Sample comment content:', foundTask.comments[0].content);
        }
      } else {
        console.log('❌ Vietnamese task not found in database');
      }
    }
    
  } catch (error) {
    console.error('❌ Vietnamese test failed:', error);
  }
}

async function runTests() {
  console.log('🚀 Starting Vietnamese and data structure tests...\n');
  
  // Test 1: Get current data
  await testGetCurrentData();
  
  // Test 2: Test Vietnamese characters
  await testVietnameseCreate();
  
  console.log('\n🎉 Tests completed!');
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  runTests();
}
