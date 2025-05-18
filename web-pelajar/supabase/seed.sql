-- Seed data for testing

-- Insert teachers
INSERT INTO teachers (id, name, email, phone)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Ustaz Ahmad bin Abdullah', 'ahmad@example.com', '0123456789'),
  ('22222222-2222-2222-2222-222222222222', 'Ustazah Fatimah binti Ibrahim', 'fatimah@example.com', '0123456780');

-- Insert classes
INSERT INTO classes (id, name, academic_year, teacher_id)
VALUES
  ('33333333-3333-3333-3333-333333333333', '1 Al-Farabi', '2024/2025', '11111111-1111-1111-1111-111111111111'),
  ('44444444-4444-4444-4444-444444444444', '2 Al-Kindi', '2024/2025', '22222222-2222-2222-2222-222222222222');

-- Insert sample students (without user_id, will be linked when users register)
INSERT INTO students (id, student_id, name, birth_cert_number, ic_number, birth_date, birth_place, address, mother_name, father_name, mother_ic_number, father_ic_number, mother_phone_number, father_phone_number, class_id)
VALUES
  ('55555555-5555-5555-5555-555555555555', 'SRIK-P-24001', 'Muhammad bin Ismail', 'BC12345', '080101-14-1234', '2008-01
