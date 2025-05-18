import { createClient } from "@/lib/supabase/server"
import { TimetableForm } from "@/components/timetable/timetable-form"

export default async function CreateTimetablePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createClient()

  // Get parameters from URL if provided
  const dayId = searchParams.day as string
  const slotId = searchParams.slot as string
  const termId = searchParams.term as string

  // Fetch data
  const { data: teachers } = await supabase.from("users").select("*").order("name")

  const { data: subjects } = await supabase.from("subjects").select("*").order("name")

  const { data: classrooms } = await supabase.from("classrooms").select("*").order("name")

  const { data: days } = await supabase.from("days").select("*").order("day_order")

  const { data: timeSlots } = await supabase.from("time_slots").select("*").order("slot_number")

  const { data: academicTerms } = await supabase
    .from("academic_terms")
    .select("*")
    .order("start_date", { ascending: false })

  const { data: specialEvents } = await supabase.from("special_events").select("*")

  if (!teachers || !subjects || !classrooms || !days || !timeSlots || !academicTerms || !specialEvents) {
    return <div>Ralat memuatkan data borang</div>
  }

  // Create a pre-filled entry if parameters are provided
  const prefillEntry =
    dayId && slotId && termId
      ? {
          day_id: Number.parseInt(dayId),
          time_slot_id: Number.parseInt(slotId),
          term_id: Number.parseInt(termId),
        }
      : undefined

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cipta Entri Jadual</h1>
        <p className="text-muted-foreground">Tambah kelas baru ke jadual</p>
      </div>

      <TimetableForm
        teachers={teachers}
        subjects={subjects}
        classrooms={classrooms}
        days={days}
        timeSlots={timeSlots}
        academicTerms={academicTerms}
        specialEvents={specialEvents}
        mode="create"
        prefillEntry={prefillEntry}
      />
    </div>
  )
}
