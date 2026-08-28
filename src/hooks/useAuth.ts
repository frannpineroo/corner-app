import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { Tables } from "../types/supabase";

type Profile = Tables<"profiles">

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId: string) => {
        const cached = localStorage.getItem(`profile_${userId}`)
        if (cached) {
            try {
                setProfile(JSON.parse(cached) as Profile)
                return
            } catch {
                localStorage.removeItem(`profile_${userId}`)
            }
        }

        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .maybeSingle()

        if (error) {
            console.error(error)
            setProfile(null)
            return
        }

        if (data) {
            localStorage.setItem(`profile_${userId}`, JSON.stringify(data))
            setProfile(data)
        } else {
            setProfile(null)
        }
    }

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
            const sessionUser = session?.user ?? null
            setUser(sessionUser)
            if (sessionUser) {
                const needsProfile = event === "SIGNED_IN" || event === "INITIAL_SESSION"
                if (needsProfile) {
                    setLoading(true)
                    await fetchProfile(sessionUser.id)
                }
            } else {
                setProfile(null)
            }
            setLoading(false)
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    const isAdmin = profile?.rol === "admin"
    const isProfesor = profile?.rol === "profesor"

    return { user, profile, loading, isAdmin, isProfesor };
};
