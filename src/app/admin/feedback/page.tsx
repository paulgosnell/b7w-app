import { createClient } from '@/lib/supabase/server'
import { FeedbackTypeBadge } from '@/components/TypeBadge'
import { StatusBadge } from '@/components/StatusBadge'
import { FeedbackForm } from './FeedbackForm'
import { FeedbackActions } from './FeedbackActions'

export default async function FeedbackPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: feedback } = await supabase
    .from('feedback')
    .select('*')
    .is('parent_id', null) // Only top-level feedback
    .order('created_at', { ascending: false })

  const { data: replies } = await supabase
    .from('feedback')
    .select('*')
    .not('parent_id', 'is', null)
    .order('created_at', { ascending: true })

  // Group replies by parent
  const repliesByParent: Record<string, typeof replies> = {}
  replies?.forEach(reply => {
    if (reply.parent_id) {
      if (!repliesByParent[reply.parent_id]) {
        repliesByParent[reply.parent_id] = []
      }
      repliesByParent[reply.parent_id]!.push(reply)
    }
  })

  const openCount = feedback?.filter(f => f.status === 'open').length || 0
  const resolvedCount = feedback?.filter(f => f.status === 'resolved').length || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Feedback</h1>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-blue-400">{openCount} open</span>
          <span className="text-green-400">{resolvedCount} resolved</span>
        </div>
      </div>

      {/* New Feedback Form */}
      <FeedbackForm userEmail={user?.email || 'anonymous'} />

      {/* Feedback List */}
      {feedback && feedback.length > 0 ? (
        <div className="space-y-4">
          {feedback.map(item => (
            <div
              key={item.id}
              className={`bg-gray-900 rounded-lg border ${
                item.status === 'resolved' ? 'border-gray-800 opacity-75' : 'border-gray-700'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-purple-400">{item.author}</span>
                    <FeedbackTypeBadge type={item.type || 'comment'} />
                    <StatusBadge status={item.status || 'open'} />
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(item.created_at!).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-gray-300 whitespace-pre-wrap">{item.content}</p>

                {/* Images */}
                {item.image_urls && item.image_urls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.image_urls.map((url: string, idx: number) => (
                      <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={url}
                          alt={`Attachment ${idx + 1}`}
                          className="max-w-xs max-h-48 object-cover rounded-lg border border-gray-700 hover:border-purple-500 transition-colors"
                        />
                      </a>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <FeedbackActions
                  feedbackId={item.id}
                  status={item.status || 'open'}
                  userEmail={user?.email || 'anonymous'}
                />
              </div>

              {/* Replies */}
              {repliesByParent[item.id] && repliesByParent[item.id]!.length > 0 && (
                <div className="border-t border-gray-800 bg-gray-800/30">
                  {repliesByParent[item.id]!.map(reply => (
                    <div key={reply.id} className="p-4 border-b border-gray-800 last:border-b-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-purple-400">{reply.author}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(reply.created_at!).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm whitespace-pre-wrap">{reply.content}</p>
                      {/* Reply Images */}
                      {reply.image_urls && reply.image_urls.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {reply.image_urls.map((url: string, idx: number) => (
                            <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                              <img
                                src={url}
                                alt={`Attachment ${idx + 1}`}
                                className="max-w-xs max-h-32 object-cover rounded-lg border border-gray-700 hover:border-purple-500 transition-colors"
                              />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-2xl">💬</span>
          </div>
          <p className="text-gray-400">No feedback yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Use the form above to leave comments, questions, or requests
          </p>
        </div>
      )}
    </div>
  )
}
