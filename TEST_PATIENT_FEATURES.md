# Hướng dẫn Test PatientDashboard - Các chức năng đã sửa

## 🎯 Các chức năng đã được sửa

### ✅ 1. Xem tất cả lịch hẹn
- **Trang mới**: `/patient/appointments`
- **Chức năng**: Hiển thị tất cả lịch hẹn với bộ lọc theo trạng thái
- **Tính năng**:
  - Lọc theo trạng thái (Tất cả, PENDING, APPROVED, COMPLETED, CANCELLED, REJECTED)
  - Xem chi tiết lịch hẹn
  - Hủy lịch hẹn (chỉ lịch PENDING)
  - Đánh giá bác sĩ (chỉ lịch COMPLETED chưa đánh giá)

### ✅ 2. Hủy lịch hẹn
- **Chức năng**: Hủy lịch hẹn với trạng thái CANCELLED
- **Vị trí**: 
  - Trong PatientDashboard (lịch sắp tới)
  - Trong trang "Tất cả lịch hẹn"
- **Điều kiện**: Chỉ có thể hủy lịch hẹn có trạng thái PENDING

### ✅ 3. Đánh giá bác sĩ
- **Chức năng**: Đánh giá bác sĩ sau khi khám xong
- **Vị trí**:
  - Trong PatientDashboard (lịch sử khám gần đây)
  - Trong trang "Tất cả lịch hẹn"
- **Điều kiện**: Chỉ có thể đánh giá lịch hẹn có trạng thái COMPLETED và chưa đánh giá

## 🚀 Cách test

### Bước 1: Setup Database
```bash
# Chạy script setup nhanh
mysql -u root -p medisched < QUICK_SETUP.sql
```

### Bước 2: Khởi động ứng dụng
```bash
# Backend (port 8080)
cd MediSched
./mvnw spring-boot:run

# Frontend (port 3000)
cd MediSched_main2_2/demo-master
npm start
```

### Bước 3: Đăng nhập test
- **URL**: http://localhost:3000/login
- **Tài khoản**: `dungpatient`
- **Mật khẩu**: `123456`

## 📋 Test Cases

### Test Case 1: Xem tất cả lịch hẹn
1. **Đăng nhập** với tài khoản `dungpatient`
2. **Vào PatientDashboard** (http://localhost:3000/patient)
3. **Click nút "Xem tất cả lịch"** trong phần "Lịch hẹn sắp tới"
4. **Kiểm tra**:
   - ✅ Chuyển đến trang `/patient/appointments`
   - ✅ Hiển thị tất cả 13 lịch hẹn
   - ✅ Có bộ lọc theo trạng thái
   - ✅ Hiển thị đúng thông tin: ngày, giờ, bác sĩ, chuyên khoa, lý do khám

### Test Case 2: Lọc lịch hẹn
1. **Vào trang "Tất cả lịch hẹn"**
2. **Test các bộ lọc**:
   - **Tất cả**: Hiển thị 13 lịch hẹn
   - **Chờ xác nhận**: Hiển thị 3 lịch hẹn PENDING
   - **Đã xác nhận**: Hiển thị 2 lịch hẹn APPROVED
   - **Hoàn thành**: Hiển thị 5 lịch hẹn COMPLETED
   - **Đã hủy**: Hiển thị 2 lịch hẹn CANCELLED
   - **Đã từ chối**: Hiển thị 1 lịch hẹn REJECTED

### Test Case 3: Hủy lịch hẹn
1. **Vào trang "Tất cả lịch hẹn"**
2. **Lọc theo "Chờ xác nhận"**
3. **Click nút "X" (hủy)** trên lịch hẹn PENDING
4. **Kiểm tra**:
   - ✅ Hiển thị thông báo "Đã hủy lịch hẹn thành công!"
   - ✅ Trạng thái lịch hẹn chuyển thành "Đã hủy"
   - ✅ Nút hủy biến mất
   - ✅ Số lượng lịch hẹn PENDING giảm

### Test Case 4: Xem chi tiết lịch hẹn
1. **Vào trang "Tất cả lịch hẹn"**
2. **Click nút "👁️" (xem chi tiết)** trên bất kỳ lịch hẹn nào
3. **Kiểm tra modal**:
   - ✅ Hiển thị thông tin bác sĩ đầy đủ
   - ✅ Hiển thị thông tin lịch hẹn
   - ✅ Hiển thị lý do khám
   - ✅ Có nút "Hủy lịch hẹn" nếu là lịch PENDING

### Test Case 5: Đánh giá bác sĩ
1. **Vào trang "Tất cả lịch hẹn"**
2. **Lọc theo "Hoàn thành"**
3. **Click nút "⭐" (đánh giá)** trên lịch hẹn COMPLETED chưa đánh giá
4. **Điền đánh giá**:
   - Chọn số sao (1-5)
   - Viết nhận xét
5. **Click "Gửi đánh giá"**
6. **Kiểm tra**:
   - ✅ Hiển thị thông báo "Đánh giá đã được gửi thành công!"
   - ✅ Nút đánh giá biến mất
   - ✅ Số "Chờ đánh giá" trong dashboard giảm

### Test Case 6: Đánh giá từ Dashboard
1. **Vào PatientDashboard** (http://localhost:3000/patient)
2. **Trong phần "Lịch sử khám gần đây"**
3. **Click nút "Đánh giá"** trên lịch hẹn COMPLETED
4. **Thực hiện đánh giá** như Test Case 5
5. **Kiểm tra**:
   - ✅ Modal đánh giá hiển thị đúng
   - ✅ Có thể chọn sao và viết nhận xét
   - ✅ Gửi đánh giá thành công

### Test Case 7: Hủy lịch từ Dashboard
1. **Vào PatientDashboard**
2. **Trong phần "Lịch hẹn sắp tới"**
3. **Click nút "X" (hủy)** trên lịch hẹn PENDING
4. **Kiểm tra**:
   - ✅ Lịch hẹn biến mất khỏi danh sách
   - ✅ Số "Lịch hẹn sắp tới" giảm
   - ✅ Thông báo thành công

### Test Case 8: Responsive Design
1. **Test trên mobile** (F12 → Device Toolbar)
2. **Kiểm tra**:
   - ✅ Bảng lịch hẹn responsive
   - ✅ Modal hiển thị đúng trên mobile
   - ✅ Nút bấm dễ thao tác trên touch

## 🐛 Các lỗi đã sửa

### ❌ Trước đây:
- Không có trang xem tất cả lịch hẹn
- Không thể hủy lịch hẹn (CANCELLED không có trong enum)
- Không thể đánh giá bác sĩ
- Nút "Xem tất cả lịch" không hoạt động

### ✅ Hiện tại:
- ✅ Có trang `/patient/appointments` đầy đủ chức năng
- ✅ Có thể hủy lịch hẹn với trạng thái CANCELLED
- ✅ Có thể đánh giá bác sĩ với modal đẹp
- ✅ Nút "Xem tất cả lịch" link đúng trang
- ✅ Bộ lọc theo trạng thái hoạt động
- ✅ Responsive design

## 📊 Dữ liệu test

### Lịch hẹn test:
- **PENDING**: 3 lịch (25-27/01/2025)
- **APPROVED**: 2 lịch (28-29/01/2025)
- **COMPLETED**: 5 lịch (05-15/01/2025) - có thể đánh giá
- **CANCELLED**: 2 lịch (18-20/01/2025)
- **REJECTED**: 1 lịch (22/01/2025)

### Tài khoản test:
- **Username**: `dungpatient`
- **Password**: `123456`
- **Email**: `dung.patient@example.com`

## 🎯 Kết quả mong đợi

Sau khi test đầy đủ:
- ✅ Có thể xem tất cả lịch hẹn với bộ lọc
- ✅ Có thể hủy lịch hẹn PENDING
- ✅ Có thể đánh giá bác sĩ cho lịch COMPLETED
- ✅ UI/UX đẹp và responsive
- ✅ Thông báo thành công/lỗi rõ ràng
- ✅ Dữ liệu được cập nhật real-time

## 🔧 Troubleshooting

### Nếu gặp lỗi:
1. **Kiểm tra database**: Chạy lại `QUICK_SETUP.sql`
2. **Kiểm tra backend**: Đảm bảo Spring Boot chạy trên port 8080
3. **Kiểm tra frontend**: Đảm bảo React chạy trên port 3000
4. **Kiểm tra console**: Xem lỗi trong Developer Tools
5. **Kiểm tra network**: Xem API calls trong Network tab

### Lỗi thường gặp:
- **401 Unauthorized**: Token hết hạn, đăng nhập lại
- **404 Not Found**: API endpoint không đúng
- **500 Internal Server Error**: Lỗi backend, kiểm tra logs 