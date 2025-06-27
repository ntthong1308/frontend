# Tóm tắt các File SQL cho Test PatientDashboard

## 📁 Danh sách File SQL

### 1. `add_reason_column.sql`
**Mục đích**: Thêm trường `reason` vào bảng `appointment`
```sql
ALTER TABLE appointment ADD COLUMN reason VARCHAR(500) DEFAULT NULL;
UPDATE appointment SET reason = 'Khám tổng quát' WHERE reason IS NULL;
```

### 2. `update_status_enum.sql` ⭐ **MỚI**
**Mục đích**: Cập nhật enum `Status` để thêm trạng thái `CANCELLED`
```sql
ALTER TABLE appointment MODIFY COLUMN status ENUM('NOT_APPROVED', 'APPROVED', 'REJECTED', 'PENDING', 'COMPLETED', 'CANCELLED') DEFAULT NULL;
```

### 3. `test_patient_data.sql`
**Mục đích**: Tạo dữ liệu test đầy đủ cho PatientDashboard

**Nội dung chính**:
- 13 lịch hẹn cho patient ID 10 (dungpatient)
- 4 reviews cho các bác sĩ khác nhau
- 3 bệnh nhân phụ với lịch hẹn
- Cập nhật thông tin patient chính
- Thêm schedule cho các bác sĩ

**Dữ liệu lịch hẹn**:
- **PENDING**: 3 lịch hẹn (25-27/01/2025)
- **APPROVED**: 2 lịch hẹn (28-29/01/2025)  
- **COMPLETED**: 5 lịch hẹn (05-15/01/2025)
- **CANCELLED**: 2 lịch hẹn (18-20/01/2025) ⭐ **MỚI**
- **REJECTED**: 1 lịch hẹn (22/01/2025)

### 4. `create_test_accounts.sql`
**Mục đích**: Tạo tài khoản test cho bệnh nhân

**Tài khoản chính**:
- Username: `dungpatient`
- Password: `123456`
- Email: `dung.patient@example.com`

**Tài khoản phụ**:
- `minhpatient` / `123456`
- `hoapatient` / `123456`
- `hungpatient` / `123456`

## 🚀 Cách sử dụng

### Bước 1: Chạy Migration
```bash
mysql -u root -p medisched < add_reason_column.sql
```

### Bước 2: Cập nhật Enum Status ⭐ **MỚI**
```bash
mysql -u root -p medisched < update_status_enum.sql
```

### Bước 3: Tạo dữ liệu test
```bash
mysql -u root -p medisched < test_patient_data.sql
```

### Bước 4: Tạo tài khoản test
```bash
mysql -u root -p medisched < create_test_accounts.sql
```

## 📊 Dữ liệu Test được tạo

### Appointments
- **Tổng cộng**: 19 lịch hẹn
- **Patient 10 (dungpatient)**: 13 lịch hẹn
- **Patient 11-13**: 6 lịch hẹn

### Status Distribution
- **PENDING**: 6 lịch hẹn
- **APPROVED**: 2 lịch hẹn
- **COMPLETED**: 8 lịch hẹn
- **CANCELLED**: 2 lịch hẹn ⭐ **MỚI**
- **REJECTED**: 1 lịch hẹn

### Reviews
- **Tổng cộng**: 7 đánh giá
- **Patient 10**: 4 đánh giá
- **Patient 11-13**: 3 đánh giá

### Patients
- **Tổng cộng**: 4 bệnh nhân test
- **Có lịch hẹn**: 4 bệnh nhân
- **Có đánh giá**: 4 bệnh nhân

### Schedules
- **Tổng cộng**: 8 lịch làm việc
- **Ngày làm việc**: Thứ 2, 4, 6
- **Giờ làm việc**: 8:00 - 17:00

## 🔍 Kiểm tra dữ liệu

### Query kiểm tra appointments
```sql
SELECT 
    a.id,
    a.appointment_date,
    a.appointment_time,
    a.status,
    a.reason,
    CONCAT(p.first_name, ' ', p.last_name) as patient_name,
    CONCAT(d.user.first_name, ' ', d.user.last_name) as doctor_name
FROM appointment a
JOIN patient p ON a.patient_id = p.id
JOIN doctor d ON a.doctor_id = d.id
ORDER BY a.appointment_date DESC;
```

### Query kiểm tra reviews
```sql
SELECT 
    r.id,
    r.rating,
    r.comment,
    CONCAT(p.first_name, ' ', p.last_name) as patient_name,
    CONCAT(d.user.first_name, ' ', d.user.last_name) as doctor_name
FROM review r
JOIN patient p ON r.patient_id = p.id
JOIN doctor d ON r.doctor_id = d.id
ORDER BY r.created_at DESC;
```

### Query kiểm tra patients
```sql
SELECT 
    p.id,
    CONCAT(p.first_name, ' ', p.last_name) as patient_name,
    p.email,
    p.phone_number,
    p.role
FROM patient p
WHERE p.role = 'PATIENT'
ORDER BY p.id;
```

### Query kiểm tra enum Status ⭐ **MỚI**
```sql
SELECT DISTINCT status FROM appointment ORDER BY status;
DESCRIBE appointment;
```

## ⚠️ Lưu ý quan trọng

1. **Thứ tự chạy**: Chạy theo đúng thứ tự 1 → 2 → 3 → 4
2. **Backup**: Nên backup database trước khi chạy
3. **Enum Status**: Đảm bảo chạy `update_status_enum.sql` trước khi chạy dữ liệu test
4. **ID conflicts**: Các script sử dụng ID cố định, có thể cần điều chỉnh nếu có conflict
5. **Password**: Tất cả tài khoản test có password là `123456`
6. **Dates**: Dữ liệu sử dụng năm 2025, có thể cần cập nhật nếu test vào năm khác

## 🎯 Kết quả mong đợi

Sau khi chạy đầy đủ 4 file SQL:
- ✅ Database có đủ dữ liệu để test PatientDashboard
- ✅ Enum Status bao gồm CANCELLED
- ✅ Có thể đăng nhập với tài khoản `dungpatient`
- ✅ Dashboard hiển thị thống kê chính xác
- ✅ Bảng lịch hẹn có đủ các trạng thái khác nhau (bao gồm CANCELLED)
- ✅ Có dữ liệu để test chức năng đánh giá 