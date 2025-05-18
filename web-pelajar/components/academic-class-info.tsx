import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface AcademicClassInfoProps {
  student: {
    id: string
    name: string
    student_id: string
    classes?: {
      id: string
      name: string
      academic_year: string
      teachers?: {
        id: string
        name: string
      } | null
    } | null
  }
}

export function AcademicClassInfo({ student }: AcademicClassInfoProps) {
  // Sample timetable data - in a real app, this would come from the database
  const timetable = [
    {
      day: "Isnin",
      periods: [
        { time: "7:30 - 8:30", subject: "Pendidikan Islam" },
        { time: "8:30 - 9:30", subject: "Bahasa Melayu" },
        { time: "9:30 - 10:00", subject: "Rehat" },
        { time: "10:00 - 11:00", subject: "Matematik" },
        { time: "11:00 - 12:00", subject: "Sains" },
      ],
    },
    {
      day: "Selasa",
      periods: [
        { time: "7:30 - 8:30", subject: "Bahasa Arab" },
        { time: "8:30 - 9:30", subject: "Bahasa Inggeris" },
        { time: "9:30 - 10:00", subject: "Rehat" },
        { time: "10:00 - 11:00", subject: "Matematik" },
        { time: "11:00 - 12:00", subject: "Pendidikan Jasmani" },
      ],
    },
    {
      day: "Rabu",
      periods: [
        { time: "7:30 - 8:30", subject: "Pendidikan Islam" },
        { time: "8:30 - 9:30", subject: "Bahasa Melayu" },
        { time: "9:30 - 10:00", subject: "Rehat" },
        { time: "10:00 - 11:00", subject: "Sains" },
        { time: "11:00 - 12:00", subject: "Bahasa Inggeris" },
      ],
    },
    {
      day: "Khamis",
      periods: [
        { time: "7:30 - 8:30", subject: "Bahasa Arab" },
        { time: "8:30 - 9:30", subject: "Matematik" },
        { time: "9:30 - 10:00", subject: "Rehat" },
        { time: "10:00 - 11:00", subject: "Bahasa Melayu" },
        { time: "11:00 - 12:00", subject: "Pendidikan Seni" },
      ],
    },
    {
      day: "Jumaat",
      periods: [
        { time: "7:30 - 8:30", subject: "Pendidikan Islam" },
        { time: "8:30 - 9:30", subject: "Bahasa Inggeris" },
        { time: "9:30 - 10:00", subject: "Rehat" },
        { time: "10:00 - 11:00", subject: "Matematik" },
        { time: "11:00 - 12:00", subject: "Pendidikan Moral" },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Maklumat Kelas</CardTitle>
          <CardDescription>Maklumat kelas dan guru untuk sesi akademik semasa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-500">Nama Pelajar</div>
              <div>{student.name}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-500">No. Pelajar</div>
              <div>{student.student_id}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-500">Kelas</div>
              <div>{student.classes?.name || "Belum ditetapkan"}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-500">Sesi Akademik</div>
              <div>{student.classes?.academic_year || "Belum ditetapkan"}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-500">Guru Kelas</div>
              <div>{student.classes?.teachers?.name || "Belum ditetapkan"}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-500">Status</div>
              <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                Aktif
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Jadual Waktu</CardTitle>
          <CardDescription>Jadual waktu kelas untuk sesi akademik semasa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hari</TableHead>
                  <TableHead>7:30 - 8:30</TableHead>
                  <TableHead>8:30 - 9:30</TableHead>
                  <TableHead>9:30 - 10:00</TableHead>
                  <TableHead>10:00 - 11:00</TableHead>
                  <TableHead>11:00 - 12:00</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timetable.map((day) => (
                  <TableRow key={day.day}>
                    <TableCell className="font-medium">{day.day}</TableCell>
                    {day.periods.map((period, index) => (
                      <TableCell key={index} className={period.subject === "Rehat" ? "bg-gray-50" : ""}>
                        {period.subject}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
