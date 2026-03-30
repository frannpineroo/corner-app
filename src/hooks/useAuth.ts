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
        const { data } = await Promise.race([
            supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .single(),
            new Promise<{ data: null }>((resolve) =>
                setTimeout(() => resolve({ data: null }), 1000)
            )
        ])
        setProfile((data as Profile) ?? null)
    }

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange(async (_, session) => {
            const sessionUser = session?.user ?? null
            setUser(sessionUser)
            if (sessionUser) {
                await fetchProfile(sessionUser.id)
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