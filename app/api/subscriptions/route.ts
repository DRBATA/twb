import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

// Mock Stripe subscription function
async function mockStripeSubscription(
  action: "subscribe" | "unsubscribe",
  userId: string,
): Promise<{ success: boolean; id: string }> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Simulate successful subscription/unsubscription 95% of the time
  const success = Math.random() < 0.95

  if (success) {
    const client = await pool.connect()
    try {
      await client.query("BEGIN")

      // Update user's subscription status in the database
      const newStatus = action === "subscribe" ? "member" : "non-member"
      const updateResult = await client.query(
        "UPDATE users SET subscription_status = $1 WHERE id = $2 RETURNING subscription_status",
        [newStatus, userId],
      )

      if (updateResult.rows.length === 0) {
        throw new Error("User not found")
      }

      // Simulate webhook call (we'll keep this for consistency, but it's not strictly necessary now)
      const event = {
        type: action === "subscribe" ? "checkout.session.completed" : "customer.subscription.deleted",
        data: {
          object: {
            client_reference_id: userId,
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

      await client.query("COMMIT")
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }
  }

  return {
    success,
    id: success ? `mock_subscription_${Date.now()}` : "",
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { action } = await request.json()

  if (action !== "subscribe" && action !== "unsubscribe") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }

  try {
    const stripeResult = await mockStripeSubscription(action, session.user.id)

    if (!stripeResult.success) {
      throw new Error(`Failed to ${action}`)
    }

    // Fetch the updated user data
    const client = await pool.connect()
    try {
      const result = await client.query("SELECT subscription_status FROM users WHERE id = $1", [session.user.id])
      const updatedStatus = result.rows[0]?.subscription_status

      return NextResponse.json({
        success: true,
        message: `Successfully ${action === "subscribe" ? "subscribed" : "unsubscribed"}`,
        subscriptionId: stripeResult.id,
        newStatus: updatedStatus,
      })
    } finally {
      client.release()
    }
  } catch (error: any) {
    console.error(`Error ${action}ing:`, error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

