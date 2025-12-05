import { createClient } from '@/lib/supabase/server'
import { ChangelogTypeBadge } from '@/components/TypeBadge'

export default async function ChangelogPage() {
  const supabase = await createClient()

  const { data: changelog } = await supabase
    .from('changelog')
    .select('*, stories(title)')
    .order('date', { ascending: false })

  // Group by month
  const groupedByMonth: Record<string, typeof changelog> = {}
  changelog?.forEach(item => {
    const date = new Date(item.date)
    const monthKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    if (!groupedByMonth[monthKey]) {
      groupedByMonth[monthKey] = []
    }
    groupedByMonth[monthKey]!.push(item)
  })

  const stats = {
    features: changelog?.filter(c => c.type === 'feature').length || 0,
    fixes: changelog?.filter(c => c.type === 'fix').length || 0,
    improvements: changelog?.filter(c => c.type === 'improvement').length || 0,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Changelog</h1>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-purple-400">{stats.features} features</span>
          <span className="text-red-400">{stats.fixes} fixes</span>
          <span className="text-blue-400">{stats.improvements} improvements</span>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2">
        <FilterPill active>All</FilterPill>
        <FilterPill>Features</FilterPill>
        <FilterPill>Fixes</FilterPill>
        <FilterPill>Improvements</FilterPill>
      </div>

      {changelog && changelog.length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedByMonth).map(([month, items]) => (
            <div key={month}>
              <h2 className="text-lg font-semibold text-gray-400 mb-4">{month}</h2>
              <div className="space-y-4">
                {items?.map(item => (
                  <div
                    key={item.id}
                    className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <TypeIcon type={item.type} />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{item.title}</h3>
                            <ChangelogTypeBadge type={item.type} />
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-400">{item.description}</p>
                          )}
                          {item.stories && (
                            <p className="text-xs text-purple-400 mt-2">
                              Related: {item.stories.title}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap">{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-2xl">📦</span>
          </div>
          <p className="text-gray-400">Nothing shipped yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Completed features, fixes, and improvements will appear here
          </p>
        </div>
      )}
    </div>
  )
}

function FilterPill({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button
      className={`px-3 py-1 rounded-full text-sm transition-colors ${
        active
          ? 'bg-purple-600 text-white'
          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {children}
    </button>
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
    <span className={`w-8 h-8 ${config.bg} rounded-lg flex items-center justify-center text-sm flex-shrink-0`}>
      {config.icon}
    </span>
  )
}
