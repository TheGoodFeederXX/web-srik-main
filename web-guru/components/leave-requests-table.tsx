"use client"

import type { LeaveRequest } from "@/types/leave"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface LeaveRequestsTableProps {
  leaveRequests: LeaveRequest[]
}

export function LeaveRequestsTable({ leaveRequests }: LeaveRequestsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Permohonan Cuti</CardTitle>
        <CardDescription>Senarai permohonan cuti anda.</CardDescription>
      </CardHeader>
      <CardContent>
        {leaveRequests.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">Tiada permohonan cuti.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarikh Mula</TableHead>
                  <TableHead>Tarikh Tamat</TableHead>
                  <TableHead>Sebab</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{new Date(request.start_date).toLocaleDateString("ms-MY")}</TableCell>
                    <TableCell>{new Date(request.end_date).toLocaleDateString("ms-MY")}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{request.reason}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          request.status === "approved"
                            ? "success"
                            : request.status === "rejected"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {request.status === "pending"
                          ? "Menunggu"
                          : request.status === "approved"
                            ? "Diluluskan"
                            : "Ditolak"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
