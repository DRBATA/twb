import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Session {
  id: string
  date: string
  start_time: string
  end_time: string
  type?: string
  ice_bath_number?: number
  available_capacity: number
  price: number
  member_price: number
}

interface Drink {
  id: string
  name: string
  price_member: number
  price_non_member: number
}

interface SessionSelectionProps {
  yachtSessions: Session[]
  wellnessSessions: Session[]
  drinks: Drink[]
  isSubscribed: boolean
  onSelect: (yachtSession: Session | null, experience: Session | null, drinks: Drink[]) => void
}

export function SessionSelection({
  yachtSessions,
  wellnessSessions,
  drinks,
  isSubscribed,
  onSelect,
}: SessionSelectionProps) {
  const [selectedYachtSession, setSelectedYachtSession] = useState<Session | null>(null)
  const [selectedExperience, setSelectedExperience] = useState<Session | null>(null)
  const [selectedDrinks, setSelectedDrinks] = useState<Drink[]>([])

  const handleYachtBooking = (session: Session) => {
    setSelectedYachtSession(session)
  }

  const handleExperienceBooking = (session: Session) => {
    setSelectedExperience(session)
  }

  const handleDrinkSelection = (drink: Drink) => {
    setSelectedDrinks([...selectedDrinks, drink])
  }

  const handleContinue = () => {
    onSelect(selectedYachtSession, selectedExperience, selectedDrinks)
  }

  return (
    <div>
      <Tabs defaultValue="yacht" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="yacht">Yacht Sessions</TabsTrigger>
          <TabsTrigger value="wellness">Experiences</TabsTrigger>
          <TabsTrigger value="drinks">Drinks</TabsTrigger>
        </TabsList>
        <TabsContent value="yacht">
          <ul className="space-y-2">
            {yachtSessions.map((session) => (
              <li key={session.id} className="flex justify-between items-center bg-white/10 p-2 rounded">
                <span>
                  {session.start_time} to {session.end_time} (Available: {session.available_capacity})
                </span>
                <div>
                  <span className={`mr-2 ${isSubscribed ? "line-through text-gray-400" : ""}`}>${session.price}</span>
                  <span className="font-bold">${isSubscribed ? session.member_price : session.price}</span>
                  <Button
                    onClick={() => handleYachtBooking(session)}
                    className={`ml-2 ${
                      selectedYachtSession?.id === session.id ? "bg-green-500" : "bg-blue-500"
                    } hover:bg-green-600`}
                    disabled={session.available_capacity === 0}
                  >
                    {selectedYachtSession?.id === session.id ? "Selected" : "Book"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="wellness">
          <ul className="space-y-2">
            {wellnessSessions.map((session) => (
              <li key={session.id} className="flex justify-between items-center bg-white/10 p-2 rounded">
                <span>
                  {session.start_time} to {session.end_time} - {session.type}{" "}
                  {session.ice_bath_number ? `(Bath ${session.ice_bath_number})` : ""} (Available:{" "}
                  {session.available_capacity})
                </span>
                <div>
                  <span className={`mr-2 ${isSubscribed ? "line-through text-gray-400" : ""}`}>${session.price}</span>
                  <span className="font-bold">${isSubscribed ? session.member_price : session.price}</span>
                  <Button
                    onClick={() => handleExperienceBooking(session)}
                    className={`ml-2 ${
                      selectedExperience?.id === session.id ? "bg-green-500" : "bg-blue-500"
                    } hover:bg-green-600`}
                    disabled={session.available_capacity === 0}
                  >
                    {selectedExperience?.id === session.id ? "Selected" : "Book"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="drinks">
          <ul className="space-y-2">
            {drinks.map((drink) => (
              <li key={drink.id} className="flex justify-between items-center bg-white/10 p-2 rounded">
                <span>{drink.name}</span>
                <div>
                  <span className={`mr-2 ${isSubscribed ? "line-through text-gray-400" : ""}`}>
                    ${drink.price_non_member}
                  </span>
                  <span className="font-bold">${isSubscribed ? drink.price_member : drink.price_non_member}</span>
                  <Button onClick={() => handleDrinkSelection(drink)} className="ml-2 bg-blue-500 hover:bg-blue-600">
                    Add
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
      <Button onClick={handleContinue} className="w-full mt-4 bg-green-500 hover:bg-green-600">
        Continue to Checkout
      </Button>
    </div>
  )
}

