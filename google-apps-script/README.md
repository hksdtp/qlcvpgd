# 🚀 Google Apps Script - Auto Setup Task Management Sheet

## 🎯 Mục đích

Script này tự động tạo và cấu hình Google Sheets hoàn chỉnh cho ứng dụng Task Management, bao gồm:

- ✅ Tạo spreadsheet với cấu trúc phù hợp
- ✅ Thêm sample data realistic
- ✅ Format headers và conditional formatting
- ✅ Setup data validation cho dropdowns
- ✅ Cấu hình sharing permissions
- ✅ Generate integration config

## 📋 Hướng dẫn sử dụng

### Bước 1: Mở Google Apps Script
1. Truy cập [script.google.com](https://script.google.com)
2. Đăng nhập với Google account
3. Click **"New project"**

### Bước 2: Setup Script
1. Xóa code mặc định trong `Code.gs`
2. Copy toàn bộ nội dung file `setup.gs` 
3. Paste vào Google Apps Script Editor
4. Đổi tên project thành **"Task Management Setup"**
5. Save project (Ctrl+S)

### Bước 3: Chạy Script
1. Chọn function **`createTaskManagementSheet`** từ dropdown
2. Click **"Run"** (▶️)
3. **Authorize permissions** khi được yêu cầu:
   - Allow access to Google Sheets
   - Allow access to Google Drive
4. Đợi script chạy hoàn thành (30-60 giây)

### Bước 4: Kiểm tra kết quả
1. Mở **"Execution transcript"** (View → Logs)
2. Copy **Spreadsheet ID** từ logs
3. Copy **URL** để mở Google Sheet
4. Kiểm tra sheet đã được tạo với đầy đủ data

## 📊 Cấu trúc được tạo

### Sheet "Tasks" với columns:
| Column | Type | Description |
|--------|------|-------------|
| **id** | String | Unique task identifier |
| **title** | String | Task title |
| **description** | String | Task description (optional) |
| **status** | Enum | todo, in-progress, completed |
| **department** | Enum | Design, Development, Marketing, etc. |
| **subtasks** | JSON | Array of subtask objects |
| **createdAt** | ISO Date | Task creation timestamp |
| **updatedAt** | ISO Date | Last update timestamp |

### Sample Data:
- **6 realistic tasks** với nội dung tiếng Việt
- **Multiple departments**: Design, Development, Marketing, Documentation, Testing
- **All status types**: todo, in-progress, completed
- **Subtasks** với progress tracking
- **Realistic timestamps**

### Formatting:
- **Header row**: Blue background, white text, bold
- **Conditional formatting**: 
  - 🔴 Todo: Red background
  - 🟡 In Progress: Yellow background  
  - 🟢 Completed: Green background
- **Data validation**: Dropdowns cho status và department
- **Column widths**: Optimized cho readability

## 🔧 Integration với ứng dụng

### Sau khi chạy script:

1. **Copy Spreadsheet ID** từ logs
2. **Tạo file `.env.local`** trong thư mục `tqlcv/`:
   ```env
   VITE_GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
   VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
   ```

3. **Tạo Google Cloud API Key**:
   - Truy cập [console.cloud.google.com](https://console.cloud.google.com)
   - Tạo project mới hoặc chọn project existing
   - Enable **Google Sheets API**
   - Tạo **API Key** với restrictions
   - Copy API key vào `.env.local`

4. **Restart ứng dụng**:
   ```bash
   cd tqlcv
   npm run dev
   ```

5. **Test integration**:
   - Mở http://localhost:3001
   - Chọn user **NI** (Ninh)
   - Kiểm tra status: 🟢 **Google Sheets** (connected)

## 🛠️ Helper Functions

### Refresh Sample Data:
```javascript
refreshSampleData()
```
Xóa data cũ và thêm sample data mới.

### Clear All Data:
```javascript
clearAllData()
```
Xóa tất cả data (giữ lại headers).

### Custom Sample Data:
Chỉnh sửa function `generateSampleTasks()` để tạo data phù hợp với nhu cầu.

## 🔍 Troubleshooting

### Lỗi Permission:
```
❌ Exception: You do not have permission to call SpreadsheetApp.create
```
**Giải pháp**: Authorize permissions khi chạy script lần đầu.

### Lỗi Sharing:
```
⚠️ Không thể tự động setup sharing
```
**Giải pháp**: Manual share sheet với "Anyone with link can view".

### Script timeout:
```
❌ Exceeded maximum execution time
```
**Giải pháp**: Giảm `SAMPLE_DATA_COUNT` trong CONFIG.

## 📈 Customization

### Thay đổi Configuration:
```javascript
const CONFIG = {
  SPREADSHEET_NAME: 'Your Custom Name',
  DEPARTMENTS: ['Dept1', 'Dept2', 'Dept3'],
  SAMPLE_DATA_COUNT: 20,
  // ... other options
};
```

### Thêm Sheets khác:
Tạo functions tương tự `setupTasksSheet()` cho Users, Departments, etc.

### Custom Formatting:
Chỉnh sửa `formatSheet()` để thay đổi colors, fonts, layouts.

## 🎉 Kết quả

Sau khi chạy script thành công:

- ✅ **Google Sheet** được tạo với URL và ID
- ✅ **Sample data** realistic cho testing
- ✅ **Professional formatting** với colors và validation
- ✅ **Ready for integration** với ứng dụng React
- ✅ **Sharing permissions** đã được setup

**🚀 Google Sheets backend đã sẵn sàng cho ứng dụng Task Management!**
