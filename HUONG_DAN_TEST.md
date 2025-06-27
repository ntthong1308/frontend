# HƯỚNG DẪN TEST DOCTOR DASHBOARD

## 🔧 Cài đặt và Chạy

### 1. Backend (Spring Boot)
```bash
cd MediSched
mvn spring-boot:run
```
- Backend sẽ chạy tại: http://localhost:8080

### 2. Frontend (React)
```bash
cd MediSched_main2_2/demo-master
npm install
npm start
```
- Frontend sẽ chạy tại: http://localhost:3000

### 3. Database
- Import file `medished1.sql` vào MySQL
- Chạy file `test_data.sql` để thêm dữ liệu test

## 🧪 Dữ liệu Test

### Tài khoản Bác sĩ để Test:
- **Username:** `hoainam001`
- **Password:** `123456`
- **Tên:** Le Hoai Nam
- **Chuyên khoa:** Cardiology

### Tài khoản Bác sĩ khác:
- **Username:** `chautran02`
- **Password:** `123456`
- **Tên:** Tran Bao Chau
- **Chuyên khoa:** Orthopedics

## 📊 Dữ liệu Test được Tạo

### Lịch hẹn cho hôm nay:
- **3 lịch hẹn PENDING** (chờ xác nhận)
- **2 lịch hẹn APPROVED** (đã xác nhận)
- **1 lịch hẹn COMPLETED** (hoàn thành)

### Lịch hẹn cho ngày mai:
- **3 lịch hẹn PENDING**

### Đánh giá:
- **8 đánh giá** từ bệnh nhân với rating 4-5 sao

## 🎯 Các Trạng thái Lịch hẹn

| Trạng thái | Mô tả | Màu sắc |
|------------|-------|---------|
| `PENDING` | Chờ xác nhận | Vàng |
| `APPROVED` | Đã xác nhận | Xanh lá |
| `COMPLETED` | Hoàn thành | Xanh dương |
| `REJECTED` | Đã từ chối | Đỏ |
| `NOT_APPROVED` | Chưa duyệt | Xám |

## 🚀 Test các Tính năng

### 1. Đăng nhập và Truy cập Dashboard
1. Mở http://localhost:3000
2. Đăng nhập với `hoainam001` / `123456`
3. Chuyển đến Doctor Dashboard

### 2. Xem Thống kê
- **Tổng lịch hẹn hôm nay:** 6
- **Lịch hẹn chờ xác nhận:** 3
- **Lịch hẹn đã xác nhận:** 2
- **Lịch hẹn hoàn thành:** 1
- **Tổng bệnh nhân:** 8

### 3. Xác nhận Lịch hẹn
1. Tìm lịch hẹn có trạng thái "Chờ xác nhận"
2. Click nút ✓ màu xanh
3. Kiểm tra trạng thái chuyển thành "Đã xác nhận"

### 4. Hoàn thành Lịch hẹn
1. Tìm lịch hẹn có trạng thái "Đã xác nhận"
2. Click nút ✓ màu xanh dương
3. Kiểm tra trạng thái chuyển thành "Hoàn thành"

### 5. Xem Chi tiết và Thêm Ghi chú
1. Click icon 👁️ bên cạnh lịch hẹn
2. Modal hiển thị thông tin chi tiết
3. Thêm ghi chú vào ô "Ghi chú"
4. Click "Lưu ghi chú"
5. Kiểm tra ghi chú đã được lưu

### 6. Lọc Lịch hẹn
1. Sử dụng các nút filter:
   - **Tất cả:** Hiển thị tất cả lịch hẹn
   - **Chờ xác nhận:** Chỉ hiển thị PENDING
   - **Đã xác nhận:** Chỉ hiển thị APPROVED
   - **Hoàn thành:** Chỉ hiển thị COMPLETED

### 7. Xem Đánh giá
- Dashboard hiển thị rating trung bình
- Có thể xem danh sách đánh giá chi tiết

## 🔍 Kiểm tra Backend API

### API Endpoints:
- `GET /appointment/getBy-doctor` - Lấy lịch hẹn của bác sĩ
- `PUT /appointment/update/{id}?status=APPROVED` - Cập nhật trạng thái
- `PUT /appointment/update/{id}?status=COMPLETED` - Hoàn thành lịch hẹn
- `PUT /appointment/update/{id}?status=APPROVED&note=Ghi chú` - Thêm ghi chú

### Test với Postman:
```bash
# Lấy lịch hẹn
GET http://localhost:8080/appointment/getBy-doctor
Authorization: Bearer {JWT_TOKEN}

# Cập nhật trạng thái
PUT http://localhost:8080/appointment/update/14?status=APPROVED
Authorization: Bearer {JWT_TOKEN}

# Thêm ghi chú
PUT http://localhost:8080/appointment/update/14?status=APPROVED&note=Khám tổng quát
Authorization: Bearer {JWT_TOKEN}
```

## ⚠️ Lưu ý Quan trọng

### Trạng thái đã được sửa:
- ❌ **Cũ:** `CONFIRMED` 
- ✅ **Mới:** `APPROVED`

### Các file đã được cập nhật:
1. `DoctorDashboard.jsx` - Sửa trạng thái CONFIRMED → APPROVED
2. `DoctorAppointment.js` - Sửa trạng thái và mapping
3. `test_data.sql` - Cập nhật dữ liệu test
4. `HUONG_DAN_TEST.md` - Cập nhật hướng dẫn

### Nếu gặp lỗi:
1. **Kiểm tra database:** Đảm bảo đã import đúng file SQL
2. **Kiểm tra backend:** Đảm bảo Spring Boot đang chạy
3. **Kiểm tra frontend:** Đảm bảo React đang chạy
4. **Kiểm tra console:** Xem lỗi trong Developer Tools

## 🔐 JWT Authentication Troubleshooting

### Nếu gặp lỗi JWT:
```
io.jsonwebtoken.MalformedJwtException: Invalid compact JWT string
```

### Giải pháp:

#### 1. Clear Browser Storage
```javascript
// Mở Developer Tools (F12) và chạy:
localStorage.clear()
sessionStorage.clear()
```

#### 2. Test Login API
```bash
curl -X POST http://localhost:8080/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "hoainam001",
    "password": "123456"
  }'
```

#### 3. Kiểm tra Token
```javascript
// Trong console browser:
console.log("Token:", localStorage.getItem("token"))
console.log("User:", localStorage.getItem("user"))
```

#### 4. Restart Backend
```bash
# Dừng backend (Ctrl+C)
# Chạy lại:
cd MediSched
mvn spring-boot:run
```

#### 5. Kiểm tra application.properties
```properties
# Đảm bảo có dòng này:
jwtSecretString=your-secret-key-here-make-it-long-and-secure
```

### Các thay đổi JWT đã thực hiện:
1. **Backend:** Sửa UserController trả về token trong body
2. **Backend:** Sửa UserServiceImp không thêm "Bearer" prefix
3. **Backend:** Cải thiện JwtAuthenticationFilter xử lý token rỗng
4. **Frontend:** Cải thiện API interceptor kiểm tra token hợp lệ
5. **Frontend:** Cải thiện AuthContext validation token

## 🎉 Kết quả Mong đợi

Sau khi test thành công, bạn sẽ thấy:
- ✅ Dashboard hiển thị đúng thống kê
- ✅ Có thể xác nhận lịch hẹn PENDING → APPROVED
- ✅ Có thể hoàn thành lịch hẹn APPROVED → COMPLETED
- ✅ Có thể thêm và lưu ghi chú
- ✅ Filter hoạt động chính xác
- ✅ Hiển thị đánh giá từ bệnh nhân
- ✅ UI responsive và đẹp mắt 