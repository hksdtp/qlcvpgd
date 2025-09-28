# 📜 Scripts - Google Sheets Auto Setup

## 🎯 Tổng quan

Thư mục này chứa các scripts tự động tạo và cấu hình Google Sheets cho ứng dụng Task Management.

## 📁 Files

### 1. `create-google-sheet.js`
**Node.js script** để tạo Google Sheets từ command line.

**Ưu điểm:**
- ✅ Chạy từ terminal
- ✅ Tích hợp vào CI/CD pipeline
- ✅ Programmatic control
- ✅ Batch processing

**Yêu cầu:**
- Node.js
- Google Service Account credentials
- `googleapis` package

### 2. Google Apps Script (khuyến nghị)
**Browser-based script** chạy trực tiếp trên Google Apps Script.

**Ưu điểm:**
- ✅ Không cần setup local
- ✅ Chạy trực tiếp trên Google
- ✅ Dễ sử dụng cho non-developers
- ✅ Không cần service account

## 🚀 Cách sử dụng

### Option 1: Google Apps Script (Khuyến nghị)

```bash
# 1. Mở script.google.com
# 2. Tạo project mới
# 3. Copy code từ google-apps-script/setup.gs
# 4. Chạy function createTaskManagementSheet()
```

**👍 Phù hợp cho:** Người dùng thông thường, setup một lần

### Option 2: Node.js Script

```bash
# 1. Install dependencies
npm install googleapis

# 2. Setup service account credentials
# Download service-account-key.json từ Google Cloud Console

# 3. Run script
node scripts/create-google-sheet.js
```

**👍 Phù hợp cho:** Developers, automation, CI/CD

## 🔧 Setup Service Account (cho Node.js)

### Bước 1: Tạo Service Account
1. Truy cập [console.cloud.google.com](https://console.cloud.google.com)
2. Chọn hoặc tạo project
3. Vào **IAM & Admin** → **Service Accounts**
4. Click **Create Service Account**
5. Điền thông tin:
   - **Name**: Task Management Service
   - **Description**: Service account for Google Sheets integration

### Bước 2: Tạo Key
1. Click vào service account vừa tạo
2. Vào tab **Keys**
3. Click **Add Key** → **Create new key**
4. Chọn **JSON** format
5. Download file JSON
6. Đổi tên thành `service-account-key.json`
7. Đặt trong thư mục root của project

### Bước 3: Enable APIs
1. Vào **APIs & Services** → **Library**
2. Enable các APIs:
   - **Google Sheets API**
   - **Google Drive API**

### Bước 4: Chạy Script
```bash
node scripts/create-google-sheet.js
```

## 📊 Output

Cả hai methods đều tạo ra:

### Google Sheet với:
- **Sheet name**: "Tasks"
- **Headers**: id, title, description, status, department, subtasks, createdAt, updatedAt
- **Sample data**: 5-6 realistic tasks
- **Formatting**: Colors, fonts, conditional formatting
- **Data validation**: Dropdowns cho status và department
- **Sharing**: Anyone with link can view

### Config files:
- **Console logs**: Spreadsheet ID và URL
- **google-sheets-config.json**: Machine-readable config
- **.env.local template**: Ready to use

## 🔍 Troubleshooting

### Google Apps Script Issues:

#### Permission Error:
```
❌ You do not have permission to call SpreadsheetApp.create
```
**Solution**: Authorize permissions khi chạy script lần đầu.

#### Timeout Error:
```
❌ Exceeded maximum execution time
```
**Solution**: Giảm số lượng sample data trong CONFIG.

### Node.js Script Issues:

#### Credentials Error:
```
❌ Service account file not found
```
**Solution**: Đảm bảo `service-account-key.json` ở đúng vị trí.

#### API Error:
```
❌ Google Sheets API has not been used
```
**Solution**: Enable Google Sheets API trong Google Cloud Console.

#### Permission Error:
```
❌ Insufficient Permission
```
**Solution**: Kiểm tra service account có đủ quyền.

## 🎨 Customization

### Thay đổi Sample Data:
```javascript
// Trong setup.gs hoặc create-google-sheet.js
const SAMPLE_TASKS = [
  {
    id: 'custom_1',
    title: 'Your custom task',
    // ... other fields
  }
];
```

### Thay đổi Formatting:
```javascript
// Thay đổi colors
const CONFIG = {
  COLORS: {
    HEADER: '#YOUR_COLOR',
    TODO: '#YOUR_COLOR',
    // ...
  }
};
```

### Thêm Sheets khác:
```javascript
// Tạo thêm sheets cho Users, Departments, etc.
function setupUsersSheet(spreadsheet) {
  // Implementation
}
```

## 📈 Advanced Usage

### Batch Creation:
```bash
# Tạo multiple sheets cho different environments
SPREADSHEET_NAME="Task Management - Dev" node scripts/create-google-sheet.js
SPREADSHEET_NAME="Task Management - Prod" node scripts/create-google-sheet.js
```

### CI/CD Integration:
```yaml
# GitHub Actions example
- name: Setup Google Sheets
  run: |
    echo '${{ secrets.SERVICE_ACCOUNT_KEY }}' > service-account-key.json
    node scripts/create-google-sheet.js
```

### Environment-specific Config:
```javascript
const CONFIG = {
  SPREADSHEET_NAME: process.env.NODE_ENV === 'production' 
    ? 'Task Management - Production'
    : 'Task Management - Development',
  // ...
};
```

## 🎉 Kết quả

Sau khi chạy script thành công:

- ✅ **Google Sheet** được tạo và configured
- ✅ **Sample data** realistic cho testing
- ✅ **Professional formatting** 
- ✅ **Integration ready** với ứng dụng
- ✅ **Config files** generated

**🚀 Ready to integrate với React app!**
