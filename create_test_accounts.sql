-- Tạo tài khoản test cho bệnh nhân
-- Mật khẩu cho tất cả tài khoản: 123456

-- Tài khoản bệnh nhân chính để test PatientDashboard
INSERT INTO users (first_name, last_name, username, address, password, dob, email, role, phone_number) VALUES
('Nguyen', 'Thi Dung', 'dungpatient', '123 Tran Phu, Q5, TP.HCM', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', '1995-03-15', 'dung.patient@example.com', 'PATIENT', 909123456)
ON DUPLICATE KEY UPDATE
    first_name = VALUES(first_name),
    last_name = VALUES(last_name),
    address = VALUES(address),
    dob = VALUES(dob),
    email = VALUES(email),
    phone_number = VALUES(phone_number);

-- Cập nhật thông tin patient tương ứng
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

-- Tài khoản bệnh nhân phụ để test
INSERT INTO users (first_name, last_name, username, address, password, dob, email, role, phone_number) VALUES
('Tran', 'Van Minh', 'minhpatient', '456 Le Loi, Q1, TP.HCM', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', '1988-07-22', 'minh.patient@example.com', 'PATIENT', 909234567),
('Le', 'Thi Hoa', 'hoapatient', '789 Vo Van Tan, Q3, TP.HCM', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', '1992-11-08', 'hoa.patient@example.com', 'PATIENT', 909345678),
('Pham', 'Van Hung', 'hungpatient', '321 Nguyen Thi Minh Khai, Q1, TP.HCM', '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', '1990-04-12', 'hung.patient@example.com', 'PATIENT', 909456789);

-- Thêm thông tin patient tương ứng
INSERT INTO patient (first_name, last_name, username, address, user_id, password, dob, email, role, phone_number) VALUES
('Tran', 'Van Minh', 'minhpatient', '456 Le Loi, Q1, TP.HCM', 27, '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', '1988-07-22', 'minh.patient@example.com', 'PATIENT', 909234567),
('Le', 'Thi Hoa', 'hoapatient', '789 Vo Van Tan, Q3, TP.HCM', 28, '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', '1992-11-08', 'hoa.patient@example.com', 'PATIENT', 909345678),
('Pham', 'Van Hung', 'hungpatient', '321 Nguyen Thi Minh Khai, Q1, TP.HCM', 29, '$2a$10$2HaVIMYLG8ZbOnYtujAvXODuieEPkOfAB2wDUG0VC.qLVyY9VWPEK', '1990-04-12', 'hung.patient@example.com', 'PATIENT', 909456789);

-- Hiển thị thông tin tài khoản test
SELECT '=== TÀI KHOẢN TEST ĐÃ ĐƯỢC TẠO ===' as info;

SELECT 'Tài khoản bệnh nhân chính:' as info;
SELECT 
    u.id,
    u.username,
    CONCAT(u.first_name, ' ', u.last_name) as full_name,
    u.email,
    u.phone_number,
    u.role
FROM users u
WHERE u.role = 'PATIENT' AND u.username IN ('dungpatient', 'minhpatient', 'hoapatient', 'hungpatient')
ORDER BY u.username;

SELECT 'Thông tin đăng nhập:' as info;
SELECT 
    'Tài khoản chính: dungpatient / 123456' as login_info,
    'Email: dung.patient@example.com' as email_info
UNION ALL
SELECT 
    'Tài khoản phụ 1: minhpatient / 123456' as login_info,
    'Email: minh.patient@example.com' as email_info
UNION ALL
SELECT 
    'Tài khoản phụ 2: hoapatient / 123456' as login_info,
    'Email: hoa.patient@example.com' as email_info
UNION ALL
SELECT 
    'Tài khoản phụ 3: hungpatient / 123456' as login_info,
    'Email: hung.patient@example.com' as email_info; 