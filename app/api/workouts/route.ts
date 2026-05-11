import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  // Service role bypasses RLS — user identity verified above
  const serviceClient = await createServiceClient()

  const { data, error } = await serviceClient
    .from('workouts')
    .insert({
      title: body.title,
      exercises: body.exercises ?? [],
      notes: body.notes ?? null,
      athlete_id: user.id,
      workout_date: body.workout_date || new Date().toISOString().split('T')[0],
      status: body.status || 'completed',
      actual_distance_km: body.actual_distance_km ?? null,
      actual_pace: body.actual_pace ?? null,
    })
    .select()
    .single()

  if (error) {
    console.error('Workout insert error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data, { status: 201 })
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('athlete_id', user.id)
    .order('workout_date', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data)
}
