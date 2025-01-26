import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

interface SubscriptionPromoProps {
  isSubscribed: boolean
  onSubscribe: () => void
  onContinue: () => void
}

export function SubscriptionPromo({ isSubscribed, onSubscribe, onContinue }: SubscriptionPromoProps) {
  const savings = {
    yacht: 65,
    wellness: 15,
    drinks: 5,
  }

  if (isSubscribed) {
    return (
      <Card className="bg-green-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">You're a Member!</CardTitle>
          <CardDescription className="text-gray-100">
            Enjoy your exclusive benefits and discounted prices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 mt-0.5 text-green-300" />
              <p className="font-medium">Free Yacht Sessions (Save ${savings.yacht} per session)</p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 mt-0.5 text-green-300" />
              <p className="font-medium">Discounted Wellness Sessions (Save ${savings.wellness} per session)</p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 mt-0.5 text-green-300" />
              <p className="font-medium">Reduced Drink Prices (Save ${savings.drinks} per drink)</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={onContinue} className="w-full bg-white text-green-600 hover:bg-gray-100">
            Continue to Booking
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-purple-600 to-blue-500 text-white">
      <CardHeader>
        <CardTitle className="text-2xl">Enhance Your Experience</CardTitle>
        <CardDescription className="text-gray-100">
          Become a member to unlock exclusive benefits and savings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 mt-0.5 text-green-400" />
            <div>
              <p className="font-medium">Free Yacht Sessions</p>
              <p className="text-sm text-gray-200">Save ${savings.yacht} per session</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 mt-0.5 text-green-400" />
            <div>
              <p className="font-medium">Discounted Wellness Sessions</p>
              <p className="text-sm text-gray-200">Save ${savings.wellness} per session</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 mt-0.5 text-green-400" />
            <div>
              <p className="font-medium">Reduced Drink Prices</p>
              <p className="text-sm text-gray-200">Save ${savings.drinks} per drink</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white/10 p-4 mt-4">
          <p className="text-lg font-semibold">Monthly Membership</p>
          <p className="text-3xl font-bold mt-1">$150</p>
          <p className="text-sm text-gray-200 mt-1">Pay monthly, cancel anytime</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button onClick={onSubscribe} className="w-full bg-white text-purple-600 hover:bg-gray-100">
          Subscribe Now
        </Button>
        <Button onClick={onContinue} variant="outline" className="w-full text-white border-white hover:bg-white/20">
          Continue without Subscribing
        </Button>
      </CardFooter>
    </Card>
  )
}

