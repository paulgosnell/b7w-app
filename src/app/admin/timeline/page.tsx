import { createClient } from '@/lib/supabase/server'
import { StatusBadge } from '@/components/StatusBadge'

export default async function TimelinePage() {
  const supabase = await createClient()

  const [{ data: meta }, { data: epics }, { data: stories }] = await Promise.all([
    supabase.from('project_meta').select('*').single(),
    supabase.from('epics').select('*').order('order_index'),
    supabase.from('stories').select('*, epics(title)').order('order_index'),
  ])

  const currentWeek = meta?.current_week || 1
  const totalWeeks = meta?.total_weeks || 10

  // Group stories by week
  const storiesByWeek: Record<number, typeof stories> = {}
  for (let i = 1; i <= totalWeeks; i++) {
    storiesByWeek[i] = stories?.filter(s => s.planned_week === i) || []
  }

  // Calculate week status
  const getWeekStatus = (week: number) => {
    const weekStories = storiesByWeek[week] || []
    if (weekStories.length === 0) return 'empty'
    const allComplete = weekStories.every(s => s.status === 'complete')
    const anyBlocked = weekStories.some(s => s.status === 'blocked')
    const anyInProgress = weekStories.some(s => s.status === 'in_progress')

    if (allComplete) return 'complete'
    if (anyBlocked) return 'blocked'
    if (anyInProgress) return 'in_progress'
    return 'not_started'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Timeline</h1>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            Complete
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            In Progress
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            Blocked
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-600"></span>
            Not Started
          </span>
        </div>
      </div>

      {/* Week-by-week timeline */}
      <div className="space-y-4">
        {Array.from({ length: totalWeeks }, (_, i) => i + 1).map(week => {
          const weekStories = storiesByWeek[week] || []
          const weekStatus = getWeekStatus(week)
          const isCurrent = week === currentWeek
          const isPast = week < currentWeek

          const statusColors: Record<string, string> = {
            complete: 'border-green-500 bg-green-500/10',
            in_progress: 'border-blue-500 bg-blue-500/10',
            blocked: 'border-yellow-500 bg-yellow-500/10',
            not_started: 'border-gray-700 bg-gray-900',
            empty: 'border-gray-800 bg-gray-900/50',
          }

          return (
            <div
              key={week}
              className={`rounded-lg border-2 ${statusColors[weekStatus]} ${
                isCurrent ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-black' : ''
              }`}
            >
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-bold ${isCurrent ? 'text-purple-400' : 'text-white'}`}>
                      Week {week}
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 bg-purple-600 rounded text-xs font-medium">
                        Current
                      </span>
                    )}
                    {isPast && weekStatus === 'complete' && (
                      <span className="text-green-400 text-sm">✓ Completed</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-400">
                    {weekStories.length} {weekStories.length === 1 ? 'story' : 'stories'}
                  </span>
                </div>
              </div>

              {weekStories.length > 0 ? (
                <div className="p-4 space-y-3">
                  {weekStories.map(story => (
                    <StoryCard key={story.id} story={story} />
                  ))}
                </div>
              ) : (
                <div className="p-4 text-gray-500 text-sm">
                  No stories planned for this week
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Epics Summary */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Epics Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {epics?.map(epic => {
            const epicStories = stories?.filter(s => s.epic_id === epic.id) || []
            const completed = epicStories.filter(s => s.status === 'complete').length
            const total = epicStories.length
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0

            return (
              <div key={epic.id} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                <h3 className="font-semibold mb-2">{epic.title}</h3>
                <p className="text-sm text-gray-400 mb-3">{epic.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {completed}/{total} stories
                  </span>
                  <span className={progress === 100 ? 'text-green-400' : 'text-gray-400'}>
                    {progress}%
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-800 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-purple-600'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StoryCard({ story }: { story: { id: string; title: string; description: string | null; status: string | null; notes: string | null; epics: { title: string } | null } }) {
  return (
    <div className="flex items-start justify-between p-3 bg-gray-800/50 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium">{story.title}</span>
        </div>
        {story.description && (
          <p className="text-xs text-gray-400 mb-2">{story.description}</p>
        )}
        {story.notes && (
          <p className="text-xs text-yellow-400/80 italic">{story.notes}</p>
        )}
        {story.epics && (
          <span className="text-xs text-purple-400">{story.epics.title}</span>
        )}
      </div>
      <StatusBadge status={story.status || 'not_started'} />
    </div>
  )
}
