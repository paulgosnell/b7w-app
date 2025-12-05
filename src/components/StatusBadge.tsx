type Status = 'not_started' | 'in_progress' | 'complete' | 'blocked' | 'on_track' | 'at_risk' | 'ahead' | 'open' | 'acknowledged' | 'resolved'

const statusConfig: Record<Status, { bg: string; text: string; label: string }> = {
  not_started: { bg: 'bg-gray-700', text: 'text-gray-300', label: 'Not Started' },
  in_progress: { bg: 'bg-blue-900', text: 'text-blue-300', label: 'In Progress' },
  complete: { bg: 'bg-green-900', text: 'text-green-300', label: 'Complete' },
  blocked: { bg: 'bg-yellow-900', text: 'text-yellow-300', label: 'Blocked' },
  on_track: { bg: 'bg-green-900', text: 'text-green-300', label: 'On Track' },
  at_risk: { bg: 'bg-yellow-900', text: 'text-yellow-300', label: 'At Risk' },
  ahead: { bg: 'bg-purple-900', text: 'text-purple-300', label: 'Ahead' },
  open: { bg: 'bg-blue-900', text: 'text-blue-300', label: 'Open' },
  acknowledged: { bg: 'bg-yellow-900', text: 'text-yellow-300', label: 'Acknowledged' },
  resolved: { bg: 'bg-green-900', text: 'text-green-300', label: 'Resolved' },
}

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as Status] || statusConfig.not_started

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}
