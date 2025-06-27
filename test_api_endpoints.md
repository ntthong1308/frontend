# Test API Endpoints để Debug

## 🔍 Kiểm tra API Endpoints

### 1. Test Login API
```bash
curl -X POST http://localhost:8080/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "dungpatient",
    "password": "123456"
  }'
```

### 2. Test Get My Appointments (với token)
```bash
# Thay TOKEN bằng token từ login response
curl -X GET http://localhost:8080/appointment/me \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json"
```

### 3. Test Update Appointment (Cancel)
```bash
# Thay TOKEN và APPOINTMENT_ID
curl -X PUT "http://localhost:8080/appointment/update/APPOINTMENT_ID?status=CANCELLED" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json"
```

### 4. Test Create Review
```bash
# Thay TOKEN và DOCTOR_ID
curl -X POST http://localhost:8080/review/evaluate \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": DOCTOR_ID,
    "rating": 5,
    "comment": "Bác sĩ rất tận tâm"
  }'
```

## 🐛 Debug Steps

### Bước 1: Kiểm tra Database
```bash
mysql -u root -p medisched < debug_patient_data.sql
```

### Bước 2: Kiểm tra Backend Logs
```bash
# Trong terminal chạy Spring Boot, xem logs khi:
# 1. Login
# 2. Get appointments
# 3. Cancel appointment
# 4. Create review
```

### Bước 3: Kiểm tra Frontend Console
```bash
# Mở Developer Tools (F12)
# Xem Console tab cho errors
# Xem Network tab cho API calls
```

## 🔧 Các vấn đề có thể gặp

### 1. Nút Cancel không hoạt động
**Nguyên nhân có thể:**
- Backend không cho phép patient update appointment
- Token không đúng
- Appointment ID không tồn tại
- Status không hợp lệ

**Cách debug:**
```bash
# Kiểm tra appointment có tồn tại không
SELECT * FROM appointment WHERE id = APPOINTMENT_ID AND patient_id = 10;

# Kiểm tra user có quyền không
SELECT u.role, p.id FROM users u 
JOIN patient p ON u.id = p.user_id 
WHERE u.username = 'dungpatient';
```

### 2. Nút Review không hiển thị
**Nguyên nhân có thể:**
- Appointment không có status COMPLETED
- Appointment đã có review
- Logic hasReview không đúng

**Cách debug:**
```bash
# Kiểm tra appointments COMPLETED
SELECT a.id, a.status, a.patient_id, a.doctor_id 
FROM appointment a 
WHERE a.patient_id = 10 AND a.status = 'COMPLETED';

# Kiểm tra reviews
SELECT r.patient_id, r.doctor_id 
FROM review r 
WHERE r.patient_id = 10;
```

### 3. API trả về lỗi
**Lỗi thường gặp:**
- 401 Unauthorized: Token hết hạn
- 403 Forbidden: Không có quyền
- 404 Not Found: Endpoint không tồn tại
- 500 Internal Server Error: Lỗi backend

## 📋 Test Cases

### Test Case 1: Login và lấy token
```bash
# 1. Login
curl -X POST http://localhost:8080/user/login \
  -H "Content-Type: application/json" \
  -d '{"username": "dungpatient", "password": "123456"}'

# 2. Copy token từ response
```

### Test Case 2: Lấy danh sách appointments
```bash
# Thay TOKEN
curl -X GET http://localhost:8080/appointment/me \
  -H "Authorization: Bearer TOKEN"
```

### Test Case 3: Hủy appointment
```bash
# Thay TOKEN và APPOINTMENT_ID
curl -X PUT "http://localhost:8080/appointment/update/APPOINTMENT_ID?status=CANCELLED" \
  -H "Authorization: Bearer TOKEN"
```

### Test Case 4: Tạo review
```bash
# Thay TOKEN và DOCTOR_ID
curl -X POST http://localhost:8080/review/evaluate \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"doctorId": DOCTOR_ID, "rating": 5, "comment": "Test review"}'
```

## 🎯 Expected Results

### Login Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 10,
    "username": "dungpatient",
    "role": "PATIENT"
  }
}
```

### Get Appointments Response:
```json
[
  {
    "id": 1,
    "appointmentDate": "2025-01-25",
    "appointmentTime": "09:00:00",
    "status": "PENDING",
    "reason": "Tư vấn chế độ ăn uống và dinh dưỡng",
    "doctorName": "Dr. Smith",
    "doctorSpecialty": "NUTRITION",
    "hasReview": false
  }
]
```

### Cancel Appointment Response:
```json
"Appointment status updated to CANCELLED"
```

### Create Review Response:
```json
"Review submitted successfully"
```

## 🔍 Troubleshooting

### Nếu gặp lỗi 401:
1. Kiểm tra token có đúng không
2. Token có hết hạn không
3. Header Authorization có đúng format không

### Nếu gặp lỗi 403:
1. Kiểm tra user role có đúng không
2. Kiểm tra user có quyền update appointment không

### Nếu gặp lỗi 404:
1. Kiểm tra endpoint URL có đúng không
2. Kiểm tra appointment ID có tồn tại không

### Nếu gặp lỗi 500:
1. Kiểm tra backend logs
2. Kiểm tra database connection
3. Kiểm tra enum Status có CANCELLED không 