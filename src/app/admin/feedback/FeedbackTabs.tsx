'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface FeedbackTabsProps {
  counts: {
    all: number
    open: number
    acknowledged: number
    resolved: number
  }
}

export function FeedbackTabs({ counts }: FeedbackTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentFilter = searchParams.get('status') || 'open'

  const tabs = [
    { id: 'open', label: 'Open', count: counts.open, color: 'blue' },
    { id: 'acknowledged', label: 'Acknowledged', count: counts.acknowledged, color: 'yellow' },
    { id: 'resolved', label: 'Resolved', count: counts.resolved, color: 'green' },
    { id: 'all', label: 'All', count: counts.all, color: 'gray' },
  ]

  const handleTabClick = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (tabId === 'all') {
      params.delete('status')
    } else {
      params.set('status', tabId)
    }
    router.push(`/admin/feedback?${params.toString()}`)
  }

  return (
    <div className="flex gap-1 bg-gray-800 p-1 rounded-lg">
      {tabs.map(tab => {
        const isActive = currentFilter === tab.id || (currentFilter === 'open' && tab.id === 'open') || (!searchParams.get('status') && tab.id === 'open')
        const activeCheck = tab.id === 'all'
          ? !searchParams.get('status') || searchParams.get('status') === 'all'
          : searchParams.get('status') === tab.id || (!searchParams.get('status') && tab.id === 'open')

        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              activeCheck
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded text-xs ${
              activeCheck
                ? tab.color === 'blue' ? 'bg-blue-500/20 text-blue-400'
                  : tab.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400'
                  : tab.color === 'green' ? 'bg-green-500/20 text-green-400'
                  : 'bg-gray-600 text-gray-300'
                : 'bg-gray-700 text-gray-500'
            }`}>
              {tab.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
