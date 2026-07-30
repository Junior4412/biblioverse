import { createClient, type User as SupabaseUser } from '@supabase/supabase-js'
import type { User } from '../shared/types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function mapAuthUser(user: SupabaseUser): User {
  const metadata = user.user_metadata ?? {}
  return {
    id: user.id,
    name: metadata.name ?? metadata.full_name ?? 'Leitor',
    username: metadata.username ?? `leitor_${user.id.slice(0, 8)}`,
    email: user.email ?? '',
    avatar: metadata.avatar_url,
    bio: metadata.bio,
    profession: metadata.profession,
    city: metadata.city,
    booksRead: 0,
    followers: 0,
    following: 0,
    createdAt: user.created_at,
  }
}
