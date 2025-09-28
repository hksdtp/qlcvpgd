// Test new Google Apps Script API
const NEW_API_URL = 'https://script.google.com/macros/s/AKfycbwsmSL9Sy8Musz8aSK15FhoKUlyVuNX9ipLugurb4w74BSsCPfI1vkInT7jnWjgH0HD/exec';

async function testNewAPI() {
  console.log('🧪 TESTING NEW GOOGLE APPS SCRIPT API...\n');
  
  try {
    // 1. Test health check
    console.log('📊 Step 1: Health check...');
    const healthResponse = await fetch(`${NEW_API_URL}?action=healthCheck`);
    const healthResult = await healthResponse.json();
    
    console.log('✅ Health check:', healthResult);
    
    // 2. Get current tasks
    console.log('\n📊 Step 2: Getting tasks...');
    const getResponse = await fetch(`${NEW_API_URL}?action=getTasks`);
    const getResult = await getResponse.json();
    
    if (!getResult.success) {
      console.log('❌ Failed to get tasks:', getResult.error);
      return;
    }
    
    console.log(`✅ Found ${getResult.data.length} tasks`);
    
    if (getResult.data.length === 0) {
      console.log('❌ No tasks to test with');
      return;
    }
    
    const testTask = getResult.data[0];
    console.log(`📋 Testing with: "${testTask.title}" (${testTask.id})`);
    
    // 3. Update task with subtasks and comments
    console.log('\n📊 Step 3: Updating task with test data...');
    
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
    
    console.log(`📤 Sending update with ${updatedTask.subtasks.length} subtasks and ${updatedTask.comments.length} comments`);
    
    // Test POST request
    const updateResponse = await fetch(NEW_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'updateTask',
        task: updatedTask
      })
    });
    
    const updateResult = await updateResponse.json();
    
    if (!updateResult.success) {
      console.log('❌ Update failed:', updateResult.error);
      return;
    }
    
    console.log('✅ Update successful');
    
    // 4. Verify the update
    console.log('\n📊 Step 4: Verifying update...');
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    
    const verifyResponse = await fetch(`${NEW_API_URL}?action=getTasks&_t=${Date.now()}`);
    const verifyResult = await verifyResponse.json();
    
    if (!verifyResult.success) {
      console.log('❌ Verification failed:', verifyResult.error);
      return;
    }
    
    const verifiedTask = verifyResult.data.find(t => t.id === testTask.id);
    
    if (!verifiedTask) {
      console.log('❌ Task not found after update');
      return;
    }
    
    console.log(`✅ Task found: "${verifiedTask.title}"`);
    console.log(`📋 Subtasks: ${verifiedTask.subtasks?.length || 0}`);
    console.log(`💬 Comments: ${verifiedTask.comments?.length || 0}`);
    
    // Show sample data
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
      console.log('\n🎉 ✅ NEW API WORKING PERFECTLY!');
      console.log('✅ Data persistence is now functional');
      console.log('✅ Subtasks and comments are being saved');
      console.log('✅ Vietnamese characters are preserved');
    } else {
      console.log('\n❌ STILL ISSUES WITH DATA PERSISTENCE');
      console.log('🔧 Check Google Apps Script logs for errors');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run test if this script is executed directly
if (typeof window === 'undefined') {
  testNewAPI();
} else {
  console.log('🌐 Running in browser - paste this into console:');
  console.log('testNewAPI()');
}
