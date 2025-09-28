# ⚡ Quick Start - Google Sheets Integration

## 🎯 Mục tiêu
Thiết lập Google Sheets backend cho ứng dụng Task Management trong **5 phút**.

## 🚀 Bước 1: Chạy Auto Setup Script (2 phút)

### Option A: Google Apps Script (Khuyến nghị - Dễ nhất)

1. **Mở Google Apps Script**:
   ```
   🌐 Truy cập: https://script.google.com
   👤 Đăng nhập Google account
   ➕ Click "New project"
   ```

2. **Setup Script**:
   ```
   📝 Xóa code mặc định
   📋 Copy toàn bộ nội dung từ: google-apps-script/setup.gs
   📥 Paste vào editor
   💾 Save (Ctrl+S)
   ```

3. **Chạy Script**:
   ```
   🎯 Chọn function: createTaskManagementSheet
   ▶️ Click "Run"
   🔐 Authorize permissions (Allow access to Sheets & Drive)
   ⏳ Đợi 30-60 giây
   ```

4. **Lấy kết quả**:
   ```
   📊 Mở "Execution transcript" (View → Logs)
   📋 Copy Spreadsheet ID từ logs
   🔗 Copy URL để mở Google Sheet
   ✅ Kiểm tra sheet đã có data
   ```

### Option B: Node.js Script (Cho developers)

```bash
# 1. Install dependencies
npm install googleapis

# 2. Setup service account (cần Google Cloud Console)
# Download service-account-key.json

# 3. Run script
node scripts/create-google-sheet.js
```

## 🔑 Bước 2: Tạo Google Cloud API Key (2 phút)

1. **Truy cập Google Cloud Console**:
   ```
   🌐 https://console.cloud.google.com
   📁 Tạo project mới: "Task Management API"
   ```

2. **Enable Google Sheets API**:
   ```
   📚 APIs & Services → Library
   🔍 Tìm "Google Sheets API"
   ✅ Click "Enable"
   ```

3. **Tạo API Key**:
   ```
   🔑 APIs & Services → Credentials
   ➕ CREATE CREDENTIALS → API key
   📋 Copy API key (ví dụ: AIzaSyABC123...)
   ```

4. **Restrict API Key** (Bảo mật):
   ```
   ⚙️ Click "Restrict Key"
   🌐 Application restrictions: HTTP referrers
   📝 Website restrictions: 
       - http://localhost:*
       - https://yourdomain.com/*
   🔒 API restrictions: Google Sheets API
   💾 Save
   ```

## ⚙️ Bước 3: Cấu hình ứng dụng (1 phút)

1. **Tạo Environment File**:
   ```bash
   cd tqlcv
   cp .env.example .env.local
   ```

2. **Điền thông tin vào .env.local**:
   ```env
   # Paste Spreadsheet ID từ bước 1
   VITE_GOOGLE_SPREADSHEET_ID=1ABC123xyz...
   
   # Paste API Key từ bước 2  
   VITE_GOOGLE_SHEETS_API_KEY=AIzaSyABC123...
   ```

3. **Restart ứng dụng**:
   ```bash
   npm run dev
   ```

## 🧪 Bước 4: Test Integration (30 giây)

1. **Mở ứng dụng**:
   ```
   🌐 http://localhost:3001
   👤 Chọn user "NI" (Ninh)
   ```

2. **Kiểm tra Status Bar**:
   ```
   🟢 Google Sheets: Kết nối thành công ✅
   🔴 Offline: Lỗi kết nối ❌
   🟡 LocalStorage: Fallback mode ⚠️
   ```

3. **Test CRUD Operations**:
   ```
   📖 Read: Tasks tự động load từ Google Sheets
   ➕ Create: Thêm task mới (lưu localStorage)
   ✏️ Update: Chỉnh sửa task (lưu localStorage)
   🗑️ Delete: Xóa task (lưu localStorage)
   🔄 Refresh: Click nút refresh để sync
   ```

## ✅ Kết quả mong đợi

### Thành công:
```
🟢 Status: Google Sheets (connected)
📊 Tasks: Load từ Google Sheets
🔄 Auto-sync: Mỗi 5 phút
💾 Fallback: localStorage khi offline
⏰ Last sync: Hiển thị thời gian
```

### Sample Data hiển thị:
- ✅ **6 tasks** với nội dung tiếng Việt
- ✅ **Multiple departments**: Design, Development, Marketing
- ✅ **All statuses**: Todo, In Progress, Completed  
- ✅ **Subtasks** với progress bars
- ✅ **Realistic timestamps**

## 🔍 Troubleshooting

### Lỗi thường gặp:

#### 1. "API key not valid"
```
❌ Google Sheets API error: Forbidden
✅ Kiểm tra API key và restrictions trong Google Cloud Console
```

#### 2. "Spreadsheet not found"  
```
❌ Google Sheets API error: Not Found
✅ Kiểm tra Spreadsheet ID và sharing permissions
```

#### 3. "CORS error"
```
❌ Access to fetch blocked by CORS
✅ Thêm domain vào API key restrictions
```

#### 4. Status hiển thị "LocalStorage"
```
🟡 LocalStorage (fallback mode)
✅ Kiểm tra .env.local có đúng API key và Spreadsheet ID
✅ Restart npm run dev
```

## 🎉 Hoàn thành!

**🚀 Chúc mừng! Google Sheets integration đã hoạt động!**

### Tính năng đã có:
- ✅ **Cloud Database**: Google Sheets làm backend
- ✅ **Real-time Sync**: Auto-sync mỗi 5 phút
- ✅ **Offline Support**: localStorage fallback
- ✅ **Error Recovery**: Tự động fallback khi lỗi
- ✅ **Professional UI**: Status indicators, loading states
- ✅ **Mobile Optimized**: Responsive design

### Next Steps:
- 🔄 **Real-time Collaboration**: WebSocket sync
- 📊 **Analytics Dashboard**: Charts và reports  
- 🔔 **Push Notifications**: Task reminders
- 👥 **Multi-user**: User management system
- 🌙 **Dark Mode**: Theme switching

**🎯 Ứng dụng Task Management với Google Sheets backend đã sẵn sàng sử dụng!**

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra **Console logs** trong browser DevTools
2. Xem **Google Apps Script logs** trong Execution transcript  
3. Verify **API key restrictions** trong Google Cloud Console
4. Test **Google Sheet permissions** (Anyone with link can view)

**Happy coding! 🚀**
