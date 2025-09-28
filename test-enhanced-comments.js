// Test enhanced comments system with Vietnamese support
const API_URL = 'https://script.google.com/macros/s/AKfycbxLorIPeEcj9VmLHkIjGnC4C5codab-nZpak8TguMFTCkMsanfvtgQa_JfazYbjYk5K/exec';

// Test task with enhanced comments
const enhancedCommentsTask = {
  id: `test_enhanced_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  title: 'Test Enhanced Comments với tiếng Việt: ăn, ê, ô, ơ, ư, à, á, ả, ã, ạ',
  description: 'Kiểm tra hệ thống bình luận nâng cao với Like, Edit, Delete',
  status: 'Chưa làm',
  department: 'Marketing',
  subtasks: [
    {
      id: `s-${Date.now()}`,
      title: 'Subtask với tiếng Việt: Chuẩn bị tài liệu báo cáo',
      completed: false,
      createdAt: new Date().toISOString()
    }
  ],
  comments: [
    {
      id: `c-${Date.now()}`,
      content: 'Comment tiếng Việt với dấu: Cần hoàn thành trước ngày 30/12. Chú ý chất lượng! 🚀',
      author: { id: '3', name: 'Ms Nhung', role: 'marketing_lead' },
      createdAt: new Date().toISOString(),
      likes: 2,
      likedBy: ['1', '2'],
      isEdited: false
    },
    {
      id: `c-${Date.now() + 1}`,
      content: 'Đã cập nhật tiến độ. Mọi thứ đang diễn ra tốt đẹp. Cảm ơn team! 👍',
      author: { id: '1', name: 'Sếp Hạnh', role: 'admin' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 5,
      likedBy: ['2', '3', '4', '5', '6'],
      isEdited: true
    },
    {
      id: `c-${Date.now() + 2}`,
      content: 'Comment mới không có like nào. Test zero state.',
      author: { id: '4', name: 'Ninh', role: 'member' },
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      isEdited: false
    }
  ],
  createdAt: new Date().toISOString()
};

async function testEnhancedComments() {
  console.log('🚀 Testing Enhanced Comments System...\n');
  
  try {
    // Test 1: Create task with enhanced comments
    console.log('📝 Creating task with enhanced comments...');
    const taskData = encodeURIComponent(JSON.stringify(enhancedCommentsTask));
    const createResponse = await fetch(`${API_URL}?action=createTask&taskData=${taskData}`, {
      method: 'GET',
      mode: 'no-cors'
    });

    console.log('✅ Enhanced comments task creation request sent');
    
    // Wait for save
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test 2: Retrieve and verify data structure
    console.log('\n🔍 Retrieving tasks to verify enhanced comments...');
    const getResponse = await fetch(`${API_URL}?action=getTasks`);
    const getResult = await getResponse.text();
    const result = JSON.parse(getResult);
    
    if (result.success && result.data) {
      const foundTask = result.data.find(t => t.id === enhancedCommentsTask.id);
      
      if (foundTask) {
        console.log('✅ Enhanced comments task found!');
        console.log('📊 Task details:');
        console.log('- Title:', foundTask.title);
        console.log('- Comments count:', foundTask.comments?.length || 0);
        
        if (foundTask.comments && foundTask.comments.length > 0) {
          console.log('\n💬 Comments analysis:');
          foundTask.comments.forEach((comment, index) => {
            console.log(`\nComment ${index + 1}:`);
            console.log('- Content:', comment.content);
            console.log('- Author:', comment.author?.name || 'Unknown');
            console.log('- Likes:', comment.likes || 0);
            console.log('- Liked by count:', comment.likedBy?.length || 0);
            console.log('- Is edited:', comment.isEdited || false);
            console.log('- Has updatedAt:', !!comment.updatedAt);
          });
          
          // Test Vietnamese character preservation
          const vietnameseChars = ['ă', 'â', 'ê', 'ô', 'ơ', 'ư', 'à', 'á', 'ả', 'ã', 'ạ'];
          const titleHasVietnamese = vietnameseChars.some(char => foundTask.title.includes(char));
          const commentsHaveVietnamese = foundTask.comments.some(comment => 
            vietnameseChars.some(char => comment.content.includes(char))
          );
          
          console.log('\n🇻🇳 Vietnamese character preservation:');
          console.log('- Title has Vietnamese chars:', titleHasVietnamese);
          console.log('- Comments have Vietnamese chars:', commentsHaveVietnamese);
          
          // Test enhanced comment fields
          const hasLikesField = foundTask.comments.every(comment => typeof comment.likes === 'number');
          const hasLikedByField = foundTask.comments.every(comment => Array.isArray(comment.likedBy));
          const hasIsEditedField = foundTask.comments.every(comment => typeof comment.isEdited === 'boolean');
          
          console.log('\n🔧 Enhanced comment fields:');
          console.log('- All comments have likes field:', hasLikesField);
          console.log('- All comments have likedBy array:', hasLikedByField);
          console.log('- All comments have isEdited field:', hasIsEditedField);
          
          if (hasLikesField && hasLikedByField && hasIsEditedField) {
            console.log('✅ Enhanced comments structure is correct!');
          } else {
            console.log('❌ Enhanced comments structure has issues');
          }
          
        } else {
          console.log('❌ No comments found in retrieved task');
        }
        
        // Test subtasks with Vietnamese
        if (foundTask.subtasks && foundTask.subtasks.length > 0) {
          console.log('\n📋 Subtasks analysis:');
          foundTask.subtasks.forEach((subtask, index) => {
            console.log(`Subtask ${index + 1}: ${subtask.title}`);
          });
        }
        
      } else {
        console.log('❌ Enhanced comments task not found in database');
      }
    } else {
      console.log('❌ Failed to retrieve tasks');
    }
    
  } catch (error) {
    console.error('❌ Enhanced comments test failed:', error);
  }
}

async function testDataPersistence() {
  console.log('\n🔍 Testing data persistence issues...');
  
  try {
    const getResponse = await fetch(`${API_URL}?action=getTasks`);
    const getResult = await getResponse.text();
    const result = JSON.parse(getResult);
    
    if (result.success && result.data) {
      console.log(`📊 Total tasks: ${result.data.length}`);
      
      let emptySubtasksCount = 0;
      let emptyCommentsCount = 0;
      let properDataCount = 0;
      
      result.data.forEach(task => {
        const hasEmptySubtasks = Array.isArray(task.subtasks) && task.subtasks.length === 0;
        const hasEmptyComments = Array.isArray(task.comments) && task.comments.length === 0;
        
        if (hasEmptySubtasks) emptySubtasksCount++;
        if (hasEmptyComments) emptyCommentsCount++;
        if (!hasEmptySubtasks || !hasEmptyComments) properDataCount++;
      });
      
      console.log(`📈 Data persistence analysis:`);
      console.log(`- Tasks with empty subtasks: ${emptySubtasksCount}`);
      console.log(`- Tasks with empty comments: ${emptyCommentsCount}`);
      console.log(`- Tasks with proper data: ${properDataCount}`);
      
      if (emptySubtasksCount === 0 && emptyCommentsCount === 0) {
        console.log('✅ No empty arrays found - data persistence is working!');
      } else {
        console.log('⚠️ Some tasks still have empty arrays');
      }
    }
    
  } catch (error) {
    console.error('❌ Data persistence test failed:', error);
  }
}

async function runAllTests() {
  console.log('🎯 Starting comprehensive tests...\n');
  
  await testEnhancedComments();
  await testDataPersistence();
  
  console.log('\n🎉 All tests completed!');
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  runAllTests();
}
