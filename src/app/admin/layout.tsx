import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogoutButton } from './LogoutButton'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: meta } = await supabase
    .from('project_meta')
    .select('*')
    .single()

  const statusColors: Record<string, string> = {
    on_track: 'text-green-400',
    at_risk: 'text-yellow-400',
    blocked: 'text-red-400',
    ahead: 'text-purple-400',
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin" className="text-xl font-bold hover:text-purple-400 transition-colors">
                B7W Phase 1 Development
              </Link>
              {meta && (
                <p className="text-sm text-gray-400 mt-1">
                  Week {meta.current_week} of {meta.total_weeks} &bull;{' '}
                  <span className={statusColors[meta.status || 'on_track']}>
                    {meta.status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">{user.email}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6">
            <NavLink href="/admin">Dashboard</NavLink>
            <NavLink href="/admin/timeline">Timeline</NavLink>
            <NavLink href="/admin/updates">Updates</NavLink>
            <NavLink href="/admin/changelog">Changelog</NavLink>
            <NavLink href="/admin/feedback">Feedback</NavLink>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="py-3 px-1 text-gray-400 hover:text-white border-b-2 border-transparent hover:border-purple-500 transition-colors"
    >
      {children}
    </Link>
  )
}
