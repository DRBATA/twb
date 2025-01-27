import { useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"

interface DateSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onDateSelect: (date: Date) => void
}

export function DateSelectionModal({ isOpen, onClose, onDateSelect }: DateSelectionModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())

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
          <Calendar 
            selected={selectedDate} 
            onSelect={(date) => setSelectedDate(date)}
            className="rounded-md border" 
          />
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
