# Hướng dẫn Test PatientDashboard

## Bước 1: Chuẩn bị Database

### 1.1 Chạy Migration Scripts
```bash
# Kết nối vào MySQL
mysql -u root -p

# Chọn database
USE medisched;

# Chạy script thêm trường reason
SOURCE add_reason_column.sql;

# Chạy script cập nhật enum Status
SOURCE update_status_enum.sql;

# Chạy script tạo dữ liệu test
SOURCE test_patient_data.sql;

# Chạy script tạo tài khoản test
SOURCE create_test_accounts.sql;
```

### 1.2 Kiểm tra dữ liệu đã được tạo
```sql
-- Kiểm tra appointments
SELECT COUNT(*) as total_appointments FROM appointment;

-- Kiểm tra reviews
SELECT COUNT(*) as total_reviews FROM review;

-- Kiểm tra patients
SELECT COUNT(*) as total_patients FROM patient WHERE role = 'PATIENT';

-- Kiểm tra enum Status đã được cập nhật
SELECT DISTINCT status FROM appointment ORDER BY status;
```

## Bước 2: Khởi động Backend

```bash
cd MediSched
./mvnw spring-boot:run
```

Đảm bảo backend chạy thành công trên port 8080.

## Bước 3: Khởi động Frontend

```bash
cd MediSched_main2_2/demo-master
npm start
```

Frontend sẽ chạy trên port 3000.

## Bước 4: Test PatientDashboard

### 4.1 Đăng nhập với tài khoản test

**Tài khoản chính (có nhiều dữ liệu):**
- Username: `dungpatient`
- Password: `123456`
- Email: `dung.patient@example.com`

**Tài khoản phụ (ít dữ liệu hơn):**
- Username: `minhpatient`
- Password: `123456`
- Username: `hoapatient`
- Password: `123456`
- Username: `hungpatient`
- Password: `123456`

### 4.2 Test các tính năng

#### A. Thống kê Dashboard
1. Đăng nhập với `dungpatient`
2. Kiểm tra 4 cards thống kê:
   - **Lịch hẹn sắp tới**: 5 lịch hẹn (PENDING + APPROVED)
   - **Đã khám**: 5 lịch hẹn (COMPLETED)
   - **Bác sĩ đã khám**: 5 bác sĩ khác nhau
   - **Chờ đánh giá**: 1 lịch hẹn (COMPLETED nhưng chưa có review)

#### B. Bảng lịch hẹn sắp tới
1. Kiểm tra bảng hiển thị:
   - Ngày & Giờ
   - Tên bác sĩ và chuyên khoa
   - Lý do khám
   - Trạng thái (PENDING, APPROVED)
   - Nút hành động (Xem chi tiết, Hủy lịch hẹn)

2. Test chức năng:
   - **Xem chi tiết**: Click nút "👁️" để mở modal
   - **Hủy lịch hẹn**: Click nút "❌" cho lịch hẹn PENDING

#### C. Modal chi tiết lịch hẹn
1. Click "Xem chi tiết" trên bất kỳ lịch hẹn nào
2. Kiểm tra thông tin hiển thị:
   - Thông tin bác sĩ (tên, chuyên khoa, khoa)
   - Thông tin lịch hẹn (ngày, giờ, trạng thái)
   - Lý do khám
   - Ghi chú của bác sĩ (nếu có)

#### D. Lịch sử khám gần đây
1. Kiểm tra phần "Lịch sử khám gần đây":
   - Hiển thị 5 lịch hẹn COMPLETED gần nhất
   - Thông tin bác sĩ và chuyên khoa
   - Ngày khám
   - Nút "Đánh giá" cho lịch hẹn chưa có review

#### E. Hành động nhanh
1. Test các nút:
   - **Đặt lịch khám mới**: Chuyển đến trang tìm bác sĩ
   - **Tìm bác sĩ**: Chuyển đến trang danh sách bác sĩ
   - **Cập nhật hồ sơ**: Chuyển đến trang profile
   - **Hỏi đáp y tế**: Chuyển đến chatbot

### 4.3 Test các trường hợp đặc biệt

#### A. Bệnh nhân không có lịch hẹn
1. Đăng nhập với tài khoản mới (chưa có lịch hẹn)
2. Kiểm tra:
   - Cards thống kê hiển thị 0
   - Bảng lịch hẹn hiển thị thông báo "Bạn chưa có lịch hẹn nào"
   - Nút "Đặt lịch khám ngay"

#### B. Lịch hẹn đã hủy/từ chối
1. Kiểm tra lịch hẹn CANCELLED/REJECTED không hiển thị trong "Lịch hẹn sắp tới"
2. Chỉ hiển thị trong lịch sử

#### C. Đánh giá bác sĩ
1. Tìm lịch hẹn COMPLETED chưa có review
2. Click nút "Đánh giá"
3. Kiểm tra chức năng đánh giá (nếu có)

### 4.4 Test Responsive Design
1. Thay đổi kích thước màn hình
2. Kiểm tra trên mobile (F12 -> Device toolbar)
3. Đảm bảo giao diện hiển thị tốt trên các thiết bị

## Bước 5: Test API Endpoints

### 5.1 Test với Postman hoặc curl

#### Lấy thông tin bệnh nhân
```bash
curl -X GET "http://localhost:8080/patient/me" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Lấy lịch hẹn của bệnh nhân
```bash
curl -X GET "http://localhost:8080/appointment/me" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Hủy lịch hẹn
```bash
curl -X PUT "http://localhost:8080/appointment/update/APPOINTMENT_ID?status=CANCELLED" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5.2 Kiểm tra Response
- Status code: 200 OK
- Dữ liệu trả về đúng format
- Thông tin đầy đủ (doctorName, doctorSpecialty, departmentName, hasReview)

## Bước 6: Test Error Handling

### 6.1 Network Error
1. Tắt backend
2. Refresh trang PatientDashboard
3. Kiểm tra hiển thị thông báo lỗi

### 6.2 Invalid Token
1. Xóa token trong localStorage
2. Refresh trang
3. Kiểm tra redirect về trang login

### 6.3 Server Error
1. Gây lỗi database
2. Kiểm tra hiển thị thông báo lỗi phù hợp

## Dữ liệu Test Mẫu

### Lịch hẹn cho dungpatient (ID: 10)
- **PENDING**: 3 lịch hẹn (25-27/01/2025)
- **APPROVED**: 2 lịch hẹn (28-29/01/2025)
- **COMPLETED**: 5 lịch hẹn (05-15/01/2025)
- **CANCELLED**: 2 lịch hẹn (18-20/01/2025)
- **REJECTED**: 1 lịch hẹn (22/01/2025)

### Reviews cho dungpatient
- 4 đánh giá cho các bác sĩ khác nhau
- Rating từ 4-5 sao
- Comments chi tiết

## Troubleshooting

### Lỗi thường gặp

1. **Database connection error**
   - Kiểm tra MySQL service
   - Kiểm tra thông tin kết nối trong application.properties

2. **JWT token expired**
   - Đăng nhập lại
   - Kiểm tra token trong localStorage

3. **CORS error**
   - Kiểm tra CORS configuration trong backend
   - Đảm bảo frontend và backend chạy đúng port

4. **Data not loading**
   - Kiểm tra API endpoints
   - Kiểm tra database có dữ liệu
   - Kiểm tra console errors

### Logs cần kiểm tra
- Backend logs: `MediSched/logs/`
- Frontend console: F12 -> Console
- Network tab: F12 -> Network

## Kết quả mong đợi

✅ **Dashboard hiển thị đúng thống kê**
✅ **Bảng lịch hẹn hiển thị đầy đủ thông tin**
✅ **Modal chi tiết hoạt động tốt**
✅ **Chức năng hủy lịch hẹn hoạt động**
✅ **Responsive design trên mobile**
✅ **Error handling phù hợp**
✅ **Loading states mượt mà**
✅ **Toast notifications hiển thị đúng** 