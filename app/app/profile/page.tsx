import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SignOutButton } from '@/components/sign-out-button'
import Image from 'next/image'

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { count: workoutCount } = await supabase
    .from('workouts')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const memberSince = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const initials =
    profile?.full_name
      ?.split(' ')
      .map((n: string) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ||
    user.email?.[0]?.toUpperCase() ||
    'A'

  return (
    <div className="px-4 pt-14 pb-6">
      <h1 className="text-2xl font-bold text-white tracking-tight mb-8">Profile</h1>

      {/* Avatar + Name */}
      <div className="flex items-center gap-4 mb-8">
        {profile?.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt="Profile photo"
            width={72}
            height={72}
            className="rounded-full"
          />
        ) : (
          <div className="w-[72px] h-[72px] rounded-full bg-orange-500 flex items-center justify-center shrink-0">
            <span className="text-white text-2xl font-bold">{initials}</span>
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-white font-bold text-lg leading-tight truncate">
            {profile?.full_name || 'Athlete'}
          </h2>
          <p className="text-gray-500 text-sm truncate">{user.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-900 border border-gray-800/80 rounded-3xl p-5 mb-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Total Workouts</span>
          <span className="text-white font-bold text-lg tabular-nums">{workoutCount ?? 0}</span>
        </div>
        <div className="border-t border-gray-800" />
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Member Since</span>
          <span className="text-white text-sm font-medium">{memberSince}</span>
        </div>
        <div className="border-t border-gray-800" />
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Account</span>
          <span className="text-white text-sm font-medium">Google</span>
        </div>
      </div>

      <SignOutButton />
    </div>
  )
}
