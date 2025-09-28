// Debug script to check what URL frontend is actually using
// Paste this into browser console at http://localhost:3004/

function debugFrontendURL() {
  console.log('🔍 DEBUGGING FRONTEND API URL...\n');
  
  try {
    // Check environment variables
    console.log('📊 Environment Check:');
    console.log('- Current URL:', window.location.href);
    console.log('- User Agent:', navigator.userAgent.substring(0, 50) + '...');
    
    // Try to access Vite env vars (if available)
    if (typeof import !== 'undefined') {
      console.log('- Vite mode detected');
    }
    
    // Check if there's any global config
    if (window.GOOGLE_SHEETS_CONFIG) {
      console.log('- Global config found:', window.GOOGLE_SHEETS_CONFIG);
    }
    
    // Check localStorage for any cached URLs
    console.log('\n📊 LocalStorage Check:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      if (value && value.includes('script.google.com')) {
        console.log(`- ${key}:`, value);
      }
    }
    
    // Check sessionStorage
    console.log('\n📊 SessionStorage Check:');
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      const value = sessionStorage.getItem(key);
      if (value && value.includes('script.google.com')) {
        console.log(`- ${key}:`, value);
      }
    }
    
    // Monitor network requests
    console.log('\n📊 Network Monitoring Setup...');
    
    // Override fetch to monitor requests
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const url = args[0];
      if (typeof url === 'string' && url.includes('script.google.com')) {
        console.log('🌐 FETCH REQUEST DETECTED:');
        console.log('- URL:', url);
        console.log('- Method:', args[1]?.method || 'GET');
        console.log('- Headers:', args[1]?.headers);
        if (args[1]?.body) {
          try {
            const body = JSON.parse(args[1].body);
            console.log('- Body:', body);
            if (body.task) {
              console.log('- Task ID:', body.task.id);
              console.log('- Task Status:', body.task.status);
              console.log('- Subtasks Count:', body.task.subtasks?.length || 0);
              console.log('- Comments Count:', body.task.comments?.length || 0);
            }
          } catch (e) {
            console.log('- Body (raw):', args[1].body.substring(0, 200) + '...');
          }
        }
        console.log('---');
      }
      return originalFetch.apply(this, args);
    };
    
    console.log('✅ Network monitoring active');
    console.log('✅ Now perform actions in the app to see requests');
    
    // Try to find the actual API URL being used
    console.log('\n📊 Searching for API URL in code...');
    
    // Check if we can access the googleSheets service
    setTimeout(() => {
      try {
        // Look for any script tags or modules that might contain the URL
        const scripts = document.querySelectorAll('script');
        let foundUrl = false;
        
        scripts.forEach((script, index) => {
          if (script.src && script.src.includes('localhost')) {
            console.log(`- Script ${index}:`, script.src);
          }
        });
        
        // Check if there are any global variables
        const globalVars = Object.keys(window).filter(key => 
          key.toLowerCase().includes('google') || 
          key.toLowerCase().includes('api') ||
          key.toLowerCase().includes('config')
        );
        
        if (globalVars.length > 0) {
          console.log('- Global variables found:', globalVars);
          globalVars.forEach(varName => {
            const value = window[varName];
            if (typeof value === 'object' && value !== null) {
              console.log(`  ${varName}:`, value);
            }
          });
        }
        
      } catch (error) {
        console.log('- Error searching for URL:', error.message);
      }
    }, 1000);
    
    return 'Debug setup complete. Perform actions in the app to see network requests.';
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  console.log('🔍 Frontend URL Debug Tool Loaded');
  console.log('📝 Run: debugFrontendURL()');
  window.debugFrontendURL = debugFrontendURL;
}
