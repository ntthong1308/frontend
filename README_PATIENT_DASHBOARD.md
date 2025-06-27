# Cập nhật PatientDashboard

## Tổng quan
Đã cập nhật giao diện bảng điều khiển bệnh nhân để giống với bảng điều khiển bác sĩ và kết nối với backend thay vì sử dụng mock data.

## Các thay đổi chính

### 1. Frontend (React)

#### PatientDashboard.jsx
- **Thiết kế mới**: Áp dụng thiết kế giống DoctorDashboard với:
  - Cards thống kê với hiệu ứng hover và shadow
  - Bảng lịch hẹn với header gradient
  - Modal chi tiết lịch hẹn
  - Loading spinner với animation
  - Toast notifications

- **Kết nối Backend**: Thay thế mock data bằng API calls:
  - `patientAPI.getProfile()` - Lấy thông tin bệnh nhân
  - `appointmentAPI.getMyAppointments()` - Lấy tất cả lịch hẹn
  - `appointmentAPI.update()` - Cập nhật trạng thái lịch hẹn

- **Tính năng mới**:
  - Hủy lịch hẹn (cho lịch hẹn PENDING)
  - Xem chi tiết lịch hẹn trong modal
  - Hiển thị thông tin bác sĩ và khoa
  - Kiểm tra lịch hẹn đã đánh giá chưa

#### BookAppointment.jsx
- Cập nhật để gửi trường `reason` thay vì `symptoms` cho backend

### 2. Backend (Spring Boot)

#### AppointmentDto.java
- Thêm trường `departmentName` - Tên khoa của bác sĩ
- Thêm trường `hasReview` - Kiểm tra lịch hẹn đã có đánh giá chưa

#### Appointment.java
- Thêm trường `reason` - Lý do khám bệnh

#### AppointmentServiceImp.java
- Cập nhật `mapToAppointmentDto()` để:
  - Map thông tin khoa từ doctor.department
  - Kiểm tra review tồn tại
  - Map trường reason

#### ReviewRepository.java
- Thêm method `existsByPatientAndDoctor()` để kiểm tra review

### 3. Database

#### Migration Script (add_reason_column.sql)
```sql
-- Thêm trường reason vào bảng appointment
ALTER TABLE appointment ADD COLUMN reason VARCHAR(500) DEFAULT NULL;

-- Cập nhật dữ liệu hiện tại
UPDATE appointment SET reason = 'Khám tổng quát' WHERE reason IS NULL;
```

## Cách sử dụng

### 1. Chạy Migration Database
```bash
# Kết nối vào MySQL và chạy script
mysql -u username -p medisched < add_reason_column.sql
```

### 2. Khởi động Backend
```bash
cd MediSched
./mvnw spring-boot:run
```

### 3. Khởi động Frontend
```bash
cd MediSched_main2_2/demo-master
npm start
```

## Tính năng mới

### Dashboard Bệnh nhân
1. **Thống kê tổng quan**:
   - Lịch hẹn sắp tới
   - Số lịch hẹn đã hoàn thành
   - Số bác sĩ đã khám
   - Số lịch hẹn chờ đánh giá

2. **Quản lý lịch hẹn**:
   - Xem danh sách lịch hẹn sắp tới
   - Hủy lịch hẹn (nếu đang PENDING)
   - Xem chi tiết lịch hẹn
   - Đánh giá bác sĩ (cho lịch hẹn đã hoàn thành)

3. **Hành động nhanh**:
   - Đặt lịch khám mới
   - Tìm bác sĩ
   - Cập nhật hồ sơ
   - Hỏi đáp y tế

### Cải thiện UX
- Loading states với spinner
- Toast notifications cho các hành động
- Modal chi tiết lịch hẹn
- Responsive design
- Hiệu ứng hover và animation

## API Endpoints sử dụng

### Patient
- `GET /patient/me` - Lấy thông tin bệnh nhân

### Appointment
- `GET /appointment/me` - Lấy lịch hẹn của bệnh nhân
- `PUT /appointment/update/{id}?status=CANCELLED` - Hủy lịch hẹn
- `POST /appointment/book` - Đặt lịch hẹn mới

### Review
- `GET /review/get-all/{doctorId}` - Lấy đánh giá của bác sĩ

## Lưu ý
- Đảm bảo backend đang chạy trước khi test frontend
- Kiểm tra kết nối database và chạy migration script
- Có thể cần restart backend sau khi thêm trường mới vào database 