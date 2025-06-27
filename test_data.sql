-- =====================================================
-- TEST DATA FOR DOCTOR DASHBOARD
-- =====================================================

-- 1. Thêm bệnh nhân mới
INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `phone_number`, `username`, `role`, `address`, `dob`) VALUES
(24, 'Nguyen', 'Van An', 'an.nguyen@test.com', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', 901234567, 'an.nguyen', 'PATIENT', '123 Nguyen Trai, Q1, TP.HCM', '1995-03-15 00:00:00'),
(25, 'Tran', 'Thi Binh', 'binh.tran@test.com', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', 902345678, 'binh.tran', 'PATIENT', '456 Le Loi, Q3, TP.HCM', '1988-07-22 00:00:00'),
(26, 'Le', 'Van Cuong', 'cuong.le@test.com', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', 903456789, 'cuong.le', 'PATIENT', '789 Vo Van Tan, Q3, TP.HCM', '1992-11-08 00:00:00'),
(27, 'Pham', 'Thi Dung', 'dung.pham@test.com', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', 904567890, 'dung.pham', 'PATIENT', '321 Tran Phu, Q5, TP.HCM', '1990-05-12 00:00:00'),
(28, 'Hoang', 'Van Em', 'em.hoang@test.com', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', 905678901, 'em.hoang', 'PATIENT', '654 Nguyen Thi Minh Khai, Q1, TP.HCM', '1985-09-30 00:00:00'),
(29, 'Vu', 'Thi Phuong', 'phuong.vu@test.com', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', 906789012, 'phuong.vu', 'PATIENT', '987 Cach Mang Thang 8, Q10, TP.HCM', '1993-12-25 00:00:00'),
(30, 'Do', 'Van Quan', 'quan.do@test.com', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', 907890123, 'quan.do', 'PATIENT', '147 Ly Tu Trong, Q1, TP.HCM', '1987-04-18 00:00:00'),
(31, 'Bui', 'Thi Hoa', 'hoa.bui@test.com', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', 908901234, 'hoa.bui', 'PATIENT', '258 Nguyen Van Cu, Q5, TP.HCM', '1991-08-03 00:00:00');

-- 2. Thêm bệnh nhân vào bảng patient
INSERT INTO `patient` (`id`, `first_name`, `last_name`, `email`, `password`, `phone_number`, `username`, `role`, `address`, `dob`, `user_id`) VALUES
(11, 'Nguyen', 'Van An', 'an.nguyen@test.com', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', 901234567, 'an.nguyen', 'PATIENT', '123 Nguyen Trai, Q1, TP.HCM', '1995-03-15 00:00:00', 24),
(12, 'Tran', 'Thi Binh', 'binh.tran@test.com', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', 902345678, 'binh.tran', 'PATIENT', '456 Le Loi, Q3, TP.HCM', '1988-07-22 00:00:00', 25),
(13, 'Le', 'Van Cuong', 'cuong.le@test.com', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', 903456789, 'cuong.le', 'PATIENT', '789 Vo Van Tan, Q3, TP.HCM', '1992-11-08 00:00:00', 26),
(14, 'Pham', 'Thi Dung', 'dung.pham@test.com', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', 904567890, 'dung.pham', 'PATIENT', '321 Tran Phu, Q5, TP.HCM', '1990-05-12 00:00:00', 27),
(15, 'Hoang', 'Van Em', 'em.hoang@test.com', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', 905678901, 'em.hoang', 'PATIENT', '654 Nguyen Thi Minh Khai, Q1, TP.HCM', '1985-09-30 00:00:00', 28),
(16, 'Vu', 'Thi Phuong', 'phuong.vu@test.com', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', 906789012, 'phuong.vu', 'PATIENT', '987 Cach Mang Thang 8, Q10, TP.HCM', '1993-12-25 00:00:00', 29),
(17, 'Do', 'Van Quan', 'quan.do@test.com', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', 907890123, 'quan.do', 'PATIENT', '147 Ly Tu Trong, Q1, TP.HCM', '1987-04-18 00:00:00', 30),
(18, 'Bui', 'Thi Hoa', 'hoa.bui@test.com', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', 908901234, 'hoa.bui', 'PATIENT', '258 Nguyen Van Cu, Q5, TP.HCM', '1991-08-03 00:00:00', 31);

-- 3. Thêm lịch hẹn cho hôm nay (thay đổi ngày theo ngày hiện tại)
-- Lịch hẹn cho bác sĩ Le Hoai Nam (ID: 16)
INSERT INTO `appointment` (`id`, `appointment_date`, `appointment_time`, `note`, `status`, `doctor_id`, `patient_id`, `payment_method`) VALUES
(14, CURDATE(), '08:00:00.000000', 'Khám tổng quát định kỳ', 'PENDING', 16, 11, 'CASH'),
(15, CURDATE(), '09:00:00.000000', 'Tái khám sau phẫu thuật tim', 'APPROVED', 16, 12, 'ONLINE'),
(16, CURDATE(), '10:00:00.000000', 'Kiểm tra huyết áp cao', 'COMPLETED', 16, 13, 'CASH'),
(17, CURDATE(), '14:00:00.000000', 'Tư vấn về bệnh tim mạch', 'PENDING', 16, 14, 'ONLINE'),
(18, CURDATE(), '15:00:00.000000', 'Khám sức khỏe trước khi đi du lịch', 'APPROVED', 16, 15, 'CASH'),
(19, CURDATE(), '16:00:00.000000', 'Kiểm tra ECG định kỳ', 'PENDING', 16, 16, 'ONLINE');

-- 4. Thêm lịch hẹn cho ngày mai
INSERT INTO `appointment` (`id`, `appointment_date`, `appointment_time`, `note`, `status`, `doctor_id`, `patient_id`, `payment_method`) VALUES
(20, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '08:30:00.000000', 'Khám tim mạch', 'PENDING', 16, 17, 'CASH'),
(21, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '10:30:00.000000', 'Tư vấn về thuốc huyết áp', 'PENDING', 16, 18, 'ONLINE'),
(22, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:30:00.000000', 'Kiểm tra sức khỏe tổng quát', 'PENDING', 16, 11, 'CASH');

-- 5. Thêm lịch hẹn cho bác sĩ khác (Tran Bao Chau - ID: 17)
INSERT INTO `appointment` (`id`, `appointment_date`, `appointment_time`, `note`, `status`, `doctor_id`, `patient_id`, `payment_method`) VALUES
(23, CURDATE(), '09:30:00.000000', 'Khám chấn thương vai', 'PENDING', 17, 12, 'CASH'),
(24, CURDATE(), '11:00:00.000000', 'Tái khám sau phẫu thuật khớp gối', 'APPROVED', 17, 13, 'ONLINE'),
(25, CURDATE(), '15:30:00.000000', 'Tư vấn về đau lưng', 'PENDING', 17, 14, 'CASH');

-- 6. Thêm đánh giá cho bác sĩ
INSERT INTO `review` (`id`, `rating`, `comment`, `created_at`, `updated_at`, `doctor_id`, `patient_id`) VALUES
(1, 5, 'Bác sĩ rất tận tâm và chuyên nghiệp. Tôi rất hài lòng với cách điều trị.', NOW(), NOW(), 16, 11),
(2, 4, 'Bác sĩ giải thích rõ ràng và dễ hiểu. Khám bệnh rất cẩn thận.', NOW(), NOW(), 16, 12),
(3, 5, 'Bác sĩ có kinh nghiệm cao, điều trị hiệu quả. Rất đáng tin cậy.', NOW(), NOW(), 16, 13),
(4, 4, 'Thái độ phục vụ tốt, chuyên môn cao. Tôi sẽ giới thiệu cho người khác.', NOW(), NOW(), 16, 14),
(5, 5, 'Bác sĩ rất kiên nhẫn và tận tâm với bệnh nhân.', NOW(), NOW(), 16, 15),
(6, 4, 'Khám bệnh kỹ lưỡng, tư vấn chi tiết. Rất hài lòng.', NOW(), NOW(), 16, 16),
(7, 5, 'Bác sĩ có tay nghề cao, điều trị hiệu quả.', NOW(), NOW(), 17, 12),
(8, 4, 'Chuyên môn tốt, thái độ phục vụ chu đáo.', NOW(), NOW(), 17, 13);

-- 7. Thêm lịch làm việc cho bác sĩ (nếu chưa có)
INSERT INTO `schedule` (`id`, `doctor_id`, `start_time`, `end_time`) VALUES
(1, 16, '08:00:00.000000', '17:00:00.000000'),
(2, 17, '08:00:00.000000', '17:00:00.000000');

-- 8. Thêm ngày làm việc cho bác sĩ
INSERT INTO `schedule_days` (`schedule_id`, `days`) VALUES
(1, 'MONDAY'),
(1, 'TUESDAY'),
(1, 'WEDNESDAY'),
(1, 'THURSDAY'),
(1, 'FRIDAY'),
(2, 'MONDAY'),
(2, 'TUESDAY'),
(2, 'WEDNESDAY'),
(2, 'THURSDAY'),
(2, 'FRIDAY');

-- =====================================================
-- HƯỚNG DẪN SỬ DỤNG
-- =====================================================

/*
1. Chạy file SQL này trong MySQL để thêm dữ liệu test

2. Đăng nhập với tài khoản bác sĩ:
   - Username: hoainam001
   - Password: 123456 (hoặc password đã được hash)

3. Truy cập dashboard bác sĩ:
   - URL: http://localhost:3000/doctor/dashboard

4. Dữ liệu test bao gồm:
   - 8 bệnh nhân mới
   - 9 lịch hẹn cho hôm nay (3 PENDING, 2 APPROVED, 1 COMPLETED)
   - 3 lịch hẹn cho ngày mai
   - 8 đánh giá từ bệnh nhân
   - Lịch làm việc của bác sĩ

5. Các trạng thái lịch hẹn:
   - PENDING: Chờ xác nhận
   - APPROVED: Đã xác nhận
   - COMPLETED: Hoàn thành
   - REJECTED: Đã từ chối
   - NOT_APPROVED: Chưa duyệt

6. Để test các tính năng:
   - Xác nhận lịch hẹn: Click nút check màu xanh
   - Hoàn thành lịch hẹn: Click nút check màu xanh dương
   - Xem chi tiết: Click icon mắt
   - Thêm ghi chú: Trong modal chi tiết
*/ 