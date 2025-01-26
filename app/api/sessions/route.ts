import { type NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

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

    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 })
    }

    const yachtSessions = await pool.query(
      `
      SELECT *, 
        65 AS price,
        0 AS member_price
      FROM yacht_sessions
      WHERE date = $1
      ORDER BY start_time
    `,
      [date],
    )

    const wellnessSessions = await pool.query(
      `
      SELECT *, 
        45 AS price,
        30 AS member_price
      FROM wellness_sessions
      WHERE yacht_session_date = $1
      ORDER BY start_time, type
    `,
      [date],
    )

    const drinks = await pool.query(
      `
      SELECT *
      FROM drinks
    `,
    )

    return NextResponse.json({
      yachtSessions: yachtSessions.rows,
      wellnessSessions: wellnessSessions.rows,
      drinks: drinks.rows,
    })
  } catch (error) {
    console.error("Database query error:", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}

