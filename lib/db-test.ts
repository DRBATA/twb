import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

async function testConnection() {
  try {
    const client = await pool.connect()
    console.log('Successfully connected to database')
    
    // Get yacht sessions for next 30 days
    const yachtResult = await client.query(`
      SELECT date, start_time, end_time, available_capacity, 
             member_price, non_member_price, is_weekend
      FROM yacht_sessions
      WHERE date >= CURRENT_DATE
      AND date <= CURRENT_DATE + INTERVAL '30 days'
      ORDER BY date, start_time
    `)
    console.log('\nYacht Sessions (next 30 days):', yachtResult.rows.length, 'sessions found')
    console.table(yachtResult.rows)

    // Get wellness sessions
    const wellnessResult = await client.query(`
      SELECT yacht_session_date, type, start_time, end_time,
             ice_bath_number, available_capacity,
             member_price, non_member_price
      FROM wellness_sessions
      WHERE yacht_session_date >= CURRENT_DATE
      AND yacht_session_date <= CURRENT_DATE + INTERVAL '30 days'
      ORDER BY yacht_session_date, start_time
    `)
    console.log('\nWellness Sessions (next 30 days):', wellnessResult.rows.length, 'sessions found')
    console.table(wellnessResult.rows)

    // Get drinks menu
    const drinksResult = await client.query(`
      SELECT name, member_price, non_member_price
      FROM drinks
      ORDER BY name
    `)
    console.log('\nDrinks Menu:')
    console.table(drinksResult.rows)
    
    client.release()
  } catch (error) {
    console.error('Error connecting to database:', error)
  } finally {
    await pool.end()
  }
}

testConnection()
