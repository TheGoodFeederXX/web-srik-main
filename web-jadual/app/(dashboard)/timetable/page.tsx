import { createClient } from "@/lib/supabase/server"
import { KanbanTimetable } from "@/components/timetable/kanban-timetable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateTimetable } from "@/lib/actions/timetable"
import Link from "next/link"
import { Plus, RefreshCw, MessageSquare } from "lucide-react"

export default async function TimetablePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createClient()

  // Get view parameters
  const viewType = (searchParams.view as string) || "all"
  const viewId = searchParams.id as string
  const termId = searchParams.term as string

  // Fetch data
  const { data: days } = await supabase.from("days").select("*").order("day_order")

  const { data: timeSlots } = await supabase.from("time_slots").select("*").order("slot_number")

  const { data: teachers } = await supabase.from("users").select("*").order("name")

  const { data: classrooms } = await supabase.from("classrooms").select("*").order("name")

  const { data: subjects } = await supabase.from("subjects").select("*").order("name")

  const { data: academicTerms } = await supabase
    .from("academic_terms")
    .select("*")
    .order("start_date", { ascending: false })

  // Get current term if not specified
  const currentTerm = academicTerms?.find((term) => term.is_current) || academicTerms?.[0]
  const selectedTermId = termId ? Number.parseInt(termId) : currentTerm?.id

  // Fetch timetable entries with related data
  const { data: timetableEntries } = await supabase
    .from("timetable_entries")
    .select(`
      *,
      teacher:teacher_id(id, name, email),
      subject:subject_id(*),
      classroom:classroom_id(*),
      day:day_id(*),
      time_slot:time_slot_id(*),
      term:term_id(*)
    `)
    .eq("term_id", selectedTermId)
    .order("day_id")
    .order("time_slot_id")

  // Fetch special events
  const { data: specialEvents } = await supabase.from("special_events").select(`
      *,
      day:day_id(*),
      time_slot:time_slot_id(*)
    `)

  if (
    !days ||
    !timeSlots ||
    !teachers ||
    !classrooms ||
    !subjects ||
    !academicTerms ||
    !timetableEntries ||
    !specialEvents
  ) {
    return <div>Ralat memuatkan data jadual</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jadual</h1>
          <p className="text-muted-foreground">Urus dan lihat jadual sekolah</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button asChild>
            <Link href="/timetable/create">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Entri
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/timetable/ai-assistant">
              <MessageSquare className="mr-2 h-4 w-4" />
              Pembantu AI
            </Link>
          </Button>

          <form
            action={async () => {
              "use server"
              await generateTimetable(selectedTermId)
            }}
          >
            <Button type="submit" variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Jana Jadual
            </Button>
          </form>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paparan Jadual</CardTitle>
          <CardDescription>Lihat dan urus jadual sekolah</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/3">
              <Select defaultValue={selectedTermId?.toString()}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih penggal" />
                </SelectTrigger>
                <SelectContent>
                  {academicTerms.map((term) => (
                    <SelectItem key={term.id} value={term.id.toString()}>
                      {term.name} {term.is_current ? "(Semasa)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue={viewType} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="teacher">Mengikut Guru</TabsTrigger>
              <TabsTrigger value="classroom">Mengikut Kelas</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <KanbanTimetable
                days={days}
                timeSlots={timeSlots}
                timetableEntries={timetableEntries}
                specialEvents={specialEvents}
                termId={selectedTermId}
                viewType="all"
              />
            </TabsContent>

            <TabsContent value="teacher">
              <div className="mb-4">
                <Select defaultValue={viewId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih guru" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {viewId && (
                <KanbanTimetable
                  days={days}
                  timeSlots={timeSlots}
                  timetableEntries={timetableEntries}
                  specialEvents={specialEvents}
                  termId={selectedTermId}
                  viewType="teacher"
                  viewId={viewId}
                />
              )}
            </TabsContent>

            <TabsContent value="classroom">
              <div className="mb-4">
                <Select defaultValue={viewId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {classrooms.map((classroom) => (
                      <SelectItem key={classroom.id} value={classroom.id.toString()}>
                        {classroom.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {viewId && (
                <KanbanTimetable
                  days={days}
                  timeSlots={timeSlots}
                  timetableEntries={timetableEntries}
                  specialEvents={specialEvents}
                  termId={selectedTermId}
                  viewType="classroom"
                  viewId={viewId}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
