"use client"

import React, { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { deleteTimetableEntry, updateTimetableEntryPosition } from "@/lib/actions/timetable"
import type { Day, TimeSlot, TimetableEntryWithDetails, SpecialEvent } from "@/lib/types"

interface KanbanTimetableProps {
  days: Day[]
  timeSlots: TimeSlot[]
  timetableEntries: TimetableEntryWithDetails[]
  specialEvents: (SpecialEvent & { day: Day; time_slot: TimeSlot })[]
  termId: number
  viewType: "teacher" | "classroom" | "all"
  viewId?: string | number
}

export function KanbanTimetable({
  days,
  timeSlots,
  timetableEntries,
  specialEvents,
  termId,
  viewType,
  viewId,
}: KanbanTimetableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [entries, setEntries] = useState(timetableEntries)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const filteredEntries =
    viewType && viewId
      ? entries.filter((entry) => {
          if (viewType === "teacher") return entry.teacher_id === viewId
          if (viewType === "classroom") return entry.classroom_id === Number(viewId)
          return true
        })
      : entries

  // Group entries by day and time slot
  const entriesByDayAndSlot = days.reduce(
    (acc, day) => {
      acc[day.id] = timeSlots.reduce(
        (slotAcc, slot) => {
          // Check for special events
          const specialEvent = specialEvents.find((event) => event.day_id === day.id && event.time_slot_id === slot.id)

          if (specialEvent) {
            slotAcc[slot.id] = {
              entries: [],
              specialEvent: specialEvent,
            }
          } else {
            const slotEntries = filteredEntries.filter(
              (entry) => entry.day_id === day.id && entry.time_slot_id === slot.id,
            )
            slotAcc[slot.id] = {
              entries: slotEntries,
              specialEvent: null,
            }
          }
          return slotAcc
        },
        {} as Record<number, { entries: TimetableEntryWithDetails[]; specialEvent: any }>,
      )
      return acc
    },
    {} as Record<number, Record<number, { entries: TimetableEntryWithDetails[]; specialEvent: any }>>,
  )

  const handleEdit = (entryId: string) => {
    router.push(`/timetable/edit/${entryId}`)
  }

  const handleDelete = async (entryId: string) => {
    try {
      setIsDeleting(entryId)
      await deleteTimetableEntry(entryId)

      // Update local state
      setEntries(entries.filter((entry) => entry.id !== entryId))

      toast({
        title: "Berjaya",
        description: "Entri jadual berjaya dipadam",
      })
    } catch (error) {
      toast({
        title: "Ralat",
        description: error instanceof Error ? error.message : "Gagal memadam entri",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleDragEnd = async (result: any) => {
    const { source, destination } = result

    // Dropped outside the list
    if (!destination) {
      return
    }

    // Parse the droppableId to get day and time slot
    const [sourceDayId, sourceSlotId] = source.droppableId.split("-").map(Number)
    const [destDayId, destSlotId] = destination.droppableId.split("-").map(Number)

    // Check if there's a special event at the destination
    const destSpecialEvent = specialEvents.find(
      (event) => event.day_id === destDayId && event.time_slot_id === destSlotId,
    )

    if (destSpecialEvent) {
      toast({
        title: "Tidak dibenarkan",
        description: `Slot masa ini dikhaskan untuk ${destSpecialEvent.name}`,
        variant: "destructive",
      })
      return
    }

    // Get the entry being moved
    const sourceEntries = entriesByDayAndSlot[sourceDayId][sourceSlotId].entries
    const [movedEntry] = sourceEntries.splice(source.index, 1)

    // Check for conflicts at destination
    if (entriesByDayAndSlot[destDayId][destSlotId].entries.length > 0) {
      // If we're viewing by teacher or classroom, we can't have conflicts
      if (viewType !== "all") {
        toast({
          title: "Konflik jadual",
          description: "Slot masa ini sudah mempunyai kelas",
          variant: "destructive",
        })
        return
      }

      // For "all" view, check if there's a teacher or classroom conflict
      const destEntries = entriesByDayAndSlot[destDayId][destSlotId].entries
      const teacherConflict = destEntries.some((entry) => entry.teacher_id === movedEntry.teacher_id)
      const classroomConflict = destEntries.some((entry) => entry.classroom_id === movedEntry.classroom_id)

      if (teacherConflict) {
        toast({
          title: "Konflik guru",
          description: "Guru ini sudah mempunyai kelas pada slot masa ini",
          variant: "destructive",
        })
        return
      }

      if (classroomConflict) {
        toast({
          title: "Konflik kelas",
          description: "Kelas ini sudah mempunyai guru pada slot masa ini",
          variant: "destructive",
        })
        return
      }
    }

    try {
      // Update the entry in the database
      await updateTimetableEntryPosition(movedEntry.id, destDayId, destSlotId)

      // Update local state
      const updatedEntries = entries.map((entry) => {
        if (entry.id === movedEntry.id) {
          return {
            ...entry,
            day_id: destDayId,
            time_slot_id: destSlotId,
            day: days.find((d) => d.id === destDayId)!,
            time_slot: timeSlots.find((t) => t.id === destSlotId)!,
          }
        }
        return entry
      })

      setEntries(updatedEntries)

      toast({
        title: "Berjaya",
        description: "Jadual berjaya dikemas kini",
      })
    } catch (error) {
      toast({
        title: "Ralat",
        description: error instanceof Error ? error.message : "Gagal mengemas kini jadual",
        variant: "destructive",
      })
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[150px_repeat(5,1fr)] gap-2">
            {/* Header row with days */}
            <div className="p-2 font-medium text-center">Slot Masa</div>
            {days.map((day) => (
              <div key={day.id} className="p-2 font-medium text-center bg-muted rounded-md">
                {day.name}
              </div>
            ))}

            {/* Time slots rows */}
            {timeSlots.map((timeSlot) => (
              <React.Fragment key={timeSlot.id}>
                <div className="p-2 text-sm text-center border-t">
                  <div className="font-medium">{timeSlot.slot_number}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatTime(timeSlot.start_time)} - {formatTime(timeSlot.end_time)}
                  </div>
                  {timeSlot.is_recess && <Badge variant="outline">Rehat</Badge>}
                  {timeSlot.is_prayer && <Badge variant="outline">Solat</Badge>}
                </div>

                {/* Cells for each day */}
                {days.map((day) => {
                  const cellData = entriesByDayAndSlot[day.id][timeSlot.id]
                  const { specialEvent, entries } = cellData

                  if (specialEvent) {
                    return (
                      <div
                        key={`${day.id}-${timeSlot.id}`}
                        className="p-1 border-t bg-yellow-100 dark:bg-yellow-900/30 rounded-md"
                      >
                        <div className="h-full flex items-center justify-center text-center">
                          <Badge variant="secondary">{specialEvent.name}</Badge>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <Droppable droppableId={`${day.id}-${timeSlot.id}`} key={`${day.id}-${timeSlot.id}`}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`p-1 border-t min-h-[80px] rounded-md ${
                            snapshot.isDraggingOver ? "bg-primary/10" : ""
                          }`}
                        >
                          {entries.map((entry, index) => (
                            <Draggable key={entry.id} draggableId={entry.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="mb-1"
                                >
                                  <Card className="h-full">
                                    <CardContent className="p-2 text-xs">
                                      <div className="grid gap-1">
                                        <div className="font-medium">{entry.subject.code}</div>
                                        <div className="text-muted-foreground truncate">
                                          {viewType !== "classroom" && `${entry.classroom.name}`}
                                          {viewType !== "teacher" && `${entry.teacher.name}`}
                                        </div>
                                        <div className="flex gap-1 mt-1">
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => handleEdit(entry.id)}
                                          >
                                            <Edit className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => handleDelete(entry.id)}
                                            disabled={isDeleting === entry.id}
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          {entries.length === 0 && !timeSlot.is_recess && !timeSlot.is_prayer && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full h-full text-muted-foreground"
                              onClick={() =>
                                router.push(`/timetable/create?day=${day.id}&slot=${timeSlot.id}&term=${termId}`)
                              }
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Tambah
                            </Button>
                          )}
                        </div>
                      )}
                    </Droppable>
                  )
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </DragDropContext>
  )
}

function formatTime(timeString: string) {
  const [hours, minutes] = timeString.split(":")
  return `${hours}:${minutes}`
}
