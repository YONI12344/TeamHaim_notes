'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Trophy, Target, Heart, Zap, User, Edit3, Check, X } from 'lucide-react'

interface ProfileData {
  id: string
  full_name: string | null
  group_name: string | null
  role: string
  birth_year?: number | null
  gender?: string | null
  pr_1500?: string | null
  pr_3000?: string | null
  pr_5000?: string | null
  pr_10000?: string | null
  pr_half_marathon?: string | null
  pr_marathon?: string | null
  vo2_max?: number | null
  lactate_threshold_pace?: string | null
  anaerobic_threshold_hr?: number | null
  resting_hr?: number | null
  max_hr?: number | null
  main_race?: string | null
  main_race_date?: string | null
  main_goal?: string | null
  secondary_goal?: string | null
  coach_notes?: string | null
}

interface Props {
  profile: ProfileData
  isCoach?: boolean
}

export function ProfileClient({ profile }: Props) {
  const supabase = createClient()
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<ProfileData>(profile)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: form.full_name,
        birth_year: form.birth_year,
        gender: form.gender,
        pr_1500: form.pr_1500,
        pr_3000: form.pr_3000,
        pr_5000: form.pr_5000,
        pr_10000: form.pr_10000,
        pr_half_marathon: form.pr_half_marathon,
        pr_marathon: form.pr_marathon,
        vo2_max: form.vo2_max,
        lactate_threshold_pace: form.lactate_threshold_pace,
        anaerobic_threshold_hr: form.anaerobic_threshold_hr,
        resting_hr: form.resting_hr,
        max_hr: form.max_hr,
        main_race: form.main_race,
        main_race_date: form.main_race_date,
        main_goal: form.main_goal,
        secondary_goal: form.secondary_goal,
        coach_notes: form.coach_notes,
      })
      .eq('id', profile.id)
    setSaving(false)
    if (error) {
      toast.error('שגיאה בשמירה')
    } else {
      toast.success('הפרופיל עודכן!')
      setEditing(false)
      router.refresh()
    }
  }

  const Field = ({ label, value, field, placeholder }: {
    label: string
    value: string | number | null | undefined
    field: keyof ProfileData
    placeholder?: string
  }) => (
    <div>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      {editing ? (
        <input
          value={(form[field] as string) || ''}
          onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
          placeholder={placeholder || label}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
        />
      ) : (
        <p className="text-sm font-medium text-navy">{value || <span className="text-gray-300">—</span>}</p>
      )}
    </div>
  )

  const PRCard = ({ distance, value, field }: {
    distance: string
    value: string | null | undefined
    field: keyof ProfileData
  }) => (
    <div className={`rounded-xl p-3 border-2 transition ${value ? 'border-yellow-300 bg-yellow-50' : 'border-gray-100 bg-gray-50'}`}>
      <p className="text-xs font-semibold text-gray-500 mb-1">{distance}</p>
      {editing ? (
        <input
          value={(form[field] as string) || ''}
          onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
          placeholder="דק:שנ"
          className="w-full bg-transparent border-b border-gray-300 text-sm font-bold text-navy outline-none pb-0.5"
        />
      ) : (
        <p className={`text-lg font-bold ${value ? 'text-navy' : 'text-gray-300'}`}>
          {value || '—:——'}
        </p>
      )}
    </div>
  )

  const StatCard = ({ label, value, field, color, unit }: {
    label: string
    value: number | null | undefined
    field: keyof ProfileData
    color: string
    unit: string
  }) => (
    <div className={`rounded-xl p-4 ${color}`}>
      <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
      {editing ? (
        <input
          value={(form[field] as string) || ''}
          onChange={e => setForm(f => ({ ...f, [field]: parseFloat(e.target.value) || null }))}
          placeholder="—"
          className="w-full bg-transparent border-b border-gray-300 text-2xl font-bold text-navy outline-none"
        />
      ) : (
        <p className="text-2xl font-bold text-navy">{value || <span className="text-gray-300 text-lg">—</span>}</p>
      )}
      <p className="text-xs text-gray-400 mt-1">{unit}</p>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6" dir="rtl">

      {/* Header Card */}
      <div className="bg-navy rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-10 -translate-y-10" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full translate-x-8 translate-y-8" />
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-yellow-400/20 border-2 border-yellow-400/40 flex items-center justify-center">
              <User className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              {editing ? (
                <input
                  value={form.full_name || ''}
                  onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-xl font-bold outline-none mb-1 w-48"
                />
              ) : (
                <h1 className="text-2xl font-bold">{profile.full_name || 'ספורטאי'}</h1>
              )}
              <p className="text-yellow-400/80 text-sm">{profile.group_name || 'Team Haim'}</p>
              <p className="text-white/40 text-xs mt-1">{profile.role === 'coach' ? 'מאמן' : 'ספורטאי'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {editing ? (
              <>
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-1 bg-yellow-400 text-navy px-4 py-2 rounded-xl text-sm font-semibold hover:bg-yellow-300 transition">
                  <Check className="w-4 h-4" />
                  {saving ? 'שומר...' : 'שמור'}
                </button>
                <button onClick={() => { setEditing(false); setForm(profile) }}
                  className="flex items-center gap-1 bg-white/10 text-white px-4 py-2 rounded-xl text-sm hover:bg-white/20 transition">
                  <X className="w-4 h-4" />
                  ביטול
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)}
                className="flex items-center gap-1 bg-white/10 text-white px-4 py-2 rounded-xl text-sm hover:bg-white/20 transition">
                <Edit3 className="w-4 h-4" />
                ערוך
              </button>
            )}
          </div>
        </div>
        <div className="relative flex gap-6 mt-4 pt-4 border-t border-white/10">
          <Field label="שנת לידה" value={profile.birth_year} field="birth_year" placeholder="1995" />
          <Field label="מין" value={profile.gender} field="gender" placeholder="זכר/נקבה" />
        </div>
      </div>

      {/* PR Section */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-bold text-navy">שיאים אישיים</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <PRCard distance="1500 מטר" value={profile.pr_1500} field="pr_1500" />
          <PRCard distance="3000 מטר" value={profile.pr_3000} field="pr_3000" />
          <PRCard distance="5 קמ" value={profile.pr_5000} field="pr_5000" />
          <PRCard distance="10 קמ" value={profile.pr_10000} field="pr_10000" />
          <PRCard distance="חצי מרתון" value={profile.pr_half_marathon} field="pr_half_marathon" />
          <PRCard distance="מרתון" value={profile.pr_marathon} field="pr_marathon" />
        </div>
      </div>

      {/* Physiological Data */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-bold text-navy">נתונים פיזיולוגיים</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="VO2 Max" value={profile.vo2_max} field="vo2_max" color="bg-blue-50" unit="מל/קג/דקה" />
          <StatCard label="דופק מנוחה" value={profile.resting_hr} field="resting_hr" color="bg-red-50" unit="דפד" />
          <StatCard label="דופק מקסימלי" value={profile.max_hr} field="max_hr" color="bg-red-50" unit="דפד" />
          <StatCard label="סף אנאירובי HR" value={profile.anaerobic_threshold_hr} field="anaerobic_threshold_hr" color="bg-orange-50" unit="דפד" />
        </div>
        <div className="mt-4">
          <Field label="קצב סף לקטי" value={profile.lactate_threshold_pace} field="lactate_threshold_pace" placeholder="4:30" />
        </div>
      </div>

      {/* Goals & Races */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-green-500" />
          <h2 className="text-lg font-bold text-navy">מטרות ותחרויות</h2>
        </div>
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-yellow-600 mb-2">תחרות מטרה עיקרית</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="שם התחרות" value={profile.main_race} field="main_race" placeholder="מרתון תל אביב" />
              <Field label="תאריך" value={profile.main_race_date} field="main_race_date" placeholder="2026-03-15" />
            </div>
          </div>
          <Field label="מטרה עיקרית" value={profile.main_goal} field="main_goal" placeholder="לרוץ מרתון מתחת ל-3:30" />
          <Field label="מטרה משנית" value={profile.secondary_goal} field="secondary_goal" placeholder="שיפור 5 קמ ל-20 דקות" />
        </div>
      </div>

      {/* Coach Notes */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-bold text-navy">הערות מאמן</h2>
          <span className="text-xs text-gray-400 mr-auto">גלוי למאמן בלבד</span>
        </div>
        {editing ? (
          <textarea
            value={form.coach_notes || ''}
            onChange={e => setForm(f => ({ ...f, coach_notes: e.target.value }))}
            rows={4}
            placeholder="הערות על הספורטאי, היסטוריה רפואית, נקודות חזקות..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none resize-none"
          />
        ) : (
          <p className="text-sm text-gray-600 leading-relaxed">
            {profile.coach_notes || <span className="text-gray-300">אין הערות עדיין</span>}
          </p>
        )}
      </div>
    </div>
  )
}