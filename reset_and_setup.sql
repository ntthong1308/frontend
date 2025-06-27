-- Reset và Setup lại dữ liệu test cho PatientDashboard
-- Chạy script này để có dữ liệu sạch để test

USE medisched;

-- Xóa dữ liệu cũ
SELECT '=== XÓA DỮ LIỆU CŨ ===' as info;

-- Xóa reviews
DELETE FROM review WHERE patient_id = 10;

-- Xóa appointments của patient 10
DELETE FROM appointment WHERE patient_id = 10;

-- Xóa patient và user dungpatient
DELETE FROM patient WHERE username = 'dungpatient';
DELETE FROM users WHERE username = 'dungpatient';

SELECT '✅ Đã xóa dữ liệu cũ' as result;

-- Tạo lại patient dungpatient
SELECT '=== TẠO LẠI PATIENT DUNGPATIENT ===' as info;

INSERT INTO users (first_name, last_name, username, address, password, dob, email, role, phone_number) VALUES
('Nguyen', 'Thi Dung', 'dungpatient', '123 Tran Phu, Q5, TP.HCM', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', '1995-03-15', 'dung.patient@example.com', 'PATIENT', 909123456);

INSERT INTO patient (first_name, last_name, username, address, user_id, password, dob, email, role, phone_number) VALUES
('Nguyen', 'Thi Dung', 'dungpatient', '123 Tran Phu, Q5, TP.HCM', 10, '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', '1995-03-15', 'dung.patient@example.com', 'PATIENT', 909123456);

SELECT '✅ Đã tạo lại patient dungpatient' as result;

-- Tạo lại appointments với dữ liệu sạch
SELECT '=== TẠO LẠI APPOINTMENTS ===' as info;

INSERT INTO appointment (appointment_date, appointment_time, note, status, doctor_id, patient_id, payment_method, reason) VALUES
-- Lịch hẹn sắp tới (PENDING) - có thể hủy
('2025-01-25', '09:00:00', 'Bệnh nhân muốn tư vấn về chế độ ăn uống', 'PENDING', 9, 10, 'CASH', 'Tư vấn chế độ ăn uống và dinh dưỡng'),
('2025-01-26', '14:30:00', 'Khám định kỳ', 'PENDING', 15, 10, 'ONLINE', 'Khám sức khỏe định kỳ'),
('2025-01-27', '10:00:00', 'Bệnh nhân bị đau đầu', 'PENDING', 16, 10, 'CASH', 'Đau đầu và chóng mặt kéo dài'),

-- Lịch hẹn đã xác nhận (APPROVED)
('2025-01-28', '15:00:00', 'Đã xác nhận lịch hẹn', 'APPROVED', 17, 10, 'ONLINE', 'Khám tim mạch định kỳ'),
('2025-01-29', '08:30:00', 'Bệnh nhân đã xác nhận', 'APPROVED', 18, 10, 'CASH', 'Tư vấn về bệnh tiểu đường'),

-- Lịch hẹn đã hoàn thành (COMPLETED) - có thể đánh giá (chưa có review)
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

SELECT '✅ Đã tạo lại appointments' as result;

-- Tạo một số reviews để test (chỉ cho 2 lịch hẹn COMPLETED)
SELECT '=== TẠO MỘT SỐ REVIEWS ===' as info;

INSERT INTO review (comment, rating, created_at, patient_id, doctor_id) VALUES
-- Đánh giá cho 2 lịch hẹn đã hoàn thành (còn 3 lịch chưa đánh giá)
('Bác sĩ rất tận tâm và chuyên nghiệp. Tôi rất hài lòng với cách điều trị.', 5, '2025-01-15 10:30:00', 10, 9),
('Khám bệnh rất kỹ lưỡng, bác sĩ giải thích rõ ràng về tình trạng bệnh.', 4, '2025-01-10 15:30:00', 10, 15);

SELECT '✅ Đã tạo reviews' as result;

-- Kiểm tra kết quả
SELECT '=== KIỂM TRA KẾT QUẢ ===' as info;

-- Thống kê appointments
SELECT 'Thống kê appointments:' as info;
SELECT 
    status,
    COUNT(*) as count
FROM appointment 
WHERE patient_id = 10
GROUP BY status 
ORDER BY status;

-- Appointments PENDING (có thể hủy)
SELECT 'Appointments PENDING (có thể hủy):' as info;
SELECT 
    a.id,
    a.appointment_date,
    a.appointment_time,
    a.reason,
    CONCAT(d.user.first_name, ' ', d.user.last_name) as doctor_name
FROM appointment a
JOIN doctor d ON a.doctor_id = d.id
WHERE a.patient_id = 10 AND a.status = 'PENDING'
ORDER BY a.appointment_date;

-- Appointments COMPLETED chưa có review (có thể đánh giá)
SELECT 'Appointments COMPLETED chưa có review (có thể đánh giá):' as info;
SELECT 
    a.id,
    a.appointment_date,
    a.appointment_time,
    a.reason,
    CONCAT(d.user.first_name, ' ', d.user.last_name) as doctor_name,
    d.id as doctor_id
FROM appointment a
JOIN doctor d ON a.doctor_id = d.id
LEFT JOIN review r ON (r.patient_id = a.patient_id AND r.doctor_id = a.doctor_id)
WHERE a.patient_id = 10 
    AND a.status = 'COMPLETED'
    AND r.id IS NULL
ORDER BY a.appointment_date DESC;

-- Reviews đã có
SELECT 'Reviews đã có:' as info;
SELECT 
    r.id,
    r.rating,
    r.comment,
    CONCAT(d.user.first_name, ' ', d.user.last_name) as doctor_name
FROM review r
JOIN doctor d ON r.doctor_id = d.id
WHERE r.patient_id = 10
ORDER BY r.created_at DESC;

-- Test hasReview logic
SELECT 'Test hasReview logic:' as info;
SELECT 
    a.id as appointment_id,
    a.status,
    CONCAT(d.user.first_name, ' ', d.user.last_name) as doctor_name,
    CASE 
        WHEN r.id IS NOT NULL THEN 'ĐÃ ĐÁNH GIÁ'
        ELSE 'CHƯA ĐÁNH GIÁ'
    END as review_status
FROM appointment a
JOIN doctor d ON a.doctor_id = d.id
LEFT JOIN review r ON (r.patient_id = a.patient_id AND r.doctor_id = a.doctor_id)
WHERE a.patient_id = 10 AND a.status = 'COMPLETED'
ORDER BY a.appointment_date DESC;

SELECT '=== SETUP HOÀN TẤT ===' as info;
SELECT '🎉 Dữ liệu test đã được reset và setup lại!' as result;
SELECT '📋 Tài khoản test: dungpatient / 123456' as login_info;
SELECT '🔧 Bây giờ bạn có thể test:' as next_steps;
SELECT '   - Hủy lịch hẹn PENDING' as step1;
SELECT '   - Đánh giá lịch hẹn COMPLETED chưa có review' as step2;
SELECT '   - Xem tất cả lịch hẹn với bộ lọc' as step3; 