import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      redirect('/admin')
    } else {
      redirect('/login')
    }
  } catch {
    // If Supabase fails to initialize, redirect to login
    redirect('/login')
  }
}
