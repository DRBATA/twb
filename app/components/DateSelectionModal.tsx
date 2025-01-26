import { useState } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface DateSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onDateSelect: (date: Date) => void
}

export function DateSelectionModal({ isOpen, onClose, onDateSelect }: DateSelectionModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const handleDateSelect = () => {
    if (selectedDate) {
      onDateSelect(selectedDate)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select a Date</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
        </div>
        <DialogFooter>
          <Button onClick={handleDateSelect} disabled={!selectedDate}>
            Select {selectedDate && format(selectedDate, "MMMM d, yyyy")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

