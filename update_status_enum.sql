-- Cập nhật enum Status để thêm CANCELLED
-- Chạy script này sau khi đã cập nhật enum trong Java

-- Kiểm tra enum hiện tại
SELECT '=== ENUM STATUS HIỆN TẠI ===' as info;
SELECT DISTINCT status FROM appointment ORDER BY status;

-- Cập nhật enum trong database (MySQL 8.0+)
-- Nếu sử dụng MySQL 8.0 trở lên, có thể cần tạo lại bảng hoặc sử dụng ALTER TABLE

-- Cách 1: Sử dụng ALTER TABLE (MySQL 8.0+)
ALTER TABLE appointment MODIFY COLUMN status ENUM('NOT_APPROVED', 'APPROVED', 'REJECTED', 'PENDING', 'COMPLETED', 'CANCELLED') DEFAULT NULL;

-- Cách 2: Nếu cách 1 không hoạt động, sử dụng cách này
-- Tạo bảng tạm với enum mới
CREATE TABLE appointment_temp LIKE appointment;
ALTER TABLE appointment_temp MODIFY COLUMN status ENUM('NOT_APPROVED', 'APPROVED', 'REJECTED', 'PENDING', 'COMPLETED', 'CANCELLED') DEFAULT NULL;

-- Copy dữ liệu
INSERT INTO appointment_temp SELECT * FROM appointment;

-- Xóa bảng cũ và đổi tên bảng mới
DROP TABLE appointment;
RENAME TABLE appointment_temp TO appointment;

-- Kiểm tra enum sau khi cập nhật
SELECT '=== ENUM STATUS SAU KHI CẬP NHẬT ===' as info;
SELECT DISTINCT status FROM appointment ORDER BY status;

-- Kiểm tra cấu trúc bảng
DESCRIBE appointment; 