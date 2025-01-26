import { type NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get("date")

    // If no date provided, return available dates
    if (!date) {
      const availableDates = await pool.query(
        `
        SELECT DISTINCT date
        FROM yacht_sessions
        WHERE date >= CURRENT_DATE
        ORDER BY date
        LIMIT 30
        `
      )
      return NextResponse.json({
        dates: availableDates.rows.map(row => row.date)
      })
    }

    const yachtSessions = await pool.query(
      `
      SELECT *, 
        65 AS price
      FROM yacht_sessions
      WHERE date = $1
      ORDER BY start_time
    `,
      [date],
    )

    const wellnessSessions = await pool.query(
      `
      SELECT *, 
        45 AS price
      FROM wellness_sessions
      WHERE yacht_session_date = $1
      ORDER BY start_time, type
    `,
      [date],
    )

    const drinks = await pool.query(
      `
      SELECT *,
        price_non_member AS price
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
