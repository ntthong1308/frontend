-- Dữ liệu test cho PatientDashboard
-- Chạy script này sau khi đã chạy add_reason_column.sql

-- Thêm trường reason vào bảng appointment (nếu chưa có)
ALTER TABLE appointment ADD COLUMN reason VARCHAR(500) DEFAULT NULL;

-- Cập nhật dữ liệu hiện tại
UPDATE appointment SET reason = 'Khám tổng quát' WHERE reason IS NULL;

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

-- Thêm dữ liệu test cho bảng patient (nếu chưa có)
INSERT INTO patient (first_name, last_name, username, address, user_id, password, dob, email, role, phone_number) VALUES
('Nguyen', 'Van A', 'patient001', '123 Nguyen Trai, Q1, TP.HCM', 24, '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', '1990-05-15', 'patient001@example.com', 'PATIENT', 901234567),
('Tran', 'Thi B', 'patient002', '456 Le Loi, Q3, TP.HCM', 25, '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', '1985-08-20', 'patient002@example.com', 'PATIENT', 902345678),
('Le', 'Van C', 'patient003', '789 Vo Van Tan, Q3, TP.HCM', 26, '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', '1992-12-10', 'patient003@example.com', 'PATIENT', 903456789);

-- Thêm dữ liệu test cho bảng users (nếu chưa có)
INSERT INTO users (first_name, last_name, username, address, password, dob, email, role, phone_number) VALUES
('Nguyen', 'Van A', 'patient001', '123 Nguyen Trai, Q1, TP.HCM', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', '1990-05-15', 'patient001@example.com', 'PATIENT', 901234567),
('Tran', 'Thi B', 'patient002', '456 Le Loi, Q3, TP.HCM', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', '1985-08-20', 'patient002@example.com', 'PATIENT', 902345678),
('Le', 'Van C', 'patient003', '789 Vo Van Tan, Q3, TP.HCM', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', '1992-12-10', 'patient003@example.com', 'PATIENT', 903456789);

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

-- Cập nhật thông tin bệnh nhân hiện tại (patient với id = 10)
UPDATE patient SET 
    first_name = 'Nguyen',
    last_name = 'Thi Dung',
    username = 'dungpatient',
    address = '123 Tran Phu, Q5, TP.HCM',
    dob = '1995-03-15',
    email = 'dung.patient@example.com',
    phone_number = 909123456
WHERE id = 10;

-- Cập nhật thông tin user tương ứng
UPDATE users SET 
    first_name = 'Nguyen',
    last_name = 'Thi Dung',
    username = 'dungpatient',
    address = '123 Tran Phu, Q5, TP.HCM',
    dob = '1995-03-15',
    email = 'dung.patient@example.com',
    phone_number = 909123456
WHERE id = 10;

-- Thêm dữ liệu test cho schedule (lịch làm việc của bác sĩ)
INSERT INTO schedule (start_time, end_time, doctor_id) VALUES
('08:00:00', '17:00:00', 9),
('08:00:00', '17:00:00', 15),
('08:00:00', '17:00:00', 16),
('08:00:00', '17:00:00', 17),
('08:00:00', '17:00:00', 18),
('08:00:00', '17:00:00', 19),
('08:00:00', '17:00:00', 20),
('08:00:00', '17:00:00', 21);

-- Thêm ngày làm việc cho schedule
INSERT INTO schedule_days (schedule_id, days) VALUES
(1, 'MONDAY'), (1, 'WEDNESDAY'), (1, 'FRIDAY'),
(2, 'MONDAY'), (2, 'WEDNESDAY'), (2, 'FRIDAY'),
(3, 'MONDAY'), (3, 'WEDNESDAY'), (3, 'FRIDAY'),
(4, 'MONDAY'), (4, 'WEDNESDAY'), (4, 'FRIDAY'),
(5, 'MONDAY'), (5, 'WEDNESDAY'), (5, 'FRIDAY'),
(6, 'MONDAY'), (6, 'WEDNESDAY'), (6, 'FRIDAY'),
(7, 'MONDAY'), (7, 'WEDNESDAY'), (7, 'FRIDAY'),
(8, 'MONDAY'), (8, 'WEDNESDAY'), (8, 'FRIDAY');

-- Hiển thị dữ liệu test
SELECT '=== DỮ LIỆU TEST ĐÃ ĐƯỢC THÊM ===' as info;

SELECT 'Appointments cho patient 10:' as info;
SELECT 
    a.id,
    a.appointment_date,
    a.appointment_time,
    a.status,
    a.reason,
    CONCAT(d.user.first_name, ' ', d.user.last_name) as doctor_name,
    d.specialty as doctor_specialty,
    dep.name as department_name
FROM appointment a
JOIN doctor d ON a.doctor_id = d.id
LEFT JOIN department dep ON d.department_id = dep.id
WHERE a.patient_id = 10
ORDER BY a.appointment_date DESC, a.appointment_time;

SELECT 'Reviews cho patient 10:' as info;
SELECT 
    r.id,
    r.rating,
    r.comment,
    r.created_at,
    CONCAT(d.user.first_name, ' ', d.user.last_name) as doctor_name
FROM review r
JOIN doctor d ON r.doctor_id = d.id
WHERE r.patient_id = 10
ORDER BY r.created_at DESC;

SELECT 'Patient info:' as info;
SELECT 
    p.id,
    CONCAT(p.first_name, ' ', p.last_name) as patient_name,
    p.email,
    p.phone_number,
    p.address
FROM patient p
WHERE p.id = 10; 