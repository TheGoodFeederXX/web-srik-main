import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText } from "lucide-react"

interface LeaveApplicationListProps {
  applications: Array<{
    id: string
    start_date: string
    end_date: string
    reason: string
    status: string
    created_at: string
  }>
}

export function LeaveApplicationList({ applications }: LeaveApplicationListProps) {
  if (!applications || applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Senarai Permohonan</CardTitle>
          <CardDescription>Senarai permohonan cuti yang telah dihantar</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>Tiada permohonan cuti ditemui.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Senarai Permohonan</CardTitle>
        <CardDescription>Senarai permohonan cuti yang telah dihantar</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tarikh Mohon</TableHead>
              <TableHead>Tempoh</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => {
              const startDate = new Date(application.start_date)
              const endDate = new Date(application.end_date)
              const createdAt = new Date(application.created_at)

              // Calculate duration in days
              const durationMs = endDate.getTime() - startDate.getTime()
              const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24)) + 1

              return (
                <TableRow key={application.id}>
                  <TableCell>{format(createdAt, "dd/MM/yyyy")}</TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {format(startDate, "dd/MM/yyyy")} - {format(endDate, "dd/MM/yyyy")}
                    </div>
                    <div className="text-xs text-gray-500">{durationDays} hari</div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={application.status} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status.toLowerCase()) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
          Dalam Proses
        </Badge>
      )
    case "approved":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
          Diluluskan
        </Badge>
      )
    case "rejected":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
          Ditolak
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}
