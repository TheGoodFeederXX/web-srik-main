-- Create tables for the school management system

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  birth_cert_number TEXT,
  ic_number TEXT,
  birth_date DATE,
  birth_place TEXT,
  address TEXT,
  mother_name TEXT,
  father_name TEXT,
  mother_ic_number TEXT,
  father_ic_number TEXT,
  mother_phone_number TEXT,
  father_phone_number TEXT,
  avatar_url TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL UNIQUE,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  date DATE NOT NULL,
  total_marks INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exam results table
CREATE TABLE IF NOT EXISTS exam_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE NOT NULL,
  marks INTEGER NOT NULL,
  grade TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leave applications table
CREATE TABLE IF NOT EXISTS leave_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fee payments table
CREATE TABLE IF NOT EXISTS fee_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  due_date DATE NOT NULL,
  is_paid BOOLEAN NOT NULL DEFAULT FALSE,
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS) policies

-- Profiles: Users can read and update their own profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Students: Users can read and update their linked student record
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own student record"
  ON students FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own student record"
  ON students FOR UPDATE
  USING (auth.uid() = user_id);

-- Exam Results: Users can view their own exam results
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own exam results"
  ON exam_results FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM students
    WHERE students.id = exam_results.student_id
    AND students.user_id = auth.uid()
  ));

-- Leave Applications: Users can manage their own leave applications
ALTER TABLE leave_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own leave applications"
  ON leave_applications FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM students
    WHERE students.id = leave_applications.student_id
    AND students.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own leave applications"
  ON leave_applications FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM students
    WHERE students.id = leave_applications.student_id
    AND students.user_id = auth.uid()
  ));

-- Fee Payments: Users can view and update their own fee payments
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own fee payments"
  ON fee_payments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM students
    WHERE students.id = fee_payments.student_id
    AND students.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own fee payments"
  ON fee_payments FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM students
    WHERE students.id = fee_payments.student_id
    AND students.user_id = auth.uid()
  ));

-- Create functions and triggers

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables to update the updated_at column
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at
BEFORE UPDATE ON teachers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at
BEFORE UPDATE ON classes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON students
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exams_updated_at
BEFORE UPDATE ON exams
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exam_results_updated_at
BEFORE UPDATE ON exam_results
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leave_applications_updated_at
BEFORE UPDATE ON leave_applications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fee_payments_updated_at
BEFORE UPDATE ON fee_payments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
