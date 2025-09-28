// Browser console test for data persistence
// Paste this into browser console at http://localhost:3004/

async function testBrowserPersistence() {
  console.log('🧪 TESTING DATA PERSISTENCE IN BROWSER...\n');
  
  try {
    // Check if we're on the right page
    if (!window.location.href.includes('localhost:3004')) {
      console.log('❌ Please run this on http://localhost:3004/');
      return;
    }
    
    // Wait for app to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 1. Check current tasks
    console.log('📊 Step 1: Checking current tasks...');
    
    const taskCards = document.querySelectorAll('[data-task-id]');
    console.log(`Found ${taskCards.length} task cards`);
    
    if (taskCards.length === 0) {
      console.log('❌ No tasks found. Please create a task first.');
      return;
    }
    
    // Click on first task
    const firstTask = taskCards[0];
    const taskId = firstTask.getAttribute('data-task-id');
    console.log(`✅ Clicking on task: ${taskId}`);
    
    firstTask.click();
    
    // Wait for task detail to open
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 2. Add subtasks
    console.log('\n📊 Step 2: Adding subtasks...');
    
    const addSubtaskButton = document.querySelector('button[title*="subtask"], button[title*="Tiến độ"]');
    if (addSubtaskButton) {
      console.log('✅ Found add subtask button');
      
      // Add first subtask
      addSubtaskButton.click();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const subtaskInput = document.querySelector('input[placeholder*="subtask"], input[placeholder*="tiến độ"]');
      if (subtaskInput) {
        subtaskInput.value = 'Test Subtask 1 - Kiểm tra persistence với tiếng Việt: ăn, ê, ô';
        subtaskInput.dispatchEvent(new Event('input', { bubbles: true }));
        subtaskInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        
        console.log('✅ Added subtask 1');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Add second subtask
      addSubtaskButton.click();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const subtaskInput2 = document.querySelectorAll('input[placeholder*="subtask"], input[placeholder*="tiến độ"]');
      const lastInput = subtaskInput2[subtaskInput2.length - 1];
      if (lastInput) {
        lastInput.value = 'Test Subtask 2 - Đã hoàn thành với dấu: à, á, ả, ã, ạ';
        lastInput.dispatchEvent(new Event('input', { bubbles: true }));
        lastInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        
        console.log('✅ Added subtask 2');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } else {
      console.log('⚠️ Add subtask button not found');
    }
    
    // 3. Add comments
    console.log('\n📊 Step 3: Adding comments...');
    
    const commentInput = document.querySelector('textarea[placeholder*="comment"], textarea[placeholder*="bình luận"]');
    if (commentInput) {
      console.log('✅ Found comment input');
      
      // Add first comment
      commentInput.value = 'Test comment với tiếng Việt đầy đủ: ăn, ê, ô, ơ, ư, đ, à, á, ả, ã, ạ, ý, ỳ, ỷ, ỹ, ỵ';
      commentInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      const sendButton = document.querySelector('button[title*="Send"], button[title*="Gửi"]');
      if (sendButton) {
        sendButton.click();
        console.log('✅ Added comment 1');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Add second comment
      commentInput.value = 'Comment thứ 2 để test persistence - Kiểm tra lưu trữ dữ liệu';
      commentInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      if (sendButton) {
        sendButton.click();
        console.log('✅ Added comment 2');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } else {
      console.log('⚠️ Comment input not found');
    }
    
    // 4. Count current data
    console.log('\n📊 Step 4: Counting current data...');
    
    const subtaskElements = document.querySelectorAll('[data-subtask-id], .subtask-item');
    const commentElements = document.querySelectorAll('[data-comment-id], .comment-item');
    
    console.log(`📋 Current subtasks visible: ${subtaskElements.length}`);
    console.log(`💬 Current comments visible: ${commentElements.length}`);
    
    // 5. Force refresh page
    console.log('\n📊 Step 5: Refreshing page to test persistence...');
    console.log('⏳ Page will refresh in 3 seconds...');
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Store current counts for comparison
    window.sessionStorage.setItem('testSubtaskCount', subtaskElements.length.toString());
    window.sessionStorage.setItem('testCommentCount', commentElements.length.toString());
    window.sessionStorage.setItem('testTaskId', taskId);
    
    // Refresh page
    window.location.reload();
    
  } catch (error) {
    console.error('❌ Browser test failed:', error);
  }
}

// Function to check persistence after refresh
async function checkPersistenceAfterRefresh() {
  console.log('🔍 CHECKING PERSISTENCE AFTER REFRESH...\n');
  
  try {
    // Wait for app to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const originalSubtaskCount = parseInt(window.sessionStorage.getItem('testSubtaskCount') || '0');
    const originalCommentCount = parseInt(window.sessionStorage.getItem('testCommentCount') || '0');
    const testTaskId = window.sessionStorage.getItem('testTaskId');
    
    if (!testTaskId) {
      console.log('❌ No test data found. Run testBrowserPersistence() first.');
      return;
    }
    
    console.log(`📊 Original counts - Subtasks: ${originalSubtaskCount}, Comments: ${originalCommentCount}`);
    
    // Find and click the same task
    const taskCard = document.querySelector(`[data-task-id="${testTaskId}"]`);
    if (taskCard) {
      taskCard.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Count current data
      const currentSubtasks = document.querySelectorAll('[data-subtask-id], .subtask-item');
      const currentComments = document.querySelectorAll('[data-comment-id], .comment-item');
      
      console.log(`📊 Current counts - Subtasks: ${currentSubtasks.length}, Comments: ${currentComments.length}`);
      
      // Compare
      const subtasksPersisted = currentSubtasks.length === originalSubtaskCount;
      const commentsPersisted = currentComments.length === originalCommentCount;
      
      console.log('\n🎯 PERSISTENCE RESULTS:');
      console.log(`📋 Subtasks: ${subtasksPersisted ? '✅ PERSISTED' : '❌ LOST'} (${originalSubtaskCount} → ${currentSubtasks.length})`);
      console.log(`💬 Comments: ${commentsPersisted ? '✅ PERSISTED' : '❌ LOST'} (${originalCommentCount} → ${currentComments.length})`);
      
      if (subtasksPersisted && commentsPersisted) {
        console.log('\n🎉 ✅ DATA PERSISTENCE WORKING CORRECTLY!');
      } else {
        console.log('\n❌ DATA PERSISTENCE ISSUES DETECTED!');
        console.log('🔧 Check browser console for API errors');
        console.log('🔧 Check Google Sheets for data storage');
      }
      
      // Clean up
      window.sessionStorage.removeItem('testSubtaskCount');
      window.sessionStorage.removeItem('testCommentCount');
      window.sessionStorage.removeItem('testTaskId');
      
    } else {
      console.log('❌ Test task not found after refresh');
    }
    
  } catch (error) {
    console.error('❌ Persistence check failed:', error);
  }
}

// Auto-run persistence check if we just refreshed
if (window.sessionStorage.getItem('testTaskId')) {
  console.log('🔄 Detected refresh, checking persistence...');
  setTimeout(checkPersistenceAfterRefresh, 1000);
} else {
  console.log('🧪 Ready to test data persistence!');
  console.log('📝 Run: testBrowserPersistence()');
}

// Export functions to global scope
window.testBrowserPersistence = testBrowserPersistence;
window.checkPersistenceAfterRefresh = checkPersistenceAfterRefresh;
