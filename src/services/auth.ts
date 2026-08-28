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

function stripAccents(value: string) {
    return value.normalize("NFD").replace(/\p{M}/gu, "");
}

function normalizeUsername(raw: string) {
    return stripAccents(raw).trim().toLowerCase().replace(/\s+/g, "");
}

const USER_EMAILS: Record<string, string[]> = {
    admin: ["admin@corner.com"],
    arte: ["arte@corner.com"],
    basquet: ["basquet@corner.com"],
    basket: ["basquet@corner.com"],
    futbol1: ["futbol1@corner.com"],
    futbol2: ["futbol2@corner.com"],
    voley: ["voley@corner.com", "volley@corner.com"],
    volley: ["volley@corner.com", "voley@corner.com"],
};

export function emailsForLogin(input: string): string[] {
    const trimmed = input.trim();
    if (trimmed.includes("@")) return [trimmed.toLowerCase()];

    const key = normalizeUsername(trimmed);
    if (!key) return [];
    return USER_EMAILS[key] ?? [`${key}@corner.com`];
}

export const login = async (
    usuario: string,
    password: string
): Promise<User> => {
    const emails = emailsForLogin(usuario);
    if (emails.length === 0) {
        throw new LoginError("Usuario o contraseña incorrectos", "credentials");
    }

    let lastWasNetwork = false;

    for (const email of emails) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (!error && data.user) return data.user;

        if (error) {
            const text = `${error.name} ${error.message} ${error.status ?? ""}`.toLowerCase();
            if (
                text.includes("fetch") ||
                text.includes("network") ||
                text.includes("retryable")
            ) {
                lastWasNetwork = true;
                continue;
            }
        }
    }

    if (lastWasNetwork) {
        throw new LoginError("No hay conexión con el servidor", "network");
    }
    throw new LoginError("Usuario o contraseña incorrectos", "credentials");
}

export const logout = async () => {
    const { data } = await supabase.auth.getSession()
    if (data.session?.user?.id) {
        localStorage.removeItem(`profile_${data.session.user.id}`)
    }
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}
