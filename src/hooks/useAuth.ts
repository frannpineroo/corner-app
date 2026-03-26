import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { Tables } from "../types/supabase";

type Profile = Tables<"profiles">;

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId: string) => {
        const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();
        setProfile(data ?? null);
    }

    useEffect(() => {
        const init = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
            if (data.user) await fetchProfile(data.user.id);
            setLoading(false);
        }

        init();

        const { data: listener } = supabase.auth.onAuthStateChange(
            async (_, session) => {
                setUser(session?.user ?? null)
                if (session?.user) await fetchProfile(session.user.id);
                else {
                    setProfile(null);
                    setLoading(false);
                }
            }
        )

        return () => listener.subscription.unsubscribe();
    }, [])

    const isAdmin = profile?.rol === "admin";
    const isProfesor = profile?.rol === "profesor";

    return { user, profile, loading, isAdmin, isProfesor };
}