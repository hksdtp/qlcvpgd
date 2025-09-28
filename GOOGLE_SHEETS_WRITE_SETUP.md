# 🚀 Google Sheets Write Operations Setup Guide

## 🎯 Mục tiêu

Nâng cấp ứng dụng Task Management để có thể **write data trực tiếp vào Google Sheets**, không chỉ read-only.

### ✅ Tính năng sẽ có:
- **➕ Create**: Tạo task mới trực tiếp lên Google Sheets
- **✏️ Update**: Chỉnh sửa task và cập nhật lên Google Sheets  
- **🗑️ Delete**: Xóa task khỏi Google Sheets
- **🔄 Bidirectional Sync**: Đồng bộ hai chiều giữa app và Sheets
- **🛡️ Error Handling**: Fallback to localStorage khi offline
- **⚡ Performance**: Optimized với caching và batch operations

---

## 🏗️ **KIẾN TRÚC GIẢI PHÁP**

### **📊 Current vs Target:**
```
❌ Current: React App → Read from Sheets → Write to localStorage
✅ Target:  React App ↔ Google Apps Script API ↔ Google Sheets
```

### **🔧 Technical Stack:**
1. **Google Apps Script** - Backend API (serverless, free)
2. **Google Sheets API v4** - Read operations (existing)
3. **Custom REST API** - Write operations via Apps Script
4. **Hybrid Sync Strategy** - Cloud primary + localStorage fallback

---

## 📋 **BƯỚC 1: DEPLOY GOOGLE APPS SCRIPT API**

### **1.1 Tạo Apps Script Project:**

1. **Mở Google Apps Script**:
   ```
   🌐 https://script.google.com
   ➕ New project
   📝 Tên: "Task Management API Backend"
   ```

2. **Copy API Backend Code**:
   ```
   📁 Mở file: google-apps-script/api-backend.gs
   📋 Copy toàn bộ code
   📥 Paste vào Code.gs (thay thế code mặc định)
   💾 Save (Ctrl+S)
   ```

3. **Cập nhật Spreadsheet ID**:
   ```javascript
   // Trong CONFIG object, line 15
   SPREADSHEET_ID: '1nQVX_Jtwhwl3ApGlXuV6NthROZkejy6EMrFztw1k_vU'
   ```

### **1.2 Deploy as Web App:**

1. **Deploy Project**:
   ```
   🚀 Click "Deploy" → "New deployment"
   ⚙️ Type: "Web app"
   👤 Execute as: "Me (your-email@gmail.com)"
   🌐 Who has access: "Anyone"
   📝 Description: "Task Management API v1"
   🚀 Click "Deploy"
   ```

2. **Authorize Permissions**:
   ```
   🔐 "Authorize access" → Choose your Google account
   ⚠️ "Google hasn't verified this app" → "Advanced"
   🔓 "Go to Task Management API Backend (unsafe)"
   ✅ "Allow" permissions:
      - See, edit, create, and delete your spreadsheets
      - See, edit, create, and delete your Google Drive files
   ```

3. **Copy Web App URL**:
   ```
   📋 Copy "Web app URL" (dạng: https://script.google.com/macros/s/ABC123.../exec)
   💾 Save URL này để config frontend
   ```

### **1.3 Test API Endpoints:**

```bash
# Test health check
curl "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=healthCheck"

# Test get tasks
curl "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=getTasks"
```

---

## ⚙️ **BƯỚC 2: CẤU HÌNH FRONTEND**

### **2.1 Cập nhật Environment Variables:**

```bash
# Mở file .env.local
cd tqlcv
code .env.local
```

```env
# Existing config
VITE_GOOGLE_SHEETS_API_KEY=AIzaSyAsNVOpgc1NoOnONMB3XsPAgygLRKi7hJc
VITE_GOOGLE_SPREADSHEET_ID=1nQVX_Jtwhwl3ApGlXuV6NthROZkejy6EMrFztw1k_vU

# New: Google Apps Script backend URL
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### **2.2 Restart Development Server:**

```bash
npm run dev
```

---

## 🧪 **BƯỚC 3: TEST WRITE OPERATIONS**

### **3.1 Test trong ứng dụng:**

1. **Mở ứng dụng**: http://localhost:3001
2. **Chọn user "NI"** (Ninh) để có write access
3. **Kiểm tra Status Bar**:
   - 🟢 **"Google Sheets"** = Read/Write operations working
   - 🟡 **"LocalStorage"** = Write operations fallback to localStorage

### **3.2 Test CRUD Operations:**

#### **➕ Create Task:**
```
1. Click FAB button hoặc + button
2. Điền thông tin task mới
3. Click "Thêm công việc"
4. ✅ Task xuất hiện trong app
5. ✅ Kiểm tra Google Sheets → Task đã được thêm
```

#### **✏️ Update Task:**
```
1. Click vào task để mở detail
2. Click "Edit" button
3. Chỉnh sửa thông tin
4. Click "Cập nhật"
5. ✅ Task được update trong app
6. ✅ Kiểm tra Google Sheets → Task đã được cập nhật
```

#### **🗑️ Delete Task:**
```
1. Click vào task để mở detail
2. Click "Delete" button
3. Confirm deletion
4. ✅ Task biến mất khỏi app
5. ✅ Kiểm tra Google Sheets → Task đã bị xóa
```

### **3.3 Test Error Handling:**

#### **Test Offline Mode:**
```
1. Disconnect internet
2. Thực hiện CRUD operations
3. ✅ Operations vẫn hoạt động (localStorage fallback)
4. ✅ Status bar hiển thị "Offline" hoặc "LocalStorage"
5. Reconnect internet
6. ✅ Manual refresh để sync data
```

---

## 🔍 **TROUBLESHOOTING**

### **❌ Lỗi thường gặp:**

#### **1. "Script function not found":**
```
❌ Error: Script function not found: doGet
✅ Solution: Đảm bảo đã copy đúng code từ api-backend.gs
✅ Check: Function doGet và doPost có tồn tại trong script
```

#### **2. "Authorization required":**
```
❌ Error: Authorization required
✅ Solution: Re-deploy script và authorize permissions lại
✅ Check: Execute as "Me" và Who has access "Anyone"
```

#### **3. "CORS error":**
```
❌ Error: Access to fetch blocked by CORS
✅ Solution: Apps Script tự động handle CORS
✅ Check: Đảm bảo sử dụng đúng Web App URL (không phải development URL)
```

#### **4. "Spreadsheet not found":**
```
❌ Error: Spreadsheet not found
✅ Solution: Kiểm tra SPREADSHEET_ID trong CONFIG
✅ Check: Script có quyền access spreadsheet
```

#### **5. Status hiển thị "LocalStorage":**
```
❌ Write operations không hoạt động
✅ Check: VITE_GOOGLE_APPS_SCRIPT_URL trong .env.local
✅ Check: Web App URL có đúng format
✅ Test: Thử gọi API trực tiếp bằng curl
```

---

## 📊 **MONITORING & DEBUGGING**

### **📋 Google Apps Script Logs:**

1. **Xem Execution Logs**:
   ```
   📊 Google Apps Script → Executions
   🔍 Click vào execution để xem details
   📝 Xem logs và errors
   ```

2. **Debug API Calls**:
   ```javascript
   // Thêm vào script để debug
   console.log('Request received:', e);
   console.log('Action:', action);
   console.log('Result:', result);
   ```

### **🌐 Browser DevTools:**

```javascript
// Test API trong browser console
fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=healthCheck')
  .then(r => r.json())
  .then(console.log);
```

### **📈 Performance Monitoring:**

```javascript
// Trong Apps Script
const startTime = new Date();
// ... operations ...
const duration = new Date() - startTime;
console.log(`Operation took ${duration}ms`);
```

---

## 🎯 **EXPECTED RESULTS**

### **✅ Sau khi setup thành công:**

#### **📊 Status Indicators:**
```
🟢 Google Sheets (connected) - Read/Write operations working
⏰ Last sync: [timestamp] - Shows last successful sync
🔄 Auto-sync: Every 5 minutes - Background sync working
```

#### **🎮 CRUD Operations:**
```
➕ Create: Task → Google Sheets → App refresh
✏️ Update: Task → Google Sheets → App refresh  
🗑️ Delete: Task → Google Sheets → App refresh
📖 Read: Google Sheets → App (existing functionality)
```

#### **🛡️ Error Handling:**
```
🌐 Online: All operations → Google Sheets
🔴 Offline: All operations → localStorage fallback
⚠️ Partial: Read from Sheets, Write to localStorage
🔄 Recovery: Auto-sync when connection restored
```

---

## 🚀 **PRODUCTION DEPLOYMENT**

### **📦 Frontend Build:**
```bash
cd tqlcv
npm run build
# Deploy dist/ folder to Vercel/Netlify/etc.
```

### **🔧 Environment Variables:**
```env
# Production .env
VITE_GOOGLE_SHEETS_API_KEY=your_production_api_key
VITE_GOOGLE_SPREADSHEET_ID=your_production_sheet_id
VITE_GOOGLE_APPS_SCRIPT_URL=your_production_script_url
```

### **🔒 Security Considerations:**
- ✅ **API Key Restrictions**: Restrict to production domain
- ✅ **Apps Script Access**: Keep "Anyone" for public API
- ✅ **Spreadsheet Permissions**: "Anyone with link can view"
- ✅ **HTTPS Only**: Ensure all connections use HTTPS

---

## 🎉 **HOÀN THÀNH!**

**🚀 Ứng dụng Task Management với full Google Sheets read/write integration đã sẵn sàng!**

### **✅ Tính năng đã có:**
- **📊 Bidirectional Sync**: App ↔ Google Sheets
- **⚡ Real-time Operations**: Instant CRUD operations
- **🛡️ Offline Support**: localStorage fallback
- **🔄 Auto Recovery**: Sync when back online
- **📱 Mobile Optimized**: Responsive design
- **🎨 Professional UI**: Loading states, error handling

**🎯 Ready for production use!**
