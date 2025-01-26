'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface BookingsModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
}

export function BookingsModal({ isOpen, onCloseAction }: BookingsModalProps) {
  const [activeSection, setActiveSection] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  const [yachtSessions, setYachtSessions] = useState<any[]>([])
  const [wellnessSessions, setWellnessSessions] = useState<any[]>([])
  const [drinks, setDrinks] = useState<any[]>([])
  const [selectedYachtSession, setSelectedYachtSession] = useState<any>(null)
  const [selectedWellnessSession, setSelectedWellnessSession] = useState<any>(null)
  const [selectedDrinks, setSelectedDrinks] = useState<any[]>([])

  useEffect(() => {
    if (isOpen) {
      fetchAvailableDates()
    }
  }, [isOpen])

  useEffect(() => {
    if (selectedDate) {
      fetchSessions()
    }
  }, [selectedDate])

  const fetchSessions = async () => {
    if (!selectedDate) return
    
    try {
      const response = await fetch(`/api/sessions?date=${format(selectedDate, 'yyyy-MM-dd')}`)
      const data = await response.json()
      setYachtSessions(data.yachtSessions || [])
      setWellnessSessions(data.wellnessSessions || [])
      setDrinks(data.drinks || [])
    } catch (error) {
      console.error('Error fetching sessions:', error)
    }
  }

  const fetchAvailableDates = async () => {
    try {
      const response = await fetch('/api/sessions')
      const data = await response.json()
      // Convert date strings to Date objects and set to midnight UTC
      const dates = data.dates.map((dateStr: string) => {
        const date = new Date(dateStr)
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
      })
      setAvailableDates(dates)
    } catch (error) {
      console.error('Error fetching available dates:', error)
    }
  }

  const isDateDisabled = (date: Date) => {
    return !availableDates.some(
      availableDate => 
        availableDate.getFullYear() === date.getFullYear() &&
        availableDate.getMonth() === date.getMonth() &&
        availableDate.getDate() === date.getDate()
    )
  }

  const calculateTotal = () => {
    let total = 0

    // Add yacht session cost
    if (selectedYachtSession) {
      total += selectedYachtSession.price
    }

    // Add wellness session cost
    if (selectedWellnessSession) {
      total += selectedWellnessSession.price
    }

    // Add drinks cost
    selectedDrinks.forEach(drink => {
      total += drink.price_non_member
    })

    return total
  }

  const handleBooking = async () => {
    try {
      const bookingData = {
        date: format(selectedDate!, 'yyyy-MM-dd'),
        yachtSessionId: selectedYachtSession?.id,
        wellnessSessionId: selectedWellnessSession?.id,
        drinkIds: selectedDrinks.map(drink => drink.id),
        total: calculateTotal()
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) throw new Error('Failed to create booking')

      const data = await response.json()
      console.log('Booking successful:', data)
      
      // Reset selections and close modal
      setSelectedDate(null)
      setSelectedYachtSession(null)
      setSelectedWellnessSession(null)
      setSelectedDrinks([])
      setActiveSection(0)
      onCloseAction()
    } catch (error) {
      console.error('Error creating booking:', error)
    }
  }

  const handleNext = () => {
    setActiveSection(prev => Math.min(2, prev + 1))
  }

  const handleBack = () => {
    setActiveSection(prev => Math.max(0, prev - 1))
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onCloseAction} />
        <div className="relative z-50 bg-black/90 rounded-lg max-w-xl w-full p-6 shadow-2xl border border-rose-500/20">
          <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-teal-100 to-rose-100">
            Book Your Experience
          </h2>
          <p className="text-gray-300 mb-6">Join us for a transformative wellness journey</p>
          
          {/* Content Sections */}
          <div className="relative min-h-[300px]">
            {/* Navigation Buttons */}
            <button 
              onClick={handleBack}
              className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 backdrop-blur-sm border border-rose-500/20 text-white transition-opacity duration-200 hover:bg-black/70 ${activeSection === 0 ? 'opacity-0' : 'opacity-100'}`}
              disabled={activeSection === 0}
            >
              ←
            </button>
            <button 
              onClick={handleNext}
              className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 backdrop-blur-sm border border-rose-500/20 text-white transition-opacity duration-200 hover:bg-black/70 ${activeSection === 2 ? 'opacity-0' : 'opacity-100'}`}
              disabled={activeSection === 2}
            >
              →
            </button>

            {/* Section 0: Date Selection */}
            <div className={`absolute inset-0 px-8 space-y-4 text-gray-300 transition-opacity duration-300 ${activeSection === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <h3 className="text-xl font-semibold text-rose-300">Select Your Date</h3>
              <div className="bg-white/5 rounded-lg p-4">
                <Calendar
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border border-rose-500/20"
                  disabled={(date: Date) => {
                    // Disable past dates
                    if (date < new Date()) return true;
                    // Disable dates not in available dates
                    return isDateDisabled(date);
                  }}
                />
                {selectedDate && (
                  <div className="mt-4 text-center">
                    <p className="text-rose-300">Selected: {format(selectedDate, 'EEEE, MMMM d')}</p>
                    <Button
                      onClick={handleNext}
                      className="mt-2 bg-rose-500 hover:bg-rose-600"
                    >
                      Continue with {format(selectedDate, 'MMM d')}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Section 1: Session Selection */}
            <div className={`absolute inset-0 px-8 space-y-4 text-gray-300 transition-opacity duration-300 ${activeSection === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <h3 className="text-xl font-semibold text-rose-300">Choose Your Experience</h3>
              <Tabs defaultValue="yacht" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-black/20">
                  <TabsTrigger value="yacht" className="text-white data-[state=active]:bg-rose-500">Yacht Sessions</TabsTrigger>
                  <TabsTrigger value="wellness" className="text-white data-[state=active]:bg-rose-500">Experiences</TabsTrigger>
                  <TabsTrigger value="drinks" className="text-white data-[state=active]:bg-rose-500">Drinks</TabsTrigger>
                </TabsList>
                <TabsContent value="yacht" className="mt-4">
                  <div className="space-y-2">
                    {yachtSessions.map((session) => (
                      <div key={session.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                        <div>
                          <p>{session.start_time} - {session.end_time}</p>
                          <p className="text-sm text-gray-400">Available: {session.available_capacity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-rose-300">
                            ${session.price}
                          </p>
                          <Button
                            onClick={() => setSelectedYachtSession(session)}
                            className={`mt-2 ${
                              selectedYachtSession?.id === session.id 
                                ? 'bg-green-500 hover:bg-green-600' 
                                : 'bg-rose-500 hover:bg-rose-600'
                            }`}
                            disabled={session.available_capacity === 0}
                          >
                            {selectedYachtSession?.id === session.id ? 'Selected' : 'Select'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="wellness" className="mt-4">
                  <div className="space-y-2">
                    {wellnessSessions.map((session) => (
                      <div key={session.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                        <div>
                          <p>{session.type}</p>
                          <p>{session.start_time} - {session.end_time}</p>
                          <p className="text-sm text-gray-400">Available: {session.available_capacity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-rose-300">
                            ${session.price}
                          </p>
                          <Button
                            onClick={() => setSelectedWellnessSession(session)}
                            className={`mt-2 ${
                              selectedWellnessSession?.id === session.id 
                                ? 'bg-green-500 hover:bg-green-600' 
                                : 'bg-rose-500 hover:bg-rose-600'
                            }`}
                            disabled={session.available_capacity === 0}
                          >
                            {selectedWellnessSession?.id === session.id ? 'Selected' : 'Select'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="drinks" className="mt-4">
                  <div className="space-y-2">
                    {drinks.map((drink) => (
                      <div key={drink.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg">
                        <div>
                          <p>{drink.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-rose-300">
                            ${drink.price_non_member}
                          </p>
                          <Button
                            onClick={() => setSelectedDrinks(prev => [...prev, drink])}
                            className="mt-2 bg-rose-500 hover:bg-rose-600"
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    ))}
                    {selectedDrinks.length > 0 && (
                      <div className="mt-4 p-3 bg-white/10 rounded-lg">
                        <h4 className="font-semibold mb-2">Selected Drinks:</h4>
                        <ul className="space-y-1">
                          {selectedDrinks.map((drink, index) => (
                            <li key={`${drink.id}-${index}`} className="flex justify-between">
                              <span>{drink.name}</span>
                              <span>${drink.price_non_member}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              {(selectedYachtSession || selectedWellnessSession || selectedDrinks.length > 0) && (
                <Button
                  onClick={handleNext}
                  className="w-full mt-6 bg-rose-500 hover:bg-rose-600"
                >
                  Continue to Checkout
                </Button>
              )}
            </div>

            {/* Section 2: Checkout */}
            <div className={`absolute inset-0 px-8 space-y-4 text-gray-300 transition-opacity duration-300 ${activeSection === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <h3 className="text-xl font-semibold text-rose-300">Review & Confirm</h3>
              <div className="space-y-6">
                {/* Date Summary */}
                <div className="bg-white/5 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Selected Date</h4>
                  <p>{selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'No date selected'}</p>
                </div>

                {/* Yacht Session Summary */}
                {selectedYachtSession && (
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Yacht Session</h4>
                    <div className="flex justify-between items-center">
                      <div>
                        <p>{selectedYachtSession.start_time} - {selectedYachtSession.end_time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-rose-300">
                          ${selectedYachtSession.price}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Wellness Session Summary */}
                {selectedWellnessSession && (
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Wellness Experience</h4>
                    <div className="flex justify-between items-center">
                      <div>
                        <p>{selectedWellnessSession.type}</p>
                        <p className="text-sm text-gray-400">
                          {selectedWellnessSession.start_time} - {selectedWellnessSession.end_time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-rose-300">
                          ${selectedWellnessSession.price}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Drinks Summary */}
                {selectedDrinks.length > 0 && (
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Selected Drinks</h4>
                    <div className="space-y-2">
                      {selectedDrinks.map((drink, index) => (
                        <div key={`${drink.id}-${index}`} className="flex justify-between items-center">
                          <p>{drink.name}</p>
                          <div className="text-right">
                            <p className="font-bold text-rose-300">
                              ${drink.price_non_member}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-rose-300">
                      ${calculateTotal()}
                    </span>
                  </div>
                </div>

                {/* Confirm Button */}
                <Button
                  onClick={handleBooking}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3"
                >
                  Proceed to Payment
                </Button>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2">
              {[0, 1, 2].map((i) => (
                <div 
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    i === activeSection ? 'bg-rose-500' : 'bg-rose-500/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
