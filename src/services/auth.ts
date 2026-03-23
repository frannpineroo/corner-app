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