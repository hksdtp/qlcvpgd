// Debug frontend rendering issues
// This script should be run in browser console

console.log('🔍 DEBUGGING FRONTEND RENDERING...\n');

// Check if we're in browser
if (typeof window !== 'undefined') {
  
  // 1. Check localStorage cache
  console.log('📦 Checking localStorage cache...');
  const cachedTasks = localStorage.getItem('tasks_cache');
  if (cachedTasks) {
    try {
      const parsed = JSON.parse(cachedTasks);
      console.log('✅ Found cached tasks:', parsed.length);
      console.log('📊 Cache timestamp:', new Date(parsed.timestamp || 0).toLocaleString());
    } catch (e) {
      console.log('❌ Invalid cache data');
    }
  } else {
    console.log('📦 No cache found');
  }
  
  // 2. Check React state (if available)
  console.log('\n🔍 Checking React state...');
  
  // Try to access React DevTools
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    console.log('✅ React DevTools available');
  } else {
    console.log('❌ React DevTools not available');
  }
  
  // 3. Check network requests
  console.log('\n🌐 Recent network activity:');
  if (window.performance && window.performance.getEntriesByType) {
    const networkEntries = window.performance.getEntriesByType('resource')
      .filter(entry => entry.name.includes('script.google') || entry.name.includes('getTasks'))
      .slice(-5);
    
    networkEntries.forEach(entry => {
      console.log(`- ${entry.name} (${entry.responseEnd - entry.startTime}ms)`);
    });
  }
  
  // 4. Manual API test
  console.log('\n🧪 Testing API directly from browser...');
  
  const API_URL = 'https://script.google.com/macros/s/AKfycbxLorIPeEcj9VmLHkIjGnC4C5codab-nZpak8TguMFTCkMsanfvtgQa_JfazYbjYk5K/exec';
  
  fetch(`${API_URL}?action=getTasks`)
    .then(response => response.text())
    .then(text => {
      console.log('📥 API Response length:', text.length);
      const result = JSON.parse(text);
      console.log('📊 API returned tasks:', result.data?.length || 0);
      
      if (result.data) {
        console.log('📋 Task departments:');
        const deptCounts = {};
        result.data.forEach(task => {
          const dept = task.department || 'No Dept';
          deptCounts[dept] = (deptCounts[dept] || 0) + 1;
        });
        console.table(deptCounts);
        
        console.log('📋 All task titles:');
        result.data.forEach((task, index) => {
          console.log(`${index + 1}. "${task.title}" (${task.department})`);
        });
      }
    })
    .catch(error => {
      console.error('❌ API test failed:', error);
    });
  
  // 5. Check DOM elements
  setTimeout(() => {
    console.log('\n🎨 Checking DOM rendering...');
    
    const taskCards = document.querySelectorAll('[data-task-id], .task-card, [class*="task"]');
    console.log('📋 Task cards found in DOM:', taskCards.length);
    
    const kanbanColumn = document.querySelector('[class*="kanban"], [class*="column"]');
    if (kanbanColumn) {
      console.log('✅ Kanban column found');
      console.log('📊 Children count:', kanbanColumn.children.length);
    } else {
      console.log('❌ Kanban column not found');
    }
    
    // Check for loading states
    const loadingElements = document.querySelectorAll('[class*="loading"], [class*="spinner"]');
    console.log('⏳ Loading elements:', loadingElements.length);
    
    // Check for error messages
    const errorElements = document.querySelectorAll('[class*="error"], [role="alert"]');
    console.log('❌ Error elements:', errorElements.length);
    
  }, 2000);
  
} else {
  console.log('❌ This script must be run in browser console');
  console.log('📋 Copy and paste this into browser DevTools console');
}

// Instructions for manual testing
console.log('\n📋 MANUAL TESTING STEPS:');
console.log('1. Open browser DevTools (F12)');
console.log('2. Go to Console tab');
console.log('3. Paste this script and run it');
console.log('4. Check the output for issues');
console.log('5. Also check Network tab for failed requests');
console.log('6. Check Application tab > Local Storage for cached data');

console.log('\n🔧 POTENTIAL FIXES:');
console.log('1. Clear localStorage: localStorage.clear()');
console.log('2. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R)');
console.log('3. Check user selection in app');
console.log('4. Verify no JavaScript errors in console');
