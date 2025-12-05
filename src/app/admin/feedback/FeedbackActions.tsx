'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function FeedbackActions({
  feedbackId,
  status,
  userEmail,
}: {
  feedbackId: string
  status: string
  userEmail: string
}) {
  const [showReply, setShowReply] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleReply = async () => {
    if (!replyContent.trim()) return

    setLoading(true)
    try {
      const { error } = await supabase.from('feedback').insert({
        author: userEmail,
        content: replyContent.trim(),
        type: 'comment',
        status: 'open',
        parent_id: feedbackId,
      })

      if (error) throw error

      setReplyContent('')
      setShowReply(false)
      router.refresh()
    } catch (err) {
      console.error('Failed to reply:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ status: newStatus })
        .eq('id', feedbackId)

      if (error) throw error
      router.refresh()
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowReply(!showReply)}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Reply
        </button>
        {status !== 'resolved' && (
          <>
            <span className="text-gray-600">•</span>
            <button
              onClick={() => handleStatusChange('acknowledged')}
              className="text-sm text-gray-400 hover:text-yellow-400 transition-colors"
            >
              Acknowledge
            </button>
            <span className="text-gray-600">•</span>
            <button
              onClick={() => handleStatusChange('resolved')}
              className="text-sm text-gray-400 hover:text-green-400 transition-colors"
            >
              Resolve
            </button>
          </>
        )}
        {status === 'resolved' && (
          <>
            <span className="text-gray-600">•</span>
            <button
              onClick={() => handleStatusChange('open')}
              className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
            >
              Reopen
            </button>
          </>
        )}
      </div>

      {showReply && (
        <div className="mt-3 space-y-2">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            rows={3}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none text-sm"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowReply(false)}
              className="px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReply}
              disabled={loading || !replyContent.trim()}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded text-sm transition-colors"
            >
              {loading ? 'Sending...' : 'Send Reply'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
