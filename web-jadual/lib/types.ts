export interface Day {
  id: number
  name: string
  day_order: number
}

export interface TimeSlot {
  id: number
  slot_number: number
  start_time: string
  end_time: string
  is_recess: boolean
  is_prayer: boolean
}

export interface TimetableEntry {
  id: string
  teacher_id: string
  subject_id: number
  classroom_id: number
  day_id: number
  time_slot_id: number
  term_id: number
  updated_at?: string
}

export interface TimetableEntryWithDetails extends TimetableEntry {
  teacher: Teacher
  subject: Subject
  classroom: Classroom
  day: Day
  time_slot: TimeSlot
}

export interface SpecialEvent {
  id: number
  name: string
  day_id: number
  time_slot_id: number
  recurring: boolean
}

export interface Teacher {
  id: string
  name: string
  email: string
  subjects: string[]
  role: string[]
}

export interface Subject {
  id: number
  name: string
  code: string
}

export interface Classroom {
  id: number
  name: string
}

export interface AcademicTerm {
  id: number
  name: string
  start_date: string
  end_date: string
  is_current: boolean
}
