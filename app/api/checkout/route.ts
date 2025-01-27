import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/auth"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

async function mockStripeCheckout(userId: string, items: any): Promise<{ success: boolean; id: string }> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Simulate successful checkout 95% of the time
  const success = Math.random() < 0.95

  if (success) {
    // Simulate webhook call
    const event = {
      type: "checkout.session.completed",
      data: {
        object: {
          client_reference_id: userId,
          mode: "payment",
          metadata: items,
        },
      },
    }

    await fetch("/api/webhooks/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "stripe-signature": "mock_signature",
      },
      body: JSON.stringify(event),
    })
  }

  return {
    success,
    id: success ? `mock_checkout_${Date.now()}` : "",
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { yachtSession, experience, drinks } = await request.json()

  try {
    // Get user's subscription status
    const userResult = await pool.query("SELECT subscription_status FROM users WHERE id = $1", [session.user.id])
    const isSubscribed = userResult.rows[0]?.subscription_status === "member"

    // Calculate prices based on subscription status
    const yachtPrice = isSubscribed ? 0 : 65
    const experiencePrice = isSubscribed ? 30 : 45
    const drinksPrice = drinks.reduce(
      (total: number, drink: any) => total + (isSubscribed ? drink.price_member : drink.price_non_member),
      0,
    )

    const totalPrice = yachtPrice + experiencePrice + drinksPrice

    const items = {
      yachtSession,
      experience,
      drinks,
      totalPrice,
    }

    const checkoutResult = await mockStripeCheckout(session.user.id, items)

    if (!checkoutResult.success) {
      throw new Error("Checkout failed")
    }

    return NextResponse.json({
      success: true,
      message: "Checkout successful",
      checkoutId: checkoutResult.id,
      totalPrice,
    })
  } catch (error: any) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

