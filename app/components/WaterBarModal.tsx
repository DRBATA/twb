"use client"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SubscriptionPromo } from "./SubscriptionPromo"
import { DateSelectionModal } from "./DateSelectionModal"
import { SessionSelection } from "./SessionSelection"

export function WaterBarModal() {
  const { data: session, status } = useSession()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isDateModalOpen, setIsDateModalOpen] = useState(false)
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  const [yachtSessions, setYachtSessions] = useState([])
  const [wellnessSessions, setWellnessSessions] = useState([])
  const [drinks, setDrinks] = useState([])

  useEffect(() => {
    if (session) {
      fetchUserSubscriptionStatus()
      fetchAvailableDates()
    }
  }, [session])

  const fetchUserSubscriptionStatus = async () => {
    try {
      const response = await fetch("/api/user/subscription-status")
      const data = await response.json()
      setIsSubscribed(data.isSubscribed)
    } catch (error) {
      console.error("Error fetching subscription status:", error)
    }
  }

  const fetchAvailableDates = async () => {
    try {
      const response = await fetch("/api/available-dates")
      const data = await response.json()
      setAvailableDates(data.availableDates.map((dateString: string) => new Date(dateString)))
    } catch (error) {
      console.error("Error fetching available dates:", error)
    }
  }

  const fetchSessions = async (date: Date) => {
    try {
      const response = await fetch(`/api/sessions?date=${format(date, "yyyy-MM-dd")}`)
      const data = await response.json()
      setYachtSessions(data.yachtSessions)
      setWellnessSessions(data.wellnessSessions)
      setDrinks(data.drinks)
    } catch (error) {
      console.error("Error fetching sessions:", error)
    }
  }

  const handleSubscribe = async () => {
    if (!session?.user?.id) {
      console.error("User not authenticated")
      return
    }

    try {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "subscribe" }),
      })

      if (!response.ok) {
        throw new Error("Failed to create subscription")
      }

      const result = await response.json()
      console.log("Subscription result:", result)
      alert(result.message)
      setIsSubscribed(true)
      setStep(2) // Move to date selection after subscribing
    } catch (error) {
      console.error("Error creating subscription:", error)
      alert("Failed to create subscription. Please try again.")
    }
  }

  const handleContinueWithoutSubscription = () => {
    setStep(2) // Proceed to date selection without subscribing
  }

  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date)
    setIsDateModalOpen(false)
    await fetchSessions(date)
    setStep(3) // Move to session selection after date is chosen
  }

  const handleSessionSelect = (yachtSession, experience, selectedDrinks) => {
    // Handle session selection (to be implemented)
    setStep(4) // Move to checkout
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <SubscriptionPromo
            isSubscribed={isSubscribed}
            onSubscribe={handleSubscribe}
            onContinue={handleContinueWithoutSubscription}
          />
        )
      case 2:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Select a Date</h2>
            <Button onClick={() => setIsDateModalOpen(true)} className="bg-blue-500 hover:bg-blue-600">
              Open Date Selection
            </Button>
            <DateSelectionModal
              isOpen={isDateModalOpen}
              onClose={() => setIsDateModalOpen(false)}
              onDateSelect={handleDateSelect}
              availableDates={availableDates}
            />
          </div>
        )
      case 3:
        return (
          <SessionSelection
            yachtSessions={yachtSessions}
            wellnessSessions={wellnessSessions}
            drinks={drinks}
            isSubscribed={isSubscribed}
            onSelect={handleSessionSelect}
          />
        )
      case 4:
        // Checkout step (to be implemented)
        return (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
            <p>Implement checkout process here</p>
          </div>
        )
      default:
        return null
    }
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <Card className="w-[800px] h-[600px] bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-500 opacity-50"></div>
      <div className="relative z-10 h-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Welcome to The Water Bar</CardTitle>
          <CardDescription className="text-center text-gray-300">Begin your wellness journey with us</CardDescription>
        </CardHeader>
        <CardContent className="h-[calc(100%-160px)] flex items-center justify-center">
          {!session ? (
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-semibold">Sign in to Continue</h2>
              <p className="text-gray-300">Please sign in to book your wellness experience</p>
              <Button onClick={() => signIn()} className="bg-blue-500 hover:bg-blue-600">
                Sign In
              </Button>
            </div>
          ) : (
            <div className="w-full max-w-2xl">{renderStep()}</div>
          )}
        </CardContent>
      </div>
    </Card>
  )
}

