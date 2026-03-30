import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export const login = async (
    email: string,
    password: string
): Promise<User | null> => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (error) {
        console.error(error)
        return null
    }

    return data.user
}

export const logout = async () => {
    const { data } = await supabase.auth.getSession()
    if (data.session?.user?.id) {
        localStorage.removeItem(`profile_${data.session.user.id}`)
    }
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}