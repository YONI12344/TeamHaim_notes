import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function WorkoutsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: workouts } = await supabase
    .from('workouts')
    .select('id, title, notes, created_at, exercises')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="px-4 pt-14 pb-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Workouts</h1>
        <Link
          href="/app/workouts/new"
          className="bg-orange-500 text-white px-4 py-2.5 rounded-2xl text-sm font-semibold active:bg-orange-600 transition-colors"
        >
          Log New
        </Link>
      </div>

      {workouts?.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-14 h-14 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7 text-gray-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm font-medium">No workouts yet</p>
          <p className="text-gray-600 text-xs mt-1">Log your first session to get started</p>
        </div>
      ) : (
        <div className="space-y-2">
          {workouts?.map((workout) => (
            <Link
              key={workout.id}
              href={`/app/workouts/${workout.id}`}
              className="flex items-center justify-between bg-gray-900 border border-gray-800/80 rounded-2xl px-4 py-4 active:bg-gray-800 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="text-white text-sm font-semibold">{workout.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {(workout.exercises as any[])?.length || 0} exercises
                  {workout.notes ? ` · ${workout.notes.slice(0, 30)}${workout.notes.length > 30 ? '...' : ''}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-3 ml-4 shrink-0">
                <span className="text-gray-500 text-xs">
                  {new Date(workout.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-gray-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
