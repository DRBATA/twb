import { NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature") as string

  // In a real scenario, we would verify the webhook signature here
  // For our mock, we'll assume it's always valid

  try {
    const event = JSON.parse(body)

    console.log("Received event:", event.type)

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object

        if (session.mode === "subscription") {
          // Handle subscription payment
          await pool.query(
            `UPDATE users SET subscription_status = 'member', subscription_end_date = $1 WHERE id = $2`,
            [new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), session.client_reference_id],
          )
          console.log(`Updated subscription for user ${session.client_reference_id}`)
        } else if (session.mode === "payment") {
          // Handle one-time payment for yacht session, experience, and drinks
          console.log(`Processed payment for user ${session.client_reference_id}`)
          console.log(`Items purchased: ${JSON.stringify(session.metadata)}`)
          // Here you would typically update your database to reflect the purchase
        }
        break

      case "customer.subscription.deleted":
        const subscription = event.data.object
        await pool.query(
          `UPDATE users SET subscription_status = 'non-member', subscription_end_date = NULL WHERE id = $1`,
          [subscription.client_reference_id],
        )
        console.log(`Cancelled subscription for user ${subscription.client_reference_id}`)
        break

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("Error processing webhook:", err)
    return NextResponse.error()
  }
}

