import { createClient } from '@/lib/supabase/server'
import { StatusBadge } from '@/components/StatusBadge'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch all data in parallel
  const [
    { data: meta },
    { data: epics },
    { data: stories },
    { data: updates },
    { data: changelog },
    { data: feedback },
  ] = await Promise.all([
    supabase.from('project_meta').select('*').single(),
    supabase.from('epics').select('*').order('order_index'),
    supabase.from('stories').select('*').order('order_index'),
    supabase.from('weekly_updates').select('*').order('week_number', { ascending: false }).limit(1),
    supabase.from('changelog').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('feedback').select('*').eq('status', 'open').order('created_at', { ascending: false }),
  ])

  // Calculate stats
  const totalStories = stories?.length || 0
  const completedStories = stories?.filter(s => s.status === 'complete').length || 0
  const inProgressStories = stories?.filter(s => s.status === 'in_progress').length || 0
  const blockedStories = stories?.filter(s => s.status === 'blocked').length || 0
  const progressPercent = totalStories > 0 ? Math.round((completedStories / totalStories) * 100) : 0

  // Get current week stories
  const currentWeekStories = stories?.filter(s => s.planned_week === meta?.current_week) || []

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Overall Progress"
          value={`${progressPercent}%`}
          subtext={`${completedStories} of ${totalStories} stories`}
        />
        <StatCard
          label="In Progress"
          value={inProgressStories.toString()}
          subtext="stories active"
          highlight="blue"
        />
        <StatCard
          label="Blocked"
          value={blockedStories.toString()}
          subtext="need attention"
          highlight={blockedStories > 0 ? 'yellow' : undefined}
        />
        <StatCard
          label="Open Feedback"
          value={(feedback?.length || 0).toString()}
          subtext="items to review"
          highlight={(feedback?.length || 0) > 0 ? 'purple' : undefined}
        />
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Phase 1 Progress</h2>
          <span className="text-gray-400 text-sm">
            Week {meta?.current_week} of {meta?.total_weeks}
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3">
          <div
            className="bg-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Start: {meta?.start_date}</span>
          <span>Target: {meta?.target_end_date}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* This Week */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Week {meta?.current_week} Focus</h2>
            <Link href="/admin/timeline" className="text-purple-400 text-sm hover:text-purple-300">
              View Timeline →
            </Link>
          </div>
          {currentWeekStories.length > 0 ? (
            <div className="space-y-3">
              {currentWeekStories.map(story => (
                <div
                  key={story.id}
                  className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                >
                  <span className="text-sm">{story.title}</span>
                  <StatusBadge status={story.status || 'not_started'} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No stories planned for this week</p>
          )}
        </div>

        {/* Latest Update */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Latest Update</h2>
            <Link href="/admin/updates" className="text-purple-400 text-sm hover:text-purple-300">
              View All →
            </Link>
          </div>
          {updates && updates.length > 0 ? (
            <div>
              <p className="text-sm text-gray-400 mb-2">
                Week {updates[0].week_number} • {updates[0].date}
              </p>
              <p className="text-white">{updates[0].summary}</p>
              {updates[0].blockers && updates[0].blockers.length > 0 && (
                <div className="mt-3 p-2 bg-yellow-900/20 rounded border border-yellow-800">
                  <p className="text-yellow-400 text-xs font-medium mb-1">Blockers:</p>
                  <ul className="text-yellow-300 text-sm">
                    {updates[0].blockers.map((b, i) => (
                      <li key={i}>• {b}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No updates yet</p>
          )}
        </div>

        {/* Recent Changelog */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Ships</h2>
            <Link href="/admin/changelog" className="text-purple-400 text-sm hover:text-purple-300">
              View All →
            </Link>
          </div>
          {changelog && changelog.length > 0 ? (
            <div className="space-y-3">
              {changelog.map(item => (
                <div key={item.id} className="flex items-start gap-3">
                  <TypeIcon type={item.type} />
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Nothing shipped yet</p>
          )}
        </div>

        {/* Open Feedback */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Open Feedback</h2>
            <Link href="/admin/feedback" className="text-purple-400 text-sm hover:text-purple-300">
              View All →
            </Link>
          </div>
          {feedback && feedback.length > 0 ? (
            <div className="space-y-3">
              {feedback.slice(0, 4).map(item => (
                <div key={item.id} className="p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400">{item.author}</span>
                    <span className="text-xs text-gray-600">•</span>
                    <span className="text-xs text-gray-400">{item.type}</span>
                  </div>
                  <p className="text-sm line-clamp-2">{item.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No open feedback</p>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  subtext,
  highlight,
}: {
  label: string
  value: string
  subtext: string
  highlight?: 'blue' | 'yellow' | 'purple'
}) {
  const highlightColors = {
    blue: 'text-blue-400',
    yellow: 'text-yellow-400',
    purple: 'text-purple-400',
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? highlightColors[highlight] : 'text-white'}`}>
        {value}
      </p>
      <p className="text-xs text-gray-500">{subtext}</p>
    </div>
  )
}

function TypeIcon({ type }: { type: string }) {
  const icons: Record<string, { bg: string; icon: string }> = {
    feature: { bg: 'bg-purple-900', icon: '✨' },
    fix: { bg: 'bg-red-900', icon: '🔧' },
    improvement: { bg: 'bg-blue-900', icon: '📈' },
  }
  const config = icons[type] || icons.feature

  return (
    <span className={`w-6 h-6 ${config.bg} rounded flex items-center justify-center text-xs`}>
      {config.icon}
    </span>
  )
}
