-- QUICK SETUP: Chạy tất cả scripts để setup PatientDashboard
-- Chạy file này để setup toàn bộ database cho test

-- Bước 1: Thêm trường reason
SELECT '=== BƯỚC 1: THÊM TRƯỜNG REASON ===' as info;
ALTER TABLE appointment ADD COLUMN reason VARCHAR(500) DEFAULT NULL;
UPDATE appointment SET reason = 'Khám tổng quát' WHERE reason IS NULL;
SELECT '✅ Đã thêm trường reason' as result;

-- Bước 2: Cập nhật enum Status
SELECT '=== BƯỚC 2: CẬP NHẬT ENUM STATUS ===' as info;
ALTER TABLE appointment MODIFY COLUMN status ENUM('NOT_APPROVED', 'APPROVED', 'REJECTED', 'PENDING', 'COMPLETED', 'CANCELLED') DEFAULT NULL;
SELECT '✅ Đã cập nhật enum Status với CANCELLED' as result;

-- Bước 3: Tạo tài khoản test
SELECT '=== BƯỚC 3: TẠO TÀI KHOẢN TEST ===' as info;

-- Tài khoản chính
INSERT INTO users (first_name, last_name, username, address, password, dob, email, role, phone_number) VALUES
('Nguyen', 'Thi Dung', 'dungpatient', '123 Tran Phu, Q5, TP.HCM', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', '1995-03-15', 'dung.patient@example.com', 'PATIENT', 909123456)
ON DUPLICATE KEY UPDATE
    first_name = VALUES(first_name),
    last_name = VALUES(last_name),
    address = VALUES(address),
    dob = VALUES(dob),
    email = VALUES(email),
    phone_number = VALUES(phone_number);

INSERT INTO patient (first_name, last_name, username, address, user_id, password, dob, email, role, phone_number) VALUES
('Nguyen', 'Thi Dung', 'dungpatient', '123 Tran Phu, Q5, TP.HCM', 10, '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', '1995-03-15', 'dung.patient@example.com', 'PATIENT', 909123456)
ON DUPLICATE KEY UPDATE
    first_name = VALUES(first_name),
    last_name = VALUES(last_name),
    username = VALUES(username),
    address = VALUES(address),
    dob = VALUES(dob),
    email = VALUES(email),
    phone_number = VALUES(phone_number);

-- Tài khoản phụ
INSERT INTO users (first_name, last_name, username, address, password, dob, email, role, phone_number) VALUES
('Tran', 'Van Minh', 'minhpatient', '456 Le Loi, Q1, TP.HCM', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', '1988-07-22', 'minh.patient@example.com', 'PATIENT', 909234567),
('Le', 'Thi Hoa', 'hoapatient', '789 Vo Van Tan, Q3, TP.HCM', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', '1992-11-08', 'hoa.patient@example.com', 'PATIENT', 909345678),
('Pham', 'Van Hung', 'hungpatient', '321 Nguyen Thi Minh Khai, Q1, TP.HCM', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', '1990-04-12', 'hung.patient@example.com', 'PATIENT', 909456789);

INSERT INTO patient (first_name, last_name, username, address, user_id, password, dob, email, role, phone_number) VALUES
('Tran', 'Van Minh', 'minhpatient', '456 Le Loi, Q1, TP.HCM', 27, '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', '1988-07-22', 'minh.patient@example.com', 'PATIENT', 909234567),
('Le', 'Thi Hoa', 'hoapatient', '789 Vo Van Tan, Q3, TP.HCM', 28, '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', '1992-11-08', 'hoa.patient@example.com', 'PATIENT', 909345678),
('Pham', 'Van Hung', 'hungpatient', '321 Nguyen Thi Minh Khai, Q1, TP.HCM', 29, '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', '1990-04-12', 'hung.patient@example.com', 'PATIENT', 909456789);

SELECT '✅ Đã tạo tài khoản test' as result;

-- Bước 4: Tạo dữ liệu test
SELECT '=== BƯỚC 4: TẠO DỮ LIỆU TEST ===' as info;

-- Thêm dữ liệu test cho bảng appointment
INSERT INTO appointment (appointment_date, appointment_time, note, status, doctor_id, patient_id, payment_method, reason) VALUES
-- Lịch hẹn sắp tới (PENDING)
('2025-01-25', '09:00:00', 'Bệnh nhân muốn tư vấn về chế độ ăn uống', 'PENDING', 9, 10, 'CASH', 'Tư vấn chế độ ăn uống và dinh dưỡng'),
('2025-01-26', '14:30:00', 'Khám định kỳ', 'PENDING', 15, 10, 'ONLINE', 'Khám sức khỏe định kỳ'),
('2025-01-27', '10:00:00', 'Bệnh nhân bị đau đầu', 'PENDING', 16, 10, 'CASH', 'Đau đầu và chóng mặt kéo dài'),

-- Lịch hẹn đã xác nhận (APPROVED)
('2025-01-28', '15:00:00', 'Đã xác nhận lịch hẹn', 'APPROVED', 17, 10, 'ONLINE', 'Khám tim mạch định kỳ'),
('2025-01-29', '08:30:00', 'Bệnh nhân đã xác nhận', 'APPROVED', 18, 10, 'CASH', 'Tư vấn về bệnh tiểu đường'),

-- Lịch hẹn đã hoàn thành (COMPLETED) - có thể đánh giá
('2025-01-15', '09:00:00', 'Khám hoàn thành, bệnh nhân hài lòng', 'COMPLETED', 9, 10, 'ONLINE', 'Khám chấn thương thể thao'),
('2025-01-10', '14:00:00', 'Điều trị thành công', 'COMPLETED', 15, 10, 'CASH', 'Điều trị bệnh tim mạch'),
('2025-01-05', '11:00:00', 'Khám và tư vấn hoàn tất', 'COMPLETED', 16, 10, 'ONLINE', 'Khám da liễu'),
('2024-12-20', '16:00:00', 'Bệnh nhân khỏe mạnh', 'COMPLETED', 17, 10, 'CASH', 'Khám sức khỏe tổng quát'),
('2024-12-15', '10:30:00', 'Điều trị hiệu quả', 'COMPLETED', 18, 10, 'ONLINE', 'Tư vấn dinh dưỡng'),

-- Lịch hẹn đã hủy (CANCELLED)
('2025-01-20', '13:00:00', 'Bệnh nhân hủy do bận việc', 'CANCELLED', 19, 10, 'CASH', 'Khám nhi khoa'),
('2025-01-18', '08:00:00', 'Hủy theo yêu cầu', 'CANCELLED', 20, 10, 'ONLINE', 'Tư vấn sức khỏe'),

-- Lịch hẹn bị từ chối (REJECTED)
('2025-01-22', '15:30:00', 'Bác sĩ không có lịch trống', 'REJECTED', 21, 10, 'CASH', 'Khám chuyên khoa');

-- Thêm dữ liệu test cho bảng review (đánh giá)
INSERT INTO review (comment, rating, created_at, patient_id, doctor_id) VALUES
-- Đánh giá cho lịch hẹn đã hoàn thành
('Bác sĩ rất tận tâm và chuyên nghiệp. Tôi rất hài lòng với cách điều trị.', 5, '2025-01-15 10:30:00', 10, 9),
('Khám bệnh rất kỹ lưỡng, bác sĩ giải thích rõ ràng về tình trạng bệnh.', 4, '2025-01-10 15:30:00', 10, 15),
('Phòng khám sạch sẽ, nhân viên thân thiện. Bác sĩ có chuyên môn cao.', 5, '2025-01-05 12:00:00', 10, 16),
('Điều trị hiệu quả, bệnh tình cải thiện rõ rệt sau 1 tuần.', 4, '2024-12-20 17:30:00', 10, 17);

-- Thêm lịch hẹn cho các bệnh nhân khác để test
INSERT INTO appointment (appointment_date, appointment_time, note, status, doctor_id, patient_id, payment_method, reason) VALUES
-- Lịch hẹn cho patient001
('2025-01-25', '10:00:00', 'Khám định kỳ', 'PENDING', 9, 11, 'CASH', 'Khám sức khỏe định kỳ'),
('2025-01-20', '14:00:00', 'Điều trị thành công', 'COMPLETED', 15, 11, 'ONLINE', 'Điều trị bệnh tim mạch'),

-- Lịch hẹn cho patient002
('2025-01-26', '09:30:00', 'Tư vấn dinh dưỡng', 'PENDING', 16, 12, 'CASH', 'Tư vấn chế độ ăn uống'),
('2025-01-18', '15:30:00', 'Khám hoàn thành', 'COMPLETED', 17, 12, 'ONLINE', 'Khám da liễu'),

-- Lịch hẹn cho patient003
('2025-01-27', '11:00:00', 'Khám nhi khoa', 'PENDING', 19, 13, 'CASH', 'Khám sức khỏe trẻ em'),
('2025-01-12', '16:00:00', 'Điều trị hiệu quả', 'COMPLETED', 20, 13, 'ONLINE', 'Tư vấn sức khỏe');

-- Thêm đánh giá cho các bệnh nhân khác
INSERT INTO review (comment, rating, created_at, patient_id, doctor_id) VALUES
('Bác sĩ rất giỏi và tận tâm', 5, '2025-01-20 15:30:00', 11, 15),
('Phòng khám hiện đại, bác sĩ chuyên nghiệp', 4, '2025-01-18 16:30:00', 12, 17),
('Điều trị hiệu quả, bệnh tình cải thiện nhanh', 5, '2025-01-12 17:00:00', 13, 20);

SELECT '✅ Đã tạo dữ liệu test' as result;

-- Bước 5: Kiểm tra kết quả
SELECT '=== BƯỚC 5: KIỂM TRA KẾT QUẢ ===' as info;

SELECT 'Thống kê tổng quan:' as info;
SELECT 
    COUNT(*) as total_appointments,
    COUNT(DISTINCT patient_id) as total_patients,
    COUNT(DISTINCT doctor_id) as total_doctors,
    COUNT(*) as total_reviews
FROM appointment;

SELECT 'Phân bố trạng thái lịch hẹn:' as info;
SELECT 
    status,
    COUNT(*) as count
FROM appointment 
GROUP BY status 
ORDER BY status;

SELECT 'Tài khoản test đã tạo:' as info;
SELECT 
    username,
    CONCAT(first_name, ' ', last_name) as full_name,
    email,
    role
FROM users 
WHERE username IN ('dungpatient', 'minhpatient', 'hoapatient', 'hungpatient')
ORDER BY username;

SELECT '=== SETUP HOÀN TẤT ===' as info;
SELECT '🎉 Tất cả scripts đã được chạy thành công!' as result;
SELECT '📋 Tài khoản test chính: dungpatient / 123456' as login_info;
SELECT '🚀 Bạn có thể khởi động backend và frontend để test PatientDashboard' as next_step; 