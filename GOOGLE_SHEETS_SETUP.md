# 📊 Google Sheets Integration Setup Guide

## 🎯 Tổng quan

Hướng dẫn này sẽ giúp bạn thiết lập Google Sheets làm backend database cho ứng dụng Task Management.

## 📋 Bước 1: Tạo Google Sheet

### 1.1 Tạo Spreadsheet mới
1. Truy cập [Google Sheets](https://sheets.google.com)
2. Tạo spreadsheet mới
3. Đặt tên: **"Task Management Database"**

### 1.2 Thiết lập cấu trúc dữ liệu
Tạo sheet có tên **"Tasks"** với các cột sau:

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| **id** | **title** | **description** | **status** | **department** | **subtasks** | **createdAt** | **updatedAt** |
| task_1 | Thiết kế UI | Tạo mockup giao diện | todo | Design | [{"id":"sub1","title":"Research","completed":false}] | 2024-01-01T00:00:00Z | 2024-01-01T00:00:00Z |

### 1.3 Lấy Spreadsheet ID
- Từ URL: `https://docs.google.com/spreadsheets/d/1ABC123xyz/edit`
- **Spreadsheet ID**: `1ABC123xyz`

---

## 🔑 Bước 2: Tạo Google Cloud Project

### 2.1 Tạo Project
1. Truy cập [Google Cloud Console](https://console.cloud.google.com)
2. Tạo project mới: **"Task Management API"**
3. Chọn project vừa tạo

### 2.2 Enable Google Sheets API
1. Vào **APIs & Services** → **Library**
2. Tìm **"Google Sheets API"**
3. Click **Enable**

### 2.3 Tạo API Key
1. Vào **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **API key**
3. Copy API key (ví dụ: `AIzaSyABC123...`)
4. **Restrict API key**:
   - **Application restrictions**: HTTP referrers
   - **Website restrictions**: `http://localhost:*`, `https://yourdomain.com/*`
   - **API restrictions**: Google Sheets API

---

## ⚙️ Bước 3: Cấu hình ứng dụng

### 3.1 Tạo file environment
```bash
cd tqlcv
cp .env.example .env.local
```

### 3.2 Điền thông tin vào .env.local
```env
# Google Sheets API Key
VITE_GOOGLE_SHEETS_API_KEY=AIzaSyABC123xyz...

# Google Spreadsheet ID  
VITE_GOOGLE_SPREADSHEET_ID=1ABC123xyz...
```

### 3.3 Restart development server
```bash
npm run dev
```

---

## 🔒 Bước 4: Cấu hình quyền truy cập

### 4.1 Chia sẻ Google Sheet
1. Mở Google Sheet
2. Click **Share** (Chia sẻ)
3. Chọn **Anyone with the link** → **Viewer**
4. Copy link chia sẻ

### 4.2 Kiểm tra quyền
- **Read**: ✅ Tất cả users có thể đọc
- **Write**: ❌ Cần Service Account (tùy chọn nâng cao)

---

## 🧪 Bước 5: Test Integration

### 5.1 Kiểm tra kết nối
1. Mở ứng dụng: http://localhost:3001
2. Chọn user **NI** (Ninh)
3. Kiểm tra status bar:
   - 🟢 **Google Sheets**: Kết nối thành công
   - 🔴 **Offline**: Lỗi kết nối
   - 🟡 **LocalStorage**: Fallback mode

### 5.2 Test CRUD operations
- **✅ Read**: Tasks tự động load từ Google Sheets
- **✅ Create**: Thêm task mới (lưu vào localStorage)
- **✅ Update**: Chỉnh sửa task (lưu vào localStorage)  
- **✅ Delete**: Xóa task (lưu vào localStorage)

---

## 🔄 Bước 6: Sync Strategy

### 6.1 Hybrid Approach
- **Primary**: Google Sheets (read-only)
- **Fallback**: localStorage (read/write)
- **Cache**: 2 phút để tối ưu performance

### 6.2 Auto-sync
- **Interval**: 5 phút tự động refresh
- **Manual**: Click nút refresh 🔄
- **Error handling**: Tự động fallback localStorage

---

## 🚀 Bước 7: Production Deployment

### 7.1 Environment Variables
```env
# Production
VITE_GOOGLE_SHEETS_API_KEY=your_production_api_key
VITE_GOOGLE_SPREADSHEET_ID=your_production_sheet_id
```

### 7.2 API Key Security
- ✅ **Restrict by domain**: Chỉ cho phép domain production
- ✅ **Restrict by API**: Chỉ Google Sheets API
- ❌ **Never commit**: Không commit API key vào git

---

## 🛠️ Troubleshooting

### Lỗi thường gặp:

#### 1. "API key not valid"
```
❌ Lỗi: Google Sheets API error: Forbidden
✅ Giải pháp: Kiểm tra API key và restrictions
```

#### 2. "Spreadsheet not found"
```
❌ Lỗi: Google Sheets API error: Not Found  
✅ Giải pháp: Kiểm tra Spreadsheet ID và quyền chia sẻ
```

#### 3. "CORS error"
```
❌ Lỗi: Access to fetch blocked by CORS
✅ Giải pháp: Thêm domain vào API key restrictions
```

#### 4. "Quota exceeded"
```
❌ Lỗi: Quota exceeded for quota metric
✅ Giải pháp: Tăng cache duration hoặc upgrade quota
```

---

## 📊 Sample Data Format

### Google Sheets format:
```
id          | title              | description        | status      | department | subtasks                                    | createdAt                | updatedAt
task_1      | Thiết kế UI        | Tạo mockup        | todo        | Design     | [{"id":"sub1","title":"Research","completed":false}] | 2024-01-01T00:00:00Z | 2024-01-01T00:00:00Z
task_2      | Phát triển API     | Backend API       | in-progress | Development| [{"id":"sub2","title":"Setup","completed":true}]     | 2024-01-02T00:00:00Z | 2024-01-02T00:00:00Z
```

---

## 🎉 Hoàn thành!

**✅ Google Sheets Integration đã sẵn sàng!**

- **📊 Database**: Google Sheets
- **🔄 Sync**: Auto + Manual refresh  
- **💾 Fallback**: localStorage
- **🔒 Security**: API key restrictions
- **📱 Mobile**: Responsive design

**🚀 Ứng dụng Task Management với Google Sheets backend đã hoạt động!**
