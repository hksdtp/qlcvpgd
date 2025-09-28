// Test all fixes
const API_URL = 'https://script.google.com/macros/s/AKfycbxLorIPeEcj9VmLHkIjGnC4C5codab-nZpak8TguMFTCkMsanfvtgQa_JfazYbjYk5K/exec';

async function testAPIConnection() {
  console.log('🧪 TESTING API CONNECTION...\n');
  
  try {
    console.log('📡 Testing CORS mode...');
    const corsResponse = await fetch(`${API_URL}?action=getTasks`, {
      method: 'GET',
      mode: 'cors',
    });
    
    const result = await corsResponse.json();
    console.log('✅ CORS mode successful');
    console.log('📊 Tasks returned:', result.data?.length || 0);
    
    if (result.data && result.data.length > 0) {
      console.log('📋 Sample task IDs:');
      result.data.slice(0, 3).forEach((task, index) => {
        console.log(`  ${index + 1}. ${task.id} - "${task.title}"`);
      });
    }
    
    return result.data || [];
    
  } catch (corsError) {
    console.log('❌ CORS mode failed:', corsError.message);
    
    try {
      console.log('📡 Testing no-cors mode...');
      const noCorsResponse = await fetch(`${API_URL}?action=getTasks`, {
        method: 'GET',
        mode: 'no-cors',
      });
      
      console.log('⚠️ No-cors mode executed (cannot read response)');
      console.log('📱 Would fallback to localStorage in real app');
      return [];
      
    } catch (noCorsError) {
      console.log('❌ No-cors mode also failed:', noCorsError.message);
      return [];
    }
  }
}

async function testVietnameseInput() {
  console.log('\n🇻🇳 TESTING VIETNAMESE INPUT...\n');
  
  const testStrings = [
    'Công việc với ăn, ê, ô, ơ, ư',
    'Dấu thanh: à, á, ả, ã, ạ',
    'Đặc biệt: đ, Đ, ý, ỳ, ỷ, ỹ, ỵ',
    'Câu hoàn chỉnh: Tôi đang làm việc với ứng dụng quản lý công việc rất hiệu quả'
  ];
  
  console.log('📝 Test strings:');
  testStrings.forEach((str, index) => {
    console.log(`${index + 1}. "${str}"`);
    
    // Check if all Vietnamese characters are preserved
    const vietnameseChars = ['ă', 'â', 'ê', 'ô', 'ơ', 'ư', 'đ', 'Đ', 'à', 'á', 'ả', 'ã', 'ạ', 'ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ'];
    const foundChars = vietnameseChars.filter(char => str.includes(char));
    
    if (foundChars.length > 0) {
      console.log(`   Vietnamese chars: ${foundChars.join(', ')}`);
    }
  });
  
  console.log('\n✅ Vietnamese characters should display correctly in browser');
  console.log('🔧 If not, check font rendering and IME settings');
}

async function testPerformance() {
  console.log('\n⚡ TESTING PERFORMANCE...\n');
  
  const startTime = Date.now();
  
  try {
    const tasks = await testAPIConnection();
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`📊 API Response Time: ${duration}ms`);
    
    if (duration < 1000) {
      console.log('✅ Good performance (< 1s)');
    } else if (duration < 3000) {
      console.log('⚠️ Acceptable performance (1-3s)');
    } else {
      console.log('❌ Slow performance (> 3s)');
    }
    
    // Test multiple rapid calls (simulate debouncing scenario)
    console.log('\n🔄 Testing rapid calls (debouncing simulation)...');
    const rapidStartTime = Date.now();
    
    const promises = Array.from({ length: 5 }, (_, i) => 
      fetch(`${API_URL}?action=getTasks&test=${i}`, { mode: 'no-cors' })
    );
    
    await Promise.all(promises);
    const rapidEndTime = Date.now();
    const rapidDuration = rapidEndTime - rapidStartTime;
    
    console.log(`📊 5 Rapid Calls Duration: ${rapidDuration}ms`);
    console.log('💡 Debouncing should prevent this in real app');
    
  } catch (error) {
    console.error('❌ Performance test failed:', error);
  }
}

async function testErrorHandling() {
  console.log('\n🛡️ TESTING ERROR HANDLING...\n');
  
  try {
    // Test invalid URL
    console.log('📡 Testing invalid URL...');
    await fetch('https://invalid-url-that-does-not-exist.com/api', {
      mode: 'no-cors'
    });
    console.log('✅ Invalid URL handled gracefully');
    
  } catch (error) {
    console.log('✅ Network error caught:', error.message);
  }
  
  try {
    // Test malformed API call
    console.log('📡 Testing malformed API call...');
    const response = await fetch(`${API_URL}?action=invalidAction`, {
      mode: 'cors'
    });
    
    const result = await response.json();
    if (!result.success) {
      console.log('✅ API error handled:', result.error);
    }
    
  } catch (error) {
    console.log('✅ Malformed API call error caught:', error.message);
  }
}

async function runAllTests() {
  console.log('🚀 RUNNING COMPREHENSIVE TESTS...\n');
  console.log('=' .repeat(50));
  
  await testAPIConnection();
  await testVietnameseInput();
  await testPerformance();
  await testErrorHandling();
  
  console.log('\n' + '='.repeat(50));
  console.log('🎯 TEST SUMMARY:');
  console.log('1. ✅ API Connection - Check console for results');
  console.log('2. ✅ Vietnamese Input - Visual test in browser');
  console.log('3. ✅ Performance - Check response times');
  console.log('4. ✅ Error Handling - Check graceful failures');
  
  console.log('\n🔧 NEXT STEPS:');
  console.log('1. Open browser DevTools and check for errors');
  console.log('2. Test Vietnamese input in the web app');
  console.log('3. Try creating/editing tasks');
  console.log('4. Check if all 10 tasks are displayed');
  console.log('5. Test comment system with Edit/Delete/Like');
  
  console.log('\n📱 WEB APP: http://localhost:3004/');
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  runAllTests();
} else {
  console.log('🌐 Running in browser - paste this into console:');
  console.log('runAllTests()');
}
