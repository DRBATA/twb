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

// Mock Stripe payment function
async function mockStripePayment(amount: number): Promise<{ success: boolean; id: string }> {
  // Simulate payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Simulate successful payment 90% of the time
  const success = Math.random() < 0.9

  return {
    success,
    id: success ? `mock_payment_${Date.now()}` : "",
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId, sessionType } = await request.json()

    const client = await pool.connect()
    try {
      await client.query("BEGIN")

      let bookingResult
      let price: number

      if (sessionType === "yacht") {
        bookingResult = await client.query(
          `
          UPDATE yacht_sessions 
          SET available_capacity = available_capacity - 1
          WHERE id = $1 AND available_capacity > 0
          RETURNING id, date, start_time, end_time, available_capacity
        `,
          [sessionId],
        )

        if (bookingResult.rows.length === 0) {
          throw new Error("Session not found or no availability")
        }

        price = 65 // Non-member price for yacht session
      } else if (sessionType === "wellness") {
        bookingResult = await client.query(
          `
          UPDATE wellness_sessions 
          SET available_capacity = available_capacity - 1
          WHERE id = $1 AND available_capacity > 0
          RETURNING id, date, start_time, end_time, available_capacity
        `,
          [sessionId],
        )

        if (bookingResult.rows.length === 0) {
          throw new Error("Session not found or no availability")
        }

        price = 45 // Non-member price for wellness session
      } else {
        throw new Error("Invalid session type")
      }

      // Check if user is subscribed
      const userResult = await client.query("SELECT subscription_status FROM users WHERE id = $1", [session.user.id])
      const isSubscribed = userResult.rows[0]?.subscription_status === "member"

      // If user is subscribed, set price to 0
      if (isSubscribed) {
        price = 0
      }

      // Process mock payment
      const paymentResult = await mockStripePayment(price)

      if (!paymentResult.success) {
        throw new Error("Payment failed")
      }

      // Record the booking
      const bookingInsertResult = await client.query(
        `
        INSERT INTO bookings (user_id, ${sessionType}_session_id, price, payment_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id
        `,
        [session.user.id, sessionId, price, paymentResult.id],
      )

      await client.query("COMMIT")

      // Mock email generation
      const mockQRCode = `QR_${bookingInsertResult.rows[0].id}`
      const emailContent = `
        Booking Confirmation
        --------------------
        Thank you for booking a ${sessionType} session at The Water Bar!
        
        Booking Details:
        - Booking ID: ${bookingInsertResult.rows[0].id}
        - Session Type: ${sessionType}
        - Date: ${bookingResult.rows[0].date}
        - Time: ${bookingResult.rows[0].start_time} - ${bookingResult.rows[0].end_time}
        - Price: $${price}
        - Payment ID: ${paymentResult.id}
        
        Your booking QR code: ${mockQRCode}
        
        Please present this QR code when you arrive.
        
        We look forward to seeing you!
        
        The Water Bar Team
      `

      // Log the email content to the console
      console.log("Booking Confirmation Email:")
      console.log(emailContent)

      return NextResponse.json({
        success: true,
        message: "Booking successful. Check the server console for the confirmation email content.",
        newAvailability: bookingResult.rows[0].available_capacity,
      })
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }
  } catch (error: any) {
    console.error("Booking error:", error)
    return NextResponse.json({ error: error.message || "Failed to create booking" }, { status: 500 })
  }
}

