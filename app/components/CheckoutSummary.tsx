import { Button } from "@/components/ui/button"

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

interface CheckoutSummaryProps {
  yachtSession: Session | null
  experience: Session | null
  drinks: Drink[]
  isSubscribed: boolean
  onCheckout: () => void
  onBack: () => void
}

export function CheckoutSummary({
  yachtSession,
  experience,
  drinks,
  isSubscribed,
  onCheckout,
  onBack,
}: CheckoutSummaryProps) {
  const calculateTotal = () => {
    let total = 0
    if (yachtSession) {
      total += isSubscribed ? yachtSession.member_price : yachtSession.price
    }
    if (experience) {
      total += isSubscribed ? experience.member_price : experience.price
    }
    drinks.forEach((drink) => {
      total += isSubscribed ? drink.price_member : drink.price_non_member
    })
    return total
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Booking Summary</h3>
      {yachtSession && (
        <div>
          <p>
            Yacht Session: {yachtSession.start_time} to {yachtSession.end_time}
          </p>
          <p>Price: ${isSubscribed ? yachtSession.member_price : yachtSession.price}</p>
        </div>
      )}
      {experience && (
        <div>
          <p>
            Experience: {experience.type} - {experience.start_time} to {experience.end_time}
          </p>
          <p>Price: ${isSubscribed ? experience.member_price : experience.price}</p>
        </div>
      )}
      {drinks.length > 0 && (
        <div>
          <p>Drinks:</p>
          <ul>
            {drinks.map((drink, index) => (
              <li key={index}>
                {drink.name} - ${isSubscribed ? drink.price_member : drink.price_non_member}
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="font-bold">Total: ${calculateTotal()}</p>
      <div className="flex justify-between">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button onClick={onCheckout} className="bg-green-500 hover:bg-green-600">
          Confirm and Pay
        </Button>
      </div>
    </div>
  )
}

