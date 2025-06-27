-- Script debug để kiểm tra dữ liệu patient và appointments
-- Chạy script này để xem dữ liệu hiện tại

USE medisched;

-- Kiểm tra enum Status
SELECT '=== KIỂM TRA ENUM STATUS ===' as info;
DESCRIBE appointment;

-- Kiểm tra patient dungpatient
SELECT '=== KIỂM TRA PATIENT DUNGPATIENT ===' as info;
SELECT 
    p.id,
    CONCAT(p.first_name, ' ', p.last_name) as patient_name,
    p.username,
    p.email,
    u.id as user_id,
    u.role
FROM patient p
JOIN users u ON p.user_id = u.id
WHERE p.username = 'dungpatient';

-- Kiểm tra tất cả appointments của patient 10
SELECT '=== TẤT CẢ APPOINTMENTS CỦA PATIENT 10 ===' as info;
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

-- Kiểm tra reviews của patient 10
SELECT '=== REVIEWS CỦA PATIENT 10 ===' as info;
SELECT 
    r.id,
    r.rating,
    r.comment,
    r.created_at,
    CONCAT(d.user.first_name, ' ', d.user.last_name) as doctor_name,
    d.id as doctor_id
FROM review r
JOIN doctor d ON r.doctor_id = d.id
WHERE r.patient_id = 10
ORDER BY r.created_at DESC;

-- Kiểm tra appointments COMPLETED chưa có review
SELECT '=== APPOINTMENTS COMPLETED CHƯA CÓ REVIEW ===' as info;
SELECT 
    a.id,
    a.appointment_date,
    a.appointment_time,
    a.reason,
    CONCAT(d.user.first_name, ' ', d.user.last_name) as doctor_name,
    d.id as doctor_id,
    CASE 
        WHEN r.id IS NULL THEN 'CHƯA ĐÁNH GIÁ'
        ELSE 'ĐÃ ĐÁNH GIÁ'
    END as review_status
FROM appointment a
JOIN doctor d ON a.doctor_id = d.id
LEFT JOIN review r ON (r.patient_id = a.patient_id AND r.doctor_id = a.doctor_id)
WHERE a.patient_id = 10 
    AND a.status = 'COMPLETED'
ORDER BY a.appointment_date DESC;

-- Kiểm tra appointments PENDING có thể hủy
SELECT '=== APPOINTMENTS PENDING CÓ THỂ HỦY ===' as info;
SELECT 
    a.id,
    a.appointment_date,
    a.appointment_time,
    a.reason,
    CONCAT(d.user.first_name, ' ', d.user.last_name) as doctor_name
FROM appointment a
JOIN doctor d ON a.doctor_id = d.id
WHERE a.patient_id = 10 
    AND a.status = 'PENDING'
ORDER BY a.appointment_date;

-- Kiểm tra thống kê tổng quan
SELECT '=== THỐNG KÊ TỔNG QUAN ===' as info;
SELECT 
    status,
    COUNT(*) as count
FROM appointment 
WHERE patient_id = 10
GROUP BY status 
ORDER BY status;

-- Kiểm tra user authentication
SELECT '=== KIỂM TRA USER AUTHENTICATION ===' as info;
SELECT 
    u.id,
    u.username,
    u.email,
    u.role,
    p.id as patient_id
FROM users u
LEFT JOIN patient p ON u.id = p.user_id
WHERE u.username = 'dungpatient';

-- Test query để kiểm tra hasReview logic
SELECT '=== TEST HASREVIEW LOGIC ===' as info;
SELECT 
    a.id as appointment_id,
    a.status,
    a.patient_id,
    a.doctor_id,
    CASE 
        WHEN r.id IS NOT NULL THEN true
        ELSE false
    END as has_review
FROM appointment a
LEFT JOIN review r ON (r.patient_id = a.patient_id AND r.doctor_id = a.doctor_id)
WHERE a.patient_id = 10
ORDER BY a.appointment_date DESC; 