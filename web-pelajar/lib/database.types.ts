export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string
          student_id: string
          name: string
          birth_cert_number: string | null
          ic_number: string | null
          birth_date: string | null
          birth_place: string | null
          address: string | null
          mother_name: string | null
          father_name: string | null
          mother_ic_number: string | null
          father_ic_number: string | null
          mother_phone_number: string | null
          father_phone_number: string | null
          avatar_url: string | null
          user_id: string | null
          class_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          name: string
          birth_cert_number?: string | null
          ic_number?: string | null
          birth_date?: string | null
          birth_place?: string | null
          address?: string | null
          mother_name?: string | null
          father_name?: string | null
          mother_ic_number?: string | null
          father_ic_number?: string | null
          mother_phone_number?: string | null
          father_phone_number?: string | null
          avatar_url?: string | null
          user_id?: string | null
          class_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          name?: string
          birth_cert_number?: string | null
          ic_number?: string | null
          birth_date?: string | null
          birth_place?: string | null
          address?: string | null
          mother_name?: string | null
          father_name?: string | null
          mother_ic_number?: string | null
          father_ic_number?: string | null
          mother_phone_number?: string | null
          father_phone_number?: string | null
          avatar_url?: string | null
          user_id?: string | null
          class_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_class_id_fkey"
            columns: ["class_id"]
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          id: string
          name: string
          academic_year: string
          teacher_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          academic_year: string
          teacher_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          academic_year?: string
          teacher_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_teacher_id_fkey"
            columns: ["teacher_id"]
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      exams: {
        Row: {
          id: string
          name: string
          subject: string
          date: string
          total_marks: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          subject: string
          date: string
          total_marks: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          subject?: string
          date?: string
          total_marks?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      exam_results: {
        Row: {
          id: string
          student_id: string
          exam_id: string
          marks: number
          grade: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          exam_id: string
          marks: number
          grade: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          exam_id?: string
          marks?: number
          grade?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_results_exam_id_fkey"
            columns: ["exam_id"]
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_results_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_applications: {
        Row: {
          id: string
          student_id: string
          start_date: string
          end_date: string
          reason: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          start_date: string
          end_date: string
          reason: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          start_date?: string
          end_date?: string
          reason?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_applications_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_payments: {
        Row: {
          id: string
          student_id: string
          amount: number
          description: string
          due_date: string
          is_paid: boolean
          paid_at: string | null
          payment_reference: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          amount: number
          description: string
          due_date: string
          is_paid?: boolean
          paid_at?: string | null
          payment_reference?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          amount?: number
          description?: string
          due_date?: string
          is_paid?: boolean
          paid_at?: string | null
          payment_reference?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fee_payments_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
