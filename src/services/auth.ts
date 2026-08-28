import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export class LoginError extends Error {
    kind: "config" | "network" | "credentials";

    constructor(
        message: string,
        kind: "config" | "network" | "credentials"
    ) {
        super(message);
        this.name = "LoginError";
        this.kind = kind;
    }
}

export const login = async (
    email: string,
    password: string
): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (error) {
        const text = `${error.name} ${error.message} ${error.status ?? ""}`.toLowerCase();
        if (
            text.includes("fetch") ||
            text.includes("network") ||
            text.includes("retryable")
        ) {
            throw new LoginError("No hay conexión con el servidor", "network");
        }
        throw new LoginError("Email o contraseña incorrectos", "credentials");
    }

    if (!data.user) {
        throw new LoginError("Email o contraseña incorrectos", "credentials");
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
