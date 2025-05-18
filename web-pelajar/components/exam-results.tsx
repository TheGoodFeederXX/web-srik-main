import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Lock } from "lucide-react"
import Link from "next/link"

interface ExamResultsProps {
  student: {
    id: string
    name: string
    student_id: string
    exam_results: Array<{
      id: string
      marks: number
      grade: string
      exams: {
        id: string
        name: string
        date: string
        subject: string
        total_marks: number
      }
    }>
  }
  hasPendingFees: boolean
}

export function ExamResults({ student, hasPendingFees }: ExamResultsProps) {
  // Group exam results by exam name
  const examsByName = student.exam_results.reduce(
    (acc, result) => {
      const examName = result.exams.name
      if (!acc[examName]) {
        acc[examName] = []
      }
      acc[examName].push(result)
      return acc
    },
    {} as Record<string, typeof student.exam_results>,
  )

  // Sort exams by date (most recent first)
  const sortedExamNames = Object.keys(examsByName).sort((a, b) => {
    const dateA = new Date(examsByName[a][0].exams.date)
    const dateB = new Date(examsByName[b][0].exams.date)
    return dateB.getTime() - dateA.getTime()
  })

  if (hasPendingFees) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Keputusan Peperiksaan</CardTitle>
          <CardDescription>Keputusan peperiksaan untuk sesi akademik semasa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <Lock className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Keputusan Peperiksaan Dikunci</h3>
            <p className="text-gray-500 mb-4 max-w-md">
              Anda mempunyai yuran tertunggak. Sila jelaskan pembayaran untuk mengakses keputusan peperiksaan.
            </p>
            <Link href="/dashboard/fee-payment">
              <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Bayar Yuran Sekarang
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (sortedExamNames.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Keputusan Peperiksaan</CardTitle>
          <CardDescription>Keputusan peperiksaan untuk sesi akademik semasa</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Tiada Keputusan</AlertTitle>
            <AlertDescription>Tiada keputusan peperiksaan ditemui untuk pelajar ini.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {sortedExamNames.map((examName) => {
        const results = examsByName[examName]
        const examDate = new Date(results[0].exams.date)

        // Calculate total marks and percentage
        const totalObtained = results.reduce((sum, result) => sum + result.marks, 0)
        const totalPossible = results.reduce((sum, result) => sum + result.exams.total_marks, 0)
        const percentage = Math.round((totalObtained / totalPossible) * 100)

        // Determine overall grade
        let overallGrade = "F"
        if (percentage >= 80) overallGrade = "A"
        else if (percentage >= 70) overallGrade = "B"
        else if (percentage >= 60) overallGrade = "C"
        else if (percentage >= 50) overallGrade = "D"
        else if (percentage >= 40) overallGrade = "E"

        return (
          <Card key={examName}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{examName}</CardTitle>
                  <CardDescription>{examDate.toLocaleDateString("ms-MY")}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{percentage}%</div>
                  <div className="text-sm text-gray-500">Gred: {overallGrade}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subjek</TableHead>
                    <TableHead className="text-right">Markah</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                    <TableHead className="text-right">Peratus</TableHead>
                    <TableHead className="text-right">Gred</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => {
                    const subjectPercentage = Math.round((result.marks / result.exams.total_marks) * 100)
                    return (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.exams.subject}</TableCell>
                        <TableCell className="text-right">{result.marks}</TableCell>
                        <TableCell className="text-right">{result.exams.total_marks}</TableCell>
                        <TableCell className="text-right">{subjectPercentage}%</TableCell>
                        <TableCell className="text-right">{result.grade}</TableCell>
                      </TableRow>
                    )
                  })}
                  <TableRow className="bg-gray-50 font-medium">
                    <TableCell>Jumlah</TableCell>
                    <TableCell className="text-right">{totalObtained}</TableCell>
                    <TableCell className="text-right">{totalPossible}</TableCell>
                    <TableCell className="text-right">{percentage}%</TableCell>
                    <TableCell className="text-right">{overallGrade}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
