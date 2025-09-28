// Test the specific task that user is having issues with
const NEW_API_URL = 'https://script.google.com/macros/s/AKfycbwsmSL9Sy8Musz8aSK15FhoKUlyVuNX9ipLugurb4w74BSsCPfI1vkInT7jnWjgH0HD/exec';
const PROBLEM_TASK_ID = 'task_1758989988111_ioecq4um7';

async function testSpecificTask() {
  console.log('🎯 TESTING SPECIFIC PROBLEM TASK...\n');
  console.log(`Task ID: ${PROBLEM_TASK_ID}`);
  console.log(`API URL: ${NEW_API_URL}\n`);
  
  try {
    // 1. Get current state of the problem task
    console.log('📊 Step 1: Getting current task state...');
    const getResponse = await fetch(`${NEW_API_URL}?action=getTasks`);
    const getResult = await getResponse.json();
    
    if (!getResult.success) {
      console.log('❌ Failed to get tasks:', getResult.error);
      return;
    }
    
    const problemTask = getResult.data.find(t => t.id === PROBLEM_TASK_ID);
    
    if (!problemTask) {
      console.log('❌ Problem task not found');
      console.log('Available tasks:', getResult.data.map(t => `${t.id}: "${t.title}"`));
      return;
    }
    
    console.log('✅ Found problem task:');
    console.log(`- Title: "${problemTask.title}"`);
    console.log(`- Description: "${problemTask.description}"`);
    console.log(`- Status: "${problemTask.status}"`);
    console.log(`- Department: "${problemTask.department}"`);
    console.log(`- Subtasks: ${problemTask.subtasks?.length || 0}`);
    console.log(`- Comments: ${problemTask.comments?.length || 0}`);
    
    if (problemTask.subtasks && problemTask.subtasks.length > 0) {
      console.log('- Sample subtask:', problemTask.subtasks[0]);
    }
    
    if (problemTask.comments && problemTask.comments.length > 0) {
      console.log('- Sample comment:', problemTask.comments[0]);
    }
    
    // 2. Update this specific task with test data
    console.log('\n📊 Step 2: Updating problem task with test data...');
    
    const updatedTask = {
      ...problemTask,
      title: 'FIXED: Test Task với Subtasks và Comments',
      description: 'Task đã được fix với subtasks và comments',
      subtasks: [
        {
          id: `s-${Date.now()}`,
          title: 'FIXED Subtask 1 - Test persistence',
          completed: false,
          createdAt: new Date().toISOString()
        },
        {
          id: `s-${Date.now() + 1}`,
          title: 'FIXED Subtask 2 - Đã hoàn thành',
          completed: true,
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString()
        }
      ],
      comments: [
        {
          id: `c-${Date.now()}`,
          content: 'FIXED Comment với tiếng Việt: ăn, ê, ô, ơ, ư, đ',
          author: {
            id: '4',
            name: 'Ninh',
            role: 'member'
          },
          createdAt: new Date().toISOString(),
          likes: 3,
          likedBy: ['1', '2', '4'],
          isEdited: false
        },
        {
          id: `c-${Date.now() + 1000}`,
          content: 'FIXED Comment thứ 2 - Test like system',
          author: {
            id: '1',
            name: 'Sếp Hạnh',
            role: 'admin'
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
    
    // 3. Verify the update immediately
    console.log('\n📊 Step 3: Immediate verification...');
    
    const verifyResponse = await fetch(`${NEW_API_URL}?action=getTasks&_t=${Date.now()}`);
    const verifyResult = await verifyResponse.json();
    
    if (!verifyResult.success) {
      console.log('❌ Verification failed:', verifyResult.error);
      return;
    }
    
    const verifiedTask = verifyResult.data.find(t => t.id === PROBLEM_TASK_ID);
    
    if (!verifiedTask) {
      console.log('❌ Task not found after update');
      return;
    }
    
    console.log('✅ Verification results:');
    console.log(`- Title: "${verifiedTask.title}"`);
    console.log(`- Status: "${verifiedTask.status}"`);
    console.log(`- Subtasks: ${verifiedTask.subtasks?.length || 0}`);
    console.log(`- Comments: ${verifiedTask.comments?.length || 0}`);
    
    // Show detailed data
    if (verifiedTask.subtasks && verifiedTask.subtasks.length > 0) {
      console.log('\n📋 Subtasks details:');
      verifiedTask.subtasks.forEach((subtask, index) => {
        console.log(`  ${index + 1}. "${subtask.title}" (${subtask.completed ? 'completed' : 'pending'})`);
      });
    }
    
    if (verifiedTask.comments && verifiedTask.comments.length > 0) {
      console.log('\n💬 Comments details:');
      verifiedTask.comments.forEach((comment, index) => {
        console.log(`  ${index + 1}. "${comment.content}" by ${comment.author.name} (${comment.likes} likes)`);
      });
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
      console.log('\n🎉 ✅ PROBLEM TASK FIXED!');
      console.log('✅ Data persistence working for this specific task');
      console.log('✅ Check Google Sheets - should now show JSON data instead of []');
      console.log('\n🔧 If frontend still shows [], the issue is:');
      console.log('1. Frontend using old API URL');
      console.log('2. Browser cache needs clearing');
      console.log('3. .env file not loaded properly');
    } else {
      console.log('\n❌ STILL ISSUES WITH THIS TASK');
      console.log('🔧 Check Google Apps Script logs for errors');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run test if this script is executed directly
if (typeof window === 'undefined') {
  testSpecificTask();
} else {
  console.log('🎯 Specific Task Test Tool Loaded');
  console.log('📝 Run: testSpecificTask()');
  window.testSpecificTask = testSpecificTask;
}
