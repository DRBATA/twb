import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/auth"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await pool.query("SELECT subscription_status FROM users WHERE id = $1", [session.user.id])

    const isSubscribed = result.rows[0]?.subscription_status === "member"

    return NextResponse.json({ isSubscribed })
  } catch (error) {
    console.error("Error fetching subscription status:", error)
    return NextResponse.json({ error: "Failed to fetch subscription status" }, { status: 500 })
  }
}

