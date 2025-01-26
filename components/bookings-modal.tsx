'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface BookingsModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
}

export function BookingsModal({ isOpen, onCloseAction }: BookingsModalProps) {
  const { data: session, status } = useSession()
  const [activeSection, setActiveSection] = useState(0)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  const [yachtSessions, setYachtSessions] = useState<any[]>([])
  const [wellnessSessions, setWellnessSessions] = useState<any[]>([])
  const [drinks, setDrinks] = useState<any[]>([])
  const [selectedYachtSession, setSelectedYachtSession] = useState<any>(null)
  const [selectedWellnessSession, setSelectedWellnessSession] = useState<any>(null)
  const [selectedDrinks, setSelectedDrinks] = useState<any[]>([])

  // Fetch subscription status when authenticated
  useEffect(() => {
    if (session?.user?.id) {
      fetchSubscriptionStatus()
    }
    if (session?.user?.id) {
      fetchAvailableDates()
    }
  }, [session])

  useEffect(() => {
    if (selectedDate && session) {
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
      // Convert date strings to Date objects
      setAvailableDates(data.dates.map((dateStr: string) => new Date(dateStr)))
    } catch (error) {
      console.error('Error fetching available dates:', error)
    }
  }

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/user/subscription-status')
      const data = await response.json()
      setIsSubscribed(data.isSubscribed)
    } catch (error) {
      console.error('Error fetching subscription status:', error)
    }
  }

  const handleSubscribe = async () => {
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'subscribe' }),
      })

      if (!response.ok) throw new Error('Failed to subscribe')

      const data = await response.json()
      setIsSubscribed(true)
      console.log('Subscription successful:', data)
    } catch (error) {
      console.error('Error subscribing:', error)
    }
  }

  const calculateTotal = () => {
    let total = 0

    // Add yacht session cost
    if (selectedYachtSession) {
      total += isSubscribed ? 0 : selectedYachtSession.price
    }

    // Add wellness session cost
    if (selectedWellnessSession) {
      total += isSubscribed ? selectedWellnessSession.member_price : selectedWellnessSession.price
    }

    // Add drinks cost
    selectedDrinks.forEach(drink => {
      total += isSubscribed ? drink.price_member : drink.price_non_member
    })

    return total
  }

  const calculateSavings = () => {
    let savings = 0

    // Calculate yacht session savings
    if (selectedYachtSession) {
      savings += selectedYachtSession.price
    }

    // Calculate wellness session savings
    if (selectedWellnessSession) {
      savings += selectedWellnessSession.price - selectedWellnessSession.member_price
    }

    // Calculate drinks savings
    selectedDrinks.forEach(drink => {
      savings += drink.price_non_member - drink.price_member
    })

    return savings
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
    // Add validation logic here before allowing next
    setActiveSection(prev => Math.min(3, prev + 1))
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
              className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 backdrop-blur-sm border border-rose-500/20 text-white transition-opacity duration-200 hover:bg-black/70 ${activeSection === 3 ? 'opacity-0' : 'opacity-100'}`}
              disabled={activeSection === 3}
            >
              →
            </button>

            {/* Section 0: Authentication & Subscription */}
            <div className={`absolute inset-0 px-8 space-y-4 text-gray-300 transition-opacity duration-300 ${activeSection === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {status === 'loading' ? (
                <div className="text-center py-8">Loading...</div>
              ) : !session ? (
                <div className="text-center py-8 space-y-4">
                  <h3 className="text-xl font-semibold text-rose-300">Sign in to Continue</h3>
                  <p>Please sign in to book your wellness experience</p>
                  <Button 
                    onClick={() => signIn()}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-2"
                  >
                    Sign In
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-rose-300">Welcome, {session.user?.name}</h3>
                    <p>Choose your booking option:</p>
                  </div>
                  
                  <div className="space-y-4">
                    {isSubscribed ? (
                      <div className="bg-green-500/20 p-4 rounded-lg space-y-2">
                        <p className="font-semibold text-green-300">✓ You're a Member!</p>
                        <p>Enjoy free yacht sessions and discounted experiences</p>
                        <Button
                          onClick={handleNext}
                          className="w-full bg-green-500 hover:bg-green-600 text-white"
                        >
                          Continue to Booking
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-rose-500/20 p-4 rounded-lg space-y-2">
                          <h4 className="font-semibold">Monthly Membership - $150</h4>
                          <ul className="space-y-1 text-sm">
                            <li>• Free yacht sessions (Save $65 per session)</li>
                            <li>• Discounted wellness experiences</li>
                            <li>• Member prices on drinks</li>
                          </ul>
                          <Button
                            onClick={handleSubscribe}
                            className="w-full bg-rose-500 hover:bg-rose-600 text-white mt-2"
                          >
                            Subscribe Now
                          </Button>
                        </div>
                        <div className="text-center">
                          <Button
                            onClick={handleNext}
                            variant="outline"
                            className="text-rose-300 border-rose-300 hover:bg-rose-500/20"
                          >
                            Continue without Subscribing
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Section 1: Date Selection */}
            <div className={`absolute inset-0 px-8 space-y-4 text-gray-300 transition-opacity duration-300 ${activeSection === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <h3 className="text-xl font-semibold text-rose-300">Select Your Date</h3>
              <div className="bg-white/5 rounded-lg p-4">
                <Calendar
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border border-rose-500/20"
                  disabled={(date: Date) => !availableDates.some(
                    availableDate => 
                      availableDate.getFullYear() === date.getFullYear() &&
                      availableDate.getMonth() === date.getMonth() &&
                      availableDate.getDate() === date.getDate()
                  )}
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

            {/* Section 2: Session Selection */}
            <div className={`absolute inset-0 px-8 space-y-4 text-gray-300 transition-opacity duration-300 ${activeSection === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
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
                          <p className={isSubscribed ? 'line-through text-gray-500' : ''}>
                            ${session.price}
                          </p>
                          <p className="font-bold text-rose-300">
                            ${isSubscribed ? 0 : session.price}
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
                          <p className={isSubscribed ? 'line-through text-gray-500' : ''}>
                            ${session.price}
                          </p>
                          <p className="font-bold text-rose-300">
                            ${isSubscribed ? session.member_price : session.price}
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
                          <p className={isSubscribed ? 'line-through text-gray-500' : ''}>
                            ${drink.price_non_member}
                          </p>
                          <p className="font-bold text-rose-300">
                            ${isSubscribed ? drink.price_member : drink.price_non_member}
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
                              <span>${isSubscribed ? drink.price_member : drink.price_non_member}</span>
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

            {/* Section 3: Checkout */}
            <div className={`absolute inset-0 px-8 space-y-4 text-gray-300 transition-opacity duration-300 ${activeSection === 3 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
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
                        <p className={isSubscribed ? 'line-through text-gray-500' : ''}>
                          ${selectedYachtSession.price}
                        </p>
                        <p className="font-bold text-rose-300">
                          ${isSubscribed ? 0 : selectedYachtSession.price}
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
                        <p className={isSubscribed ? 'line-through text-gray-500' : ''}>
                          ${selectedWellnessSession.price}
                        </p>
                        <p className="font-bold text-rose-300">
                          ${isSubscribed ? selectedWellnessSession.member_price : selectedWellnessSession.price}
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
                            <p className={isSubscribed ? 'line-through text-gray-500' : ''}>
                              ${drink.price_non_member}
                            </p>
                            <p className="font-bold text-rose-300">
                              ${isSubscribed ? drink.price_member : drink.price_non_member}
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
                  {isSubscribed && (
                    <p className="text-sm text-green-400 mt-2">
                      Member savings: ${calculateSavings()}
                    </p>
                  )}
                </div>

                {/* Confirm Button */}
                <Button
                  onClick={handleBooking}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3"
                >
                  Confirm Booking
                </Button>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2">
              {[0, 1, 2, 3].map((i) => (
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
