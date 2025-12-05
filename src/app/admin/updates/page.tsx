import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function UpdatesPage() {
  const supabase = await createClient()

  const { data: updates } = await supabase
    .from('weekly_updates')
    .select('*')
    .order('week_number', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Weekly Updates</h1>
        <span className="text-sm text-gray-400">
          {updates?.length || 0} updates posted
        </span>
      </div>

      {updates && updates.length > 0 ? (
        <div className="space-y-4">
          {updates.map((update, index) => (
            <div
              key={update.id}
              className={`bg-gray-900 rounded-lg border border-gray-800 overflow-hidden ${
                index === 0 ? 'ring-2 ring-purple-500/50' : ''
              }`}
            >
              <div className="p-4 border-b border-gray-800 bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold">Week {update.week_number}</span>
                    {index === 0 && (
                      <span className="px-2 py-0.5 bg-purple-600 rounded text-xs font-medium">
                        Latest
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-400">{update.date}</span>
                </div>
                <p className="mt-2 text-white">{update.summary}</p>
              </div>

              <div className="p-4 space-y-4">
                {/* Completed */}
                {update.completed && update.completed.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-green-400 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      Completed
                    </h3>
                    <ul className="space-y-1">
                      {update.completed.map((item, i) => (
                        <li key={i} className="text-sm text-gray-300 pl-4">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* In Progress */}
                {update.in_progress && update.in_progress.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-blue-400 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      In Progress
                    </h3>
                    <ul className="space-y-1">
                      {update.in_progress.map((item, i) => (
                        <li key={i} className="text-sm text-gray-300 pl-4">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Blockers */}
                {update.blockers && update.blockers.length > 0 && (
                  <div className="p-3 bg-yellow-900/20 rounded-lg border border-yellow-800">
                    <h3 className="text-sm font-medium text-yellow-400 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                      Blockers
                    </h3>
                    <ul className="space-y-1">
                      {update.blockers.map((item, i) => (
                        <li key={i} className="text-sm text-yellow-300 pl-4">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Next Week */}
                {update.next_week && update.next_week.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-purple-400 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      Next Week
                    </h3>
                    <ul className="space-y-1">
                      {update.next_week.map((item, i) => (
                        <li key={i} className="text-sm text-gray-300 pl-4">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Notes */}
                {update.notes && (
                  <div className="pt-4 border-t border-gray-800">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Notes</h3>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{update.notes}</p>
                  </div>
                )}

                {/* Loom Video */}
                {update.loom_url && (
                  <div className="pt-4 border-t border-gray-800">
                    <a
                      href={update.loom_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                      </svg>
                      Watch Video Update
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 text-center">
          <p className="text-gray-400">No weekly updates yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Updates will appear here every Friday
          </p>
        </div>
      )}
    </div>
  )
}
