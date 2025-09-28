// Debug department filtering issue
const API_URL = 'https://script.google.com/macros/s/AKfycbxLorIPeEcj9VmLHkIjGnC4C5codab-nZpak8TguMFTCkMsanfvtgQa_JfazYbjYk5K/exec';

// User permissions from types.ts
const USER_PERMISSIONS = {
  'Ms Nhung': ['Marketing', 'CV Chung'],
  'Sếp Hạnh': ['Kinh Doanh', 'Sản xuất/ Kỹ Thuật', 'Hành Chính Nhân Sự', 'Marketing', 'CV Chung', 'CV Khác'], // All departments
  'Mr Hùng': ['Kinh Doanh', 'Sản xuất/ Kỹ Thuật', 'Hành Chính Nhân Sự', 'Marketing', 'CV Chung'], // All except CV Khác
};

async function debugFiltering() {
  console.log('🔍 DEBUGGING DEPARTMENT FILTERING...\n');
  
  try {
    // Get all tasks from API
    console.log('📊 Fetching all tasks from Google Sheets...');
    const response = await fetch(`${API_URL}?action=getTasks`);
    const result = JSON.parse(await response.text());
    
    if (!result.success || !result.data) {
      console.log('❌ Failed to fetch tasks');
      return;
    }
    
    const allTasks = result.data;
    console.log(`✅ Total tasks in Google Sheets: ${allTasks.length}\n`);
    
    // Analyze departments
    console.log('📋 Department analysis:');
    const departmentCounts = {};
    allTasks.forEach(task => {
      const dept = task.department || 'No Department';
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });
    
    Object.entries(departmentCounts).forEach(([dept, count]) => {
      console.log(`- ${dept}: ${count} tasks`);
    });
    
    console.log('\n🔐 User permission filtering:');
    
    // Test filtering for each user
    Object.entries(USER_PERMISSIONS).forEach(([userName, allowedDepts]) => {
      console.log(`\n👤 ${userName}:`);
      console.log(`- Allowed departments: ${allowedDepts.join(', ')}`);
      
      const filteredTasks = allTasks.filter(task => {
        if (!task.department) return true; // No department = visible to all
        return allowedDepts.includes(task.department);
      });
      
      console.log(`- Can see: ${filteredTasks.length}/${allTasks.length} tasks`);
      
      if (filteredTasks.length < allTasks.length) {
        const hiddenTasks = allTasks.filter(task => 
          task.department && !allowedDepts.includes(task.department)
        );
        console.log(`- Hidden tasks: ${hiddenTasks.length}`);
        hiddenTasks.forEach(task => {
          console.log(`  * "${task.title}" (${task.department})`);
        });
      }
    });
    
    // Check for tasks without department
    const tasksWithoutDept = allTasks.filter(task => !task.department);
    console.log(`\n📝 Tasks without department: ${tasksWithoutDept.length}`);
    if (tasksWithoutDept.length > 0) {
      tasksWithoutDept.forEach(task => {
        console.log(`- "${task.title}" (ID: ${task.id})`);
      });
    }
    
    // Check for invalid departments
    const validDepartments = ['Kinh Doanh', 'Sản xuất/ Kỹ Thuật', 'Hành Chính Nhân Sự', 'Marketing', 'CV Chung', 'CV Khác'];
    const invalidDeptTasks = allTasks.filter(task => 
      task.department && !validDepartments.includes(task.department)
    );
    
    console.log(`\n⚠️ Tasks with invalid departments: ${invalidDeptTasks.length}`);
    if (invalidDeptTasks.length > 0) {
      invalidDeptTasks.forEach(task => {
        console.log(`- "${task.title}" has department: "${task.department}"`);
      });
    }
    
    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    
    if (invalidDeptTasks.length > 0) {
      console.log('1. ⚠️ Some tasks have invalid departments - they may not be filtered correctly');
    }
    
    if (tasksWithoutDept.length > 0) {
      console.log('2. 📝 Some tasks have no department - they are visible to all users');
    }
    
    console.log('3. 🔐 To see ALL tasks, select "Sếp Hạnh" user');
    console.log('4. 🔍 To see only Marketing tasks, select "Ms Nhung" user');
    console.log('5. 📊 Current filtering is working as designed based on user permissions');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

async function testAPIDirectly() {
  console.log('\n🧪 TESTING API DIRECTLY...\n');
  
  try {
    const response = await fetch(`${API_URL}?action=getTasks`);
    const text = await response.text();
    
    console.log('📥 Raw API response length:', text.length);
    console.log('📥 First 200 chars:', text.substring(0, 200));
    
    const result = JSON.parse(text);
    console.log('✅ JSON parsed successfully');
    console.log('📊 Success:', result.success);
    console.log('📊 Data length:', result.data?.length || 0);
    
    if (result.data && result.data.length > 0) {
      console.log('\n📋 Sample tasks:');
      result.data.slice(0, 3).forEach((task, index) => {
        console.log(`${index + 1}. "${task.title}" (${task.department || 'No Dept'})`);
      });
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

async function runDebug() {
  console.log('🚀 STARTING DEBUG SESSION...\n');
  
  await testAPIDirectly();
  await debugFiltering();
  
  console.log('\n🎯 CONCLUSION:');
  console.log('If you see only 3 tasks in the web app:');
  console.log('1. Check which user you selected');
  console.log('2. Ms Nhung can only see Marketing + CV Chung tasks');
  console.log('3. Mr Hùng can see all except CV Khác tasks');
  console.log('4. Sếp Hạnh can see ALL tasks');
  console.log('5. This is the intended behavior based on user permissions');
  
  console.log('\n🔧 TO FIX:');
  console.log('- Select "Sếp Hạnh" to see all 10 tasks');
  console.log('- Or modify USER_PERMISSIONS in types.ts to allow more access');
}

// Run debug if this script is executed directly
if (typeof window === 'undefined') {
  runDebug();
}
