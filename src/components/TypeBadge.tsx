type ChangelogType = 'feature' | 'fix' | 'improvement'
type FeedbackType = 'comment' | 'question' | 'bug' | 'request'

const changelogConfig: Record<ChangelogType, { bg: string; text: string; label: string }> = {
  feature: { bg: 'bg-purple-900', text: 'text-purple-300', label: 'Feature' },
  fix: { bg: 'bg-red-900', text: 'text-red-300', label: 'Fix' },
  improvement: { bg: 'bg-blue-900', text: 'text-blue-300', label: 'Improvement' },
}

const feedbackConfig: Record<FeedbackType, { bg: string; text: string; label: string }> = {
  comment: { bg: 'bg-gray-700', text: 'text-gray-300', label: 'Comment' },
  question: { bg: 'bg-blue-900', text: 'text-blue-300', label: 'Question' },
  bug: { bg: 'bg-red-900', text: 'text-red-300', label: 'Bug' },
  request: { bg: 'bg-purple-900', text: 'text-purple-300', label: 'Request' },
}

export function ChangelogTypeBadge({ type }: { type: string }) {
  const config = changelogConfig[type as ChangelogType] || changelogConfig.feature

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}

export function FeedbackTypeBadge({ type }: { type: string }) {
  const config = feedbackConfig[type as FeedbackType] || feedbackConfig.comment

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}
