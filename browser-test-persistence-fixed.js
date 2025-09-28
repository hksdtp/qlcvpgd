// Fixed Browser console test for data persistence
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
    
    // 1. Check current tasks with multiple selectors
    console.log('📊 Step 1: Checking current tasks...');
    
    // Try different selectors for task cards
    let taskCards = document.querySelectorAll('[data-task-id]');
    if (taskCards.length === 0) {
      taskCards = document.querySelectorAll('.task-card, .kanban-card, [class*="task"], [class*="card"]');
    }
    if (taskCards.length === 0) {
      taskCards = document.querySelectorAll('div[role="button"], button[class*="task"], div[class*="cursor-pointer"]');
    }
    
    console.log(`Found ${taskCards.length} task cards`);
    
    if (taskCards.length === 0) {
      console.log('❌ No tasks found. Let me check the DOM structure...');
      
      // Debug DOM structure
      const mainContent = document.querySelector('main, .main, [class*="main"]');
      const sidebar = document.querySelector('aside, .sidebar, [class*="sidebar"]');
      
      console.log('🔍 DOM Debug:');
      console.log('- Main content:', mainContent ? 'Found' : 'Not found');
      console.log('- Sidebar:', sidebar ? 'Found' : 'Not found');
      
      if (sidebar) {
        const possibleTasks = sidebar.querySelectorAll('div, button, [class*="task"], [class*="card"]');
        console.log(`- Possible task elements in sidebar: ${possibleTasks.length}`);
        
        // Try to find clickable elements
        const clickableElements = sidebar.querySelectorAll('[onclick], [class*="cursor-pointer"], [class*="hover"], button');
        console.log(`- Clickable elements: ${clickableElements.length}`);
        
        if (clickableElements.length > 0) {
          console.log('✅ Found clickable elements, trying first one...');
          taskCards = [clickableElements[0]];
        }
      }
      
      if (taskCards.length === 0) {
        console.log('❌ Still no tasks found. Please create a task manually first.');
        return;
      }
    }
    
    // Click on first task
    const firstTask = taskCards[0];
    const taskId = firstTask.getAttribute('data-task-id') || 
                   firstTask.id || 
                   `task-${Date.now()}`;
    
    console.log(`✅ Clicking on task: ${taskId}`);
    console.log('Task element:', firstTask);
    
    firstTask.click();
    
    // Wait for task detail to open
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 2. Add subtasks with flexible selectors
    console.log('\n📊 Step 2: Adding subtasks...');
    
    // Try multiple selectors for add subtask button
    let addSubtaskButton = document.querySelector('button[title*="subtask"], button[title*="Tiến độ"]');
    if (!addSubtaskButton) {
      addSubtaskButton = document.querySelector('button[title*="Add"], button[class*="add"], [class*="plus"]');
    }
    if (!addSubtaskButton) {
      // Look for any button with + icon or add text
      const allButtons = document.querySelectorAll('button');
      addSubtaskButton = Array.from(allButtons).find(btn => 
        btn.textContent.includes('+') || 
        btn.textContent.includes('Add') || 
        btn.textContent.includes('Thêm') ||
        btn.innerHTML.includes('plus') ||
        btn.innerHTML.includes('PlusIcon')
      );
    }
    
    if (addSubtaskButton) {
      console.log('✅ Found add subtask button');
      
      // Add first subtask
      addSubtaskButton.click();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Try multiple selectors for subtask input
      let subtaskInput = document.querySelector('input[placeholder*="subtask"], input[placeholder*="tiến độ"]');
      if (!subtaskInput) {
        subtaskInput = document.querySelector('input[type="text"]:not([placeholder*="search"]):not([placeholder*="tìm"])');
      }
      if (!subtaskInput) {
        const allInputs = document.querySelectorAll('input[type="text"]');
        subtaskInput = allInputs[allInputs.length - 1]; // Get last input
      }
      
      if (subtaskInput) {
        subtaskInput.focus();
        subtaskInput.value = 'Test Subtask 1 - Kiểm tra persistence với tiếng Việt: ăn, ê, ô';
        subtaskInput.dispatchEvent(new Event('input', { bubbles: true }));
        subtaskInput.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Try Enter key
        subtaskInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        subtaskInput.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter', bubbles: true }));
        
        console.log('✅ Added subtask 1');
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Add second subtask
        if (addSubtaskButton) {
          addSubtaskButton.click();
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const allInputs2 = document.querySelectorAll('input[type="text"]');
          const lastInput = allInputs2[allInputs2.length - 1];
          
          if (lastInput) {
            lastInput.focus();
            lastInput.value = 'Test Subtask 2 - Đã hoàn thành với dấu: à, á, ả, ã, ạ';
            lastInput.dispatchEvent(new Event('input', { bubbles: true }));
            lastInput.dispatchEvent(new Event('change', { bubbles: true }));
            lastInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            
            console.log('✅ Added subtask 2');
            await new Promise(resolve => setTimeout(resolve, 1500));
          }
        }
      } else {
        console.log('⚠️ Subtask input not found');
      }
    } else {
      console.log('⚠️ Add subtask button not found');
    }
    
    // 3. Add comments with flexible selectors
    console.log('\n📊 Step 3: Adding comments...');
    
    let commentInput = document.querySelector('textarea[placeholder*="comment"], textarea[placeholder*="bình luận"]');
    if (!commentInput) {
      commentInput = document.querySelector('textarea');
    }
    if (!commentInput) {
      commentInput = document.querySelector('input[placeholder*="comment"], input[placeholder*="bình luận"]');
    }
    
    if (commentInput) {
      console.log('✅ Found comment input');
      
      // Add first comment
      commentInput.focus();
      commentInput.value = 'Test comment với tiếng Việt đầy đủ: ăn, ê, ô, ơ, ư, đ, à, á, ả, ã, ạ, ý, ỳ, ỷ, ỹ, ỵ';
      commentInput.dispatchEvent(new Event('input', { bubbles: true }));
      commentInput.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Find send button
      let sendButton = document.querySelector('button[title*="Send"], button[title*="Gửi"]');
      if (!sendButton) {
        // Look for button near comment input
        const commentContainer = commentInput.closest('div, form, section');
        if (commentContainer) {
          sendButton = commentContainer.querySelector('button[type="submit"], button[class*="send"], button[class*="submit"]');
        }
      }
      if (!sendButton) {
        // Look for any button with send-like text
        const allButtons = document.querySelectorAll('button');
        sendButton = Array.from(allButtons).find(btn => 
          btn.textContent.includes('Send') || 
          btn.textContent.includes('Gửi') ||
          btn.textContent.includes('Submit') ||
          btn.innerHTML.includes('send') ||
          btn.innerHTML.includes('paper-airplane')
        );
      }
      
      if (sendButton) {
        sendButton.click();
        console.log('✅ Added comment 1');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Add second comment
        commentInput.focus();
        commentInput.value = 'Comment thứ 2 để test persistence - Kiểm tra lưu trữ dữ liệu';
        commentInput.dispatchEvent(new Event('input', { bubbles: true }));
        commentInput.dispatchEvent(new Event('change', { bubbles: true }));
        
        sendButton.click();
        console.log('✅ Added comment 2');
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        console.log('⚠️ Send button not found');
      }
    } else {
      console.log('⚠️ Comment input not found');
    }
    
    // 4. Count current data with flexible selectors
    console.log('\n📊 Step 4: Counting current data...');
    
    let subtaskElements = document.querySelectorAll('[data-subtask-id], .subtask-item, [class*="subtask"]');
    if (subtaskElements.length === 0) {
      // Look for list items or divs that might be subtasks
      subtaskElements = document.querySelectorAll('li, div[class*="item"], div[class*="task"]:not([class*="main"])');
    }
    
    let commentElements = document.querySelectorAll('[data-comment-id], .comment-item, [class*="comment"]');
    if (commentElements.length === 0) {
      // Look for comment-like structures
      commentElements = document.querySelectorAll('div[class*="message"], div[class*="comment"], article');
    }
    
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

// Export to global scope
window.testBrowserPersistence = testBrowserPersistence;

console.log('🧪 Fixed test script loaded!');
console.log('📝 Run: testBrowserPersistence()');
