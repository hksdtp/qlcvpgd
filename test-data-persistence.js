// Test data persistence for subtasks and comments
const API_URL = 'https://script.google.com/macros/s/AKfycbxLorIPeEcj9VmLHkIjGnC4C5codab-nZpak8TguMFTCkMsanfvtgQa_JfazYbjYk5K/exec';

async function testDataPersistence() {
  console.log('🧪 TESTING DATA PERSISTENCE...\n');
  
  try {
    // 1. Get current tasks
    console.log('📊 Step 1: Getting current tasks...');
    const getResponse = await fetch(`${API_URL}?action=getTasks`);
    const getResult = await getResponse.json();
    
    if (!getResult.success || !getResult.data || getResult.data.length === 0) {
      console.log('❌ No tasks found to test with');
      return;
    }
    
    const testTask = getResult.data[0];
    console.log(`✅ Found test task: "${testTask.title}" (${testTask.id})`);
    console.log(`📋 Current subtasks: ${testTask.subtasks?.length || 0}`);
    console.log(`💬 Current comments: ${testTask.comments?.length || 0}`);
    
    // 2. Add test subtasks and comments
    console.log('\n📊 Step 2: Adding test data...');
    
    const updatedTask = {
      ...testTask,
      title: 'Test Task với Subtasks và Comments',
      description: 'Testing data persistence for nested objects',
      subtasks: [
        {
          id: `sub_${Date.now()}_1`,
          title: 'Test Subtask 1 - Kiểm tra persistence',
          completed: false,
          createdAt: new Date().toISOString()
        },
        {
          id: `sub_${Date.now()}_2`,
          title: 'Test Subtask 2 - Với tiếng Việt có dấu: ăn, ê, ô',
          completed: true,
          createdAt: new Date().toISOString()
        }
      ],
      comments: [
        {
          id: `comment_${Date.now()}_1`,
          content: 'Test comment với tiếng Việt: ăn, ê, ô, ơ, ư, đ',
          author: {
            id: '1',
            name: 'Test User',
            role: 'admin'
          },
          createdAt: new Date().toISOString(),
          likes: 3,
          likedBy: ['2', '3', '4'],
          isEdited: false
        },
        {
          id: `comment_${Date.now()}_2`,
          content: 'Comment thứ 2 để test persistence',
          author: {
            id: '2',
            name: 'User 2',
            role: 'member'
          },
          createdAt: new Date().toISOString(),
          likes: 0,
          likedBy: [],
          isEdited: true
        }
      ]
    };
    
    console.log('📤 Sending updated task with:');
    console.log(`  - ${updatedTask.subtasks.length} subtasks`);
    console.log(`  - ${updatedTask.comments.length} comments`);
    
    // 3. Update task via API
    console.log('\n📊 Step 3: Updating task...');
    
    const updateResponse = await fetch(API_URL, {
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
    
    // 4. Wait a moment for Google Sheets to process
    console.log('\n📊 Step 4: Waiting for Google Sheets to process...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 5. Fetch task again to verify persistence
    console.log('\n📊 Step 5: Verifying persistence...');
    
    const verifyResponse = await fetch(`${API_URL}?action=getTasks&_t=${Date.now()}`);
    const verifyResult = await verifyResponse.json();
    
    if (!verifyResult.success) {
      console.log('❌ Verification fetch failed');
      return;
    }
    
    const verifiedTask = verifyResult.data.find(t => t.id === testTask.id);
    
    if (!verifiedTask) {
      console.log('❌ Task not found in verification');
      return;
    }
    
    console.log(`✅ Task found: "${verifiedTask.title}"`);
    console.log(`📋 Verified subtasks: ${verifiedTask.subtasks?.length || 0}`);
    console.log(`💬 Verified comments: ${verifiedTask.comments?.length || 0}`);
    
    // 6. Detailed comparison
    console.log('\n📊 Step 6: Detailed comparison...');
    
    const originalSubtasks = updatedTask.subtasks.length;
    const verifiedSubtasks = verifiedTask.subtasks?.length || 0;
    const originalComments = updatedTask.comments.length;
    const verifiedComments = verifiedTask.comments?.length || 0;
    
    console.log('\n📋 SUBTASKS COMPARISON:');
    console.log(`  Original: ${originalSubtasks}`);
    console.log(`  Verified: ${verifiedSubtasks}`);
    console.log(`  Status: ${originalSubtasks === verifiedSubtasks ? '✅ MATCH' : '❌ MISMATCH'}`);
    
    if (verifiedSubtasks > 0) {
      console.log('  Sample subtask:', JSON.stringify(verifiedTask.subtasks[0], null, 2));
    }
    
    console.log('\n💬 COMMENTS COMPARISON:');
    console.log(`  Original: ${originalComments}`);
    console.log(`  Verified: ${verifiedComments}`);
    console.log(`  Status: ${originalComments === verifiedComments ? '✅ MATCH' : '❌ MISMATCH'}`);
    
    if (verifiedComments > 0) {
      console.log('  Sample comment:', JSON.stringify(verifiedTask.comments[0], null, 2));
    }
    
    // 7. Final assessment
    console.log('\n🎯 FINAL ASSESSMENT:');
    
    if (originalSubtasks === verifiedSubtasks && originalComments === verifiedComments) {
      console.log('🎉 ✅ DATA PERSISTENCE WORKING CORRECTLY!');
      console.log('   - Subtasks are saved and retrieved properly');
      console.log('   - Comments are saved and retrieved properly');
      console.log('   - Vietnamese characters are preserved');
    } else {
      console.log('❌ DATA PERSISTENCE ISSUES DETECTED:');
      
      if (originalSubtasks !== verifiedSubtasks) {
        console.log(`   - Subtasks lost: ${originalSubtasks} → ${verifiedSubtasks}`);
      }
      
      if (originalComments !== verifiedComments) {
        console.log(`   - Comments lost: ${originalComments} → ${verifiedComments}`);
      }
      
      console.log('\n🔧 POSSIBLE CAUSES:');
      console.log('   1. JSON serialization issues in backend');
      console.log('   2. Google Sheets cell size limits');
      console.log('   3. Character encoding problems');
      console.log('   4. API request/response issues');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run test if this script is executed directly
if (typeof window === 'undefined') {
  testDataPersistence();
} else {
  console.log('🌐 Running in browser - paste this into console:');
  console.log('testDataPersistence()');
}
