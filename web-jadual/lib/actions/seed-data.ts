"use server"

import { createClient } from "@/lib/supabase/server"
import { v4 as uuidv4 } from "uuid"

export async function seedInitialData() {
  const supabase = createClient()

  // Seed days
  const days = [
    { name: "Ahad", day_order: 1 },
    { name: "Isnin", day_order: 2 },
    { name: "Selasa", day_order: 3 },
    { name: "Rabu", day_order: 4 },
    { name: "Khamis", day_order: 5 },
  ]

  const { error: daysError } = await supabase.from("days").upsert(days, { onConflict: "name" })
  if (daysError) throw new Error(`Error seeding days: ${daysError.message}`)

  // Seed time slots
  const timeSlots = [
    { slot_number: 1, start_time: "07:30:00", end_time: "08:05:00", is_recess: false, is_prayer: false },
    { slot_number: 2, start_time: "08:05:00", end_time: "08:40:00", is_recess: false, is_prayer: false },
    { slot_number: 3, start_time: "08:40:00", end_time: "09:15:00", is_recess: false, is_prayer: false },
    { slot_number: 4, start_time: "09:15:00", end_time: "09:50:00", is_recess: false, is_prayer: false },
    { slot_number: 5, start_time: "09:50:00", end_time: "10:25:00", is_recess: true, is_prayer: false },
    { slot_number: 6, start_time: "10:25:00", end_time: "11:00:00", is_recess: false, is_prayer: false },
    { slot_number: 7, start_time: "11:00:00", end_time: "11:35:00", is_recess: false, is_prayer: false },
    { slot_number: 8, start_time: "11:35:00", end_time: "12:10:00", is_recess: false, is_prayer: false },
    { slot_number: 9, start_time: "12:45:00", end_time: "13:30:00", is_recess: false, is_prayer: false },
    { slot_number: 10, start_time: "13:30:00", end_time: "13:45:00", is_recess: false, is_prayer: false },
    { slot_number: 11, start_time: "13:45:00", end_time: "14:00:00", is_recess: false, is_prayer: true },
    { slot_number: 12, start_time: "14:00:00", end_time: "14:30:00", is_recess: false, is_prayer: false },
  ]

  const { error: timeSlotsError } = await supabase.from("time_slots").upsert(timeSlots, { onConflict: "slot_number" })
  if (timeSlotsError) throw new Error(`Error seeding time slots: ${timeSlotsError.message}`)

  // Seed classrooms
  const classrooms = [
    { name: "1 Al-Junaidi" },
    { name: "2 Al-Junaidi" },
    { name: "2 Al-Busiri" },
    { name: "3 Al-Junaidi" },
    { name: "3 Al-Busiri" },
    { name: "4 Al-Junaidi" },
    { name: "4 Al-Busiri" },
    { name: "5 Ma'wa" },
    { name: "6 Na'im" },
  ]

  const { error: classroomsError } = await supabase.from("classrooms").upsert(classrooms, { onConflict: "name" })
  if (classroomsError) throw new Error(`Error seeding classrooms: ${classroomsError.message}`)

  // Seed subjects
  const subjects = [
    { name: "Bahasa Melayu", code: "BM" },
    { name: "Bahasa Inggeris", code: "BI" },
    { name: "Bahasa Arab", code: "BA" },
    { name: "Sains", code: "SN" },
    { name: "Matematik", code: "MT" },
    { name: "Sejarah", code: "SJ" },
    { name: "Reka Bentuk dan Teknologi", code: "RBT" },
    { name: "Pendidikan Seni dan Visual", code: "PSV" },
    { name: "Pendidikan Jasmani dan Kesihatan", code: "PJK" },
    { name: "Hifz al-Quran", code: "HFZ" },
    { name: "Tilawah al-Quran", code: "AQ" },
    { name: "Tauhid", code: "TH" },
    { name: "Feqah", code: "FQ" },
    { name: "Tafsir", code: "TF" },
    { name: "Jawi", code: "JW" },
    { name: "Khat", code: "KH" },
    { name: "Hadis", code: "HD" },
    { name: "Sirah", code: "SR" },
    { name: "Akhlak", code: "AK" },
  ]

  const { error: subjectsError } = await supabase.from("subjects").upsert(subjects, { onConflict: "code" })
  if (subjectsError) throw new Error(`Error seeding subjects: ${subjectsError.message}`)

  // Seed teachers with the provided list
  const teachers = [
    {
      id: uuidv4(),
      name: "Mohd Fadil Hadi",
      email: "fadil@srikhairiah.edu",
      subjects: ["BM", "SJ"],
      role: ["teacher"],
    },
    { id: uuidv4(), name: "Nurasikin", email: "nurasikin@srikhairiah.edu", subjects: ["BI", "PSV"], role: ["teacher"] },
    {
      id: uuidv4(),
      name: "Mohd Farid Uzairi",
      email: "farid@srikhairiah.edu",
      subjects: ["MT", "SN"],
      role: ["teacher"],
    },
    { id: uuidv4(), name: "Nur Azimah", email: "azimah@srikhairiah.edu", subjects: ["BA", "JW"], role: ["teacher"] },
    {
      id: uuidv4(),
      name: "Farhan Nadhil",
      email: "farhan@srikhairiah.edu",
      subjects: ["HFZ", "AQ"],
      role: ["teacher"],
    },
    { id: uuidv4(), name: "Anis Azwani", email: "anis@srikhairiah.edu", subjects: ["TH", "FQ"], role: ["teacher"] },
    { id: uuidv4(), name: "Farhana", email: "farhana@srikhairiah.edu", subjects: ["BM", "PSV"], role: ["teacher"] },
    {
      id: uuidv4(),
      name: "Nabilah Huda",
      email: "nabilah@srikhairiah.edu",
      subjects: ["BI", "RBT"],
      role: ["teacher"],
    },
    {
      id: uuidv4(),
      name: "Mohd Zulnajmi",
      email: "zulnajmi@srikhairiah.edu",
      subjects: ["PJK", "SN"],
      role: ["teacher"],
    },
    {
      id: uuidv4(),
      name: "Rabiatul Adawiyah",
      email: "rabiatul@srikhairiah.edu",
      subjects: ["TF", "HD"],
      role: ["teacher"],
    },
    {
      id: uuidv4(),
      name: "Lukman Hakimi",
      email: "lukman@srikhairiah.edu",
      subjects: ["MT", "RBT"],
      role: ["teacher"],
    },
    {
      id: uuidv4(),
      name: "Nur Izyan Hazwani",
      email: "izyan@srikhairiah.edu",
      subjects: ["BA", "KH"],
      role: ["teacher"],
    },
    { id: uuidv4(), name: "Najib Fahmi", email: "najib@srikhairiah.edu", subjects: ["SR", "AK"], role: ["teacher"] },
    { id: uuidv4(), name: "Syafilla", email: "syafilla@srikhairiah.edu", subjects: ["BM", "JW"], role: ["teacher"] },
    { id: uuidv4(), name: "Omar Hanif", email: "omar@srikhairiah.edu", subjects: ["SJ", "SR"], role: ["teacher"] },
    { id: uuidv4(), name: "Luqman Hakim", email: "luqman@srikhairiah.edu", subjects: ["MT", "SN"], role: ["teacher"] },
    { id: uuidv4(), name: "Asma' Amanina", email: "asma@srikhairiah.edu", subjects: ["BI", "PSV"], role: ["teacher"] },
    { id: uuidv4(), name: "Ainin Sofiya", email: "ainin@srikhairiah.edu", subjects: ["BA", "AQ"], role: ["teacher"] },
    // Add an admin user
    {
      id: uuidv4(),
      name: "Admin",
      email: "admin@srikhairiah.edu",
      subjects: [],
      role: ["admin"],
      password: "admin123",
    },
  ]

  // Check if teachers already exist to avoid duplicates
  const { data: existingTeachers } = await supabase.from("users").select("email")
  const existingEmails = existingTeachers?.map((t) => t.email) || []

  // Only insert teachers that don't already exist
  const newTeachers = teachers.filter((t) => !existingEmails.includes(t.email))

  if (newTeachers.length > 0) {
    const { error: teachersError } = await supabase.from("users").insert(newTeachers)
    if (teachersError) throw new Error(`Error seeding teachers: ${teachersError.message}`)
  }

  // Get IDs for special events
  const { data: daysData } = await supabase.from("days").select("id, name")
  const { data: timeSlotsData } = await supabase.from("time_slots").select("id, slot_number")

  if (!daysData || !timeSlotsData) throw new Error("Failed to fetch days or time slots data")

  const sundayId = daysData.find((day) => day.name === "Ahad")?.id
  const thursdayId = daysData.find((day) => day.name === "Khamis")?.id
  const slot1Id = timeSlotsData.find((slot) => slot.slot_number === 1)?.id
  const slot2Id = timeSlotsData.find((slot) => slot.slot_number === 2)?.id

  if (!sundayId || !thursdayId || !slot1Id || !slot2Id) {
    throw new Error("Failed to find required day or time slot IDs")
  }

  // Seed special events
  const specialEvents = [
    { name: "Perhimpunan", day_id: sundayId, time_slot_id: slot1Id, recurring: true },
    { name: "Perhimpunan", day_id: sundayId, time_slot_id: slot2Id, recurring: true },
    { name: "Bacaan Yasin", day_id: thursdayId, time_slot_id: slot1Id, recurring: true },
  ]

  const { error: specialEventsError } = await supabase.from("special_events").upsert(specialEvents)
  if (specialEventsError) throw new Error(`Error seeding special events: ${specialEventsError.message}`)

  // Seed current academic term if none exists
  const { data: termsData } = await supabase.from("academic_terms").select("*").eq("is_current", true)

  if (!termsData || termsData.length === 0) {
    const currentYear = new Date().getFullYear()
    const currentTerm = {
      name: `Penggal 1 ${currentYear}`,
      start_date: `${currentYear}-01-01`,
      end_date: `${currentYear}-06-30`,
      is_current: true,
    }

    const { error: termError } = await supabase.from("academic_terms").insert(currentTerm)
    if (termError) throw new Error(`Error seeding academic term: ${termError.message}`)
  }

  return { success: true }
}
