# 🔧 Sửa các vấn đề PatientDashboard

## 🚨 Vấn đề hiện tại
1. **Nút Cancel không hủy được lịch hẹn**
2. **Nút đánh giá không hiển thị**

## ✅ Giải pháp đã thực hiện

### 1. Sửa Backend - Cho phép Patient hủy lịch hẹn
**File**: `MediSched/src/main/java/com/CareBook/MediSched/Service/ServiceImp/AppointmentServiceImp.java`

**Thay đổi**: Sửa method `updateAppointment` để cho phép patient cập nhật lịch hẹn của mình

```java
@Override
public String updateAppointment(Long appointmentId, User user, String status, String note) {
    Appointment appointment = appointmentRepository.findById(appointmentId)
        .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));

    // Check if user is doctor and owns this appointment
    if(user.getRole().equals(Role.DOCTOR)){
        if(!user.getDoctor().getId().equals(appointment.getDoctor().getId())){
            throw new RuntimeException("You don't have permission to update this appointment");
        }
    }
    // Check if user is patient and owns this appointment
    else if(user.getRole().equals(Role.PATIENT)){
        if(!user.getPatient().getId().equals(appointment.getPatient().getId())){
            throw new RuntimeException("You don't have permission to update this appointment");
        }
    }
    // Admin can update any appointment
    else if(!user.getRole().equals(Role.ADMIN)){
        throw new RuntimeException("You don't have permission to update appointments");
    }

    Status newStatus;
    try{
        newStatus = Status.valueOf(status.trim().toUpperCase());
    }catch (IllegalArgumentException e){
        throw new RuntimeException("Invalid status: " + status);
    }

    appointment.setStatus(newStatus);
    
    if (note != null && !note.trim().isEmpty()) {
        appointment.setNote(note);
    }
    
    appointmentRepository.save(appointment);
    return "Appointment status updated to " + newStatus;
}
```

### 2. Thêm trạng thái CANCELLED
**File**: `MediSched/src/main/java/com/CareBook/MediSched/Model/Status.java`

**Thay đổi**: Thêm `CANCELLED` vào enum

```java
public enum Status {
    NOT_APPROVED,
    APPROVED,
    REJECTED,
    PENDING,
    COMPLETED,
    CANCELLED
}
```

### 3. Cập nhật Database
**File**: `update_status_enum.sql`

```sql
ALTER TABLE appointment MODIFY COLUMN status ENUM('NOT_APPROVED', 'APPROVED', 'REJECTED', 'PENDING', 'COMPLETED', 'CANCELLED') DEFAULT NULL;
```

## 🚀 Cách khắc phục

### Bước 1: Restart Backend
```bash
# Dừng Spring Boot (Ctrl+C)
# Khởi động lại
cd MediSched
./mvnw spring-boot:run
```

### Bước 2: Reset Database
```bash
# Chạy script reset để có dữ liệu sạch
mysql -u root -p medisched < reset_and_setup.sql
```

### Bước 3: Test lại
```bash
# Khởi động frontend
cd MediSched_main2_2/demo-master
npm start

# Đăng nhập test
# URL: http://localhost:3000/login
# Tài khoản: dungpatient / 123456
```

## 🔍 Debug nếu vẫn có vấn đề

### 1. Kiểm tra Database
```bash
# Chạy script debug
mysql -u root -p medisched < debug_patient_data.sql
```

### 2. Kiểm tra API
```bash
# Test API endpoints
# Xem file: test_api_endpoints.md
```

### 3. Kiểm tra Console
```bash
# Mở Developer Tools (F12)
# Xem Console tab cho errors
# Xem Network tab cho API calls
```

## 📋 Test Cases

### Test Cancel Appointment
1. **Đăng nhập** với `dungpatient`
2. **Vào** `/patient/appointments`
3. **Lọc** theo "Chờ xác nhận"
4. **Click nút "X"** trên lịch hẹn PENDING
5. **Kiểm tra**:
   - ✅ Thông báo "Đã hủy lịch hẹn thành công!"
   - ✅ Trạng thái chuyển thành "Đã hủy"
   - ✅ Nút hủy biến mất

### Test Review Appointment
1. **Vào** `/patient/appointments`
2. **Lọc** theo "Hoàn thành"
3. **Click nút "⭐"** trên lịch hẹn COMPLETED chưa đánh giá
4. **Điền đánh giá**:
   - Chọn số sao (1-5)
   - Viết nhận xét
5. **Click "Gửi đánh giá"**
6. **Kiểm tra**:
   - ✅ Thông báo "Đánh giá đã được gửi thành công!"
   - ✅ Nút đánh giá biến mất

## 🐛 Các lỗi có thể gặp

### Lỗi 403 Forbidden
**Nguyên nhân**: Backend chưa được restart sau khi sửa code
**Giải pháp**: Restart Spring Boot

### Lỗi 500 Internal Server Error
**Nguyên nhân**: Enum Status chưa có CANCELLED
**Giải pháp**: Chạy `update_status_enum.sql`

### Nút không hiển thị
**Nguyên nhân**: Dữ liệu không đúng
**Giải pháp**: Chạy `reset_and_setup.sql`

### API không response
**Nguyên nhân**: Backend không chạy
**Giải pháp**: Kiểm tra Spring Boot logs

## 📊 Dữ liệu test sau khi reset

### Appointments của patient 10:
- **PENDING**: 3 lịch (có thể hủy)
- **APPROVED**: 2 lịch
- **COMPLETED**: 5 lịch (3 lịch chưa đánh giá)
- **CANCELLED**: 2 lịch
- **REJECTED**: 1 lịch

### Reviews:
- **Đã có**: 2 reviews
- **Chưa có**: 3 lịch COMPLETED

## 🎯 Kết quả mong đợi

Sau khi thực hiện các bước trên:
- ✅ Nút Cancel hoạt động cho lịch hẹn PENDING
- ✅ Nút Review hiển thị cho lịch hẹn COMPLETED chưa đánh giá
- ✅ API trả về đúng response
- ✅ Database có dữ liệu sạch để test

## 📞 Hỗ trợ

Nếu vẫn gặp vấn đề:
1. **Kiểm tra logs** của Spring Boot
2. **Kiểm tra Console** của browser
3. **Chạy script debug** để xem dữ liệu
4. **Test API** trực tiếp với curl 