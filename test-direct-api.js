// Test direct API call to Google Apps Script
const API_URL = 'https://script.google.com/macros/s/AKfycbxLorIPeEcj9VmLHkIjGnC4C5codab-nZpak8TguMFTCkMsanfvtgQa_JfazYbjYk5K/exec';

async function testDirectAPI() {
  console.log('🧪 TESTING DIRECT API CALL...\n');
  
  try {
    // 1. Get current tasks first
    console.log('📊 Step 1: Getting current tasks...');
    const getResponse = await fetch(`${API_URL}?action=getTasks`);
    const getResult = await getResponse.json();
    
    if (!getResult.success || !getResult.data || getResult.data.length === 0) {
      console.log('❌ No tasks found to test with');
      return;
    }
    
    const testTask = getResult.data[0];
    console.log(`✅ Found test task: "${testTask.title}" (${testTask.id})`);
    
    // 2. Create test data with subtasks and comments
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
    
    console.log('\n📤 Step 2: Sending update with test data...');
    console.log(`- Subtasks: ${updatedTask.subtasks.length}`);
    console.log(`- Comments: ${updatedTask.comments.length}`);
    
    // 3. Test GET request method (current approach)
    console.log('\n🔄 Testing GET request method...');
    
    const taskData = encodeURIComponent(JSON.stringify(updatedTask));
    const getUrl = `${API_URL}?action=updateTask&taskData=${taskData}`;
    
    console.log(`📏 URL length: ${getUrl.length} characters`);
    
    if (getUrl.length > 8000) {
      console.log('⚠️ URL too long for GET request');
    } else {
      const getUpdateResponse = await fetch(getUrl, {
        method: 'GET',
        mode: 'no-cors'
      });
      
      console.log('✅ GET request sent');
    }
    
    // 4. Test POST request method (alternative)
    console.log('\n🔄 Testing POST request method...');
    
    try {
      const postResponse = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateTask',
          task: updatedTask
        }),
        mode: 'cors'
      });
      
      const postResult = await postResponse.json();
      console.log('✅ POST request successful:', postResult);
      
    } catch (corsError) {
      console.log('⚠️ POST CORS failed, trying no-cors...');
      
      await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateTask',
          task: updatedTask
        }),
        mode: 'no-cors'
      });
      
      console.log('✅ POST no-cors sent');
    }
    
    // 5. Wait and verify
    console.log('\n⏳ Step 3: Waiting 5 seconds for processing...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('\n📊 Step 4: Verifying update...');
    
    const verifyResponse = await fetch(`${API_URL}?action=getTasks&_t=${Date.now()}`);
    const verifyResult = await verifyResponse.json();
    
    if (verifyResult.success) {
      const verifiedTask = verifyResult.data.find(t => t.id === testTask.id);
      
      if (verifiedTask) {
        console.log(`✅ Task found: "${verifiedTask.title}"`);
        console.log(`📋 Subtasks: ${verifiedTask.subtasks?.length || 0}`);
        console.log(`💬 Comments: ${verifiedTask.comments?.length || 0}`);
        
        if (verifiedTask.subtasks && verifiedTask.subtasks.length > 0) {
          console.log('📋 Sample subtask:', verifiedTask.subtasks[0]);
        }
        
        if (verifiedTask.comments && verifiedTask.comments.length > 0) {
          console.log('💬 Sample comment:', verifiedTask.comments[0]);
        }
        
        // Final assessment
        const expectedSubtasks = updatedTask.subtasks.length;
        const actualSubtasks = verifiedTask.subtasks?.length || 0;
        const expectedComments = updatedTask.comments.length;
        const actualComments = verifiedTask.comments?.length || 0;
        
        console.log('\n🎯 FINAL RESULTS:');
        console.log(`📋 Subtasks: ${actualSubtasks}/${expectedSubtasks} ${actualSubtasks === expectedSubtasks ? '✅' : '❌'}`);
        console.log(`💬 Comments: ${actualComments}/${expectedComments} ${actualComments === expectedComments ? '✅' : '❌'}`);
        
        if (actualSubtasks === expectedSubtasks && actualComments === expectedComments) {
          console.log('\n🎉 ✅ DATA PERSISTENCE WORKING!');
        } else {
          console.log('\n❌ DATA PERSISTENCE ISSUES DETECTED');
          console.log('🔧 Possible causes:');
          console.log('1. Google Apps Script not receiving data properly');
          console.log('2. JSON serialization issues in backend');
          console.log('3. Google Sheets cell size limits');
          console.log('4. Backend deployment issues');
        }
        
      } else {
        console.log('❌ Task not found in verification');
      }
    } else {
      console.log('❌ Verification failed:', verifyResult.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run test if this script is executed directly
if (typeof window === 'undefined') {
  testDirectAPI();
} else {
  console.log('🌐 Running in browser - paste this into console:');
  console.log('testDirectAPI()');
}
