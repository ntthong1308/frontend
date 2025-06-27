# Doctor Dashboard - MediSched

## Tổng quan
Dashboard bác sĩ đã được cập nhật với giao diện mới và kết nối backend thực thay vì sử dụng mock data.

## Tính năng mới

### 1. Dashboard chính (`/doctor/dashboard`)
- **Thống kê thời gian thực**: Hiển thị số lịch hẹn hôm nay, chờ xác nhận, hoàn thành và tổng bệnh nhân
- **Lịch hẹn hôm nay**: Bảng hiển thị các lịch hẹn trong ngày với thông tin chi tiết
- **Hành động nhanh**: Xác nhận, hoàn thành lịch hẹn trực tiếp từ dashboard
- **Thông tin cá nhân**: Hiển thị đánh giá, chuyên khoa, phòng khám và phí khám
- **Modal chi tiết**: Xem và chỉnh sửa thông tin lịch hẹn

### 2. Quản lý lịch hẹn (`/doctor/appointments`)
- **Thống kê tổng quan**: Tổng lịch hẹn, chờ xác nhận, đã xác nhận, hoàn thành
- **Bộ lọc**: Lọc lịch hẹn theo trạng thái (Tất cả, Chờ xác nhận, Đã xác nhận, Hoàn thành)
- **Bảng lịch hẹn**: Hiển thị đầy đủ thông tin bệnh nhân và lịch hẹn
- **Hành động**: Xác nhận, hoàn thành và xem chi tiết lịch hẹn
- **Ghi chú**: Thêm và chỉnh sửa ghi chú cho từng lịch hẹn

## API Endpoints được sử dụng

### Backend Endpoints
- `GET /doctor/me` - Lấy thông tin profile bác sĩ
- `GET /appointment/getBy-doctor` - Lấy tất cả lịch hẹn của bác sĩ
- `PUT /appointment/update/{appointmentId}` - Cập nhật trạng thái và ghi chú lịch hẹn
- `GET /review/get-all/{doctorId}` - Lấy đánh giá của bác sĩ

### Frontend API Service
- `doctorAPI.getProfile()` - Lấy thông tin bác sĩ
- `appointmentAPI.getByDoctor()` - Lấy lịch hẹn của bác sĩ
- `appointmentAPI.update()` - Cập nhật lịch hẹn
- `reviewAPI.getByDoctor()` - Lấy đánh giá

## Cải tiến giao diện

### 1. CSS Classes mới
- `.dashboard-stats-card` - Card thống kê với hiệu ứng hover
- `.dashboard-stats-icon` - Icon trong card thống kê
- `.dashboard-stats-number` - Số liệu thống kê
- `.dashboard-stats-label` - Nhãn thống kê
- `.dashboard-table` - Bảng với style mới
- `.dashboard-card` - Card với shadow và border radius
- `.dashboard-card-header` - Header card với gradient
- `.action-btn` - Button với hiệu ứng hover
- `.dashboard-loading` - Loading spinner
- `.dashboard-alert` - Alert với style mới
- `.dashboard-modal` - Modal với style mới

### 2. Responsive Design
- Tối ưu cho mobile và tablet
- Grid system linh hoạt
- Font size và spacing phù hợp

### 3. Animations
- Hover effects trên cards và buttons
- Smooth transitions
- Loading animations

## Cách sử dụng

### 1. Khởi chạy ứng dụng
```bash
cd MediSched_main2_2/demo-master
npm start
```

### 2. Đăng nhập với tài khoản bác sĩ
- Truy cập `/login`
- Đăng nhập với tài khoản có role DOCTOR

### 3. Truy cập Dashboard
- Sau khi đăng nhập, chuyển đến `/doctor/dashboard`
- Hoặc click vào menu "Dashboard" trong navigation

### 4. Quản lý lịch hẹn
- Click "Xem tất cả lịch" để đến trang quản lý lịch hẹn
- Sử dụng bộ lọc để tìm lịch hẹn theo trạng thái
- Click các button hành động để xác nhận/hoàn thành lịch hẹn
- Click icon "mắt" để xem chi tiết và thêm ghi chú

## Lưu ý kỹ thuật

### 1. Backend Requirements
- Spring Boot application phải đang chạy trên port 8080
- Database phải có dữ liệu bác sĩ và lịch hẹn
- JWT authentication phải được cấu hình đúng

### 2. Frontend Dependencies
- react-bootstrap: UI components
- react-toastify: Notifications
- axios: HTTP client
- bootstrap-icons: Icons

### 3. Environment Variables
- `REACT_APP_API_URL`: URL của backend API (mặc định: http://localhost:8080)

## Troubleshooting

### 1. Không thể kết nối backend
- Kiểm tra backend có đang chạy không
- Kiểm tra CORS configuration
- Kiểm tra API endpoints có đúng không

### 2. Không hiển thị dữ liệu
- Kiểm tra authentication token
- Kiểm tra console errors
- Kiểm tra network requests

### 3. Giao diện không đẹp
- Kiểm tra CSS files đã được import
- Kiểm tra Bootstrap CSS
- Kiểm tra browser compatibility

## Tương lai

### Tính năng có thể thêm
- Calendar view cho lịch hẹn
- Export dữ liệu (PDF, Excel)
- Push notifications
- Real-time updates
- Advanced filtering và search
- Patient history view
- Prescription management 