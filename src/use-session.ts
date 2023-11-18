import { RealtimeChannel, Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supaClient } from "./supa-client";

export interface UserProfile {
    username: string;
    avatarUrl?: string;
}

export interface SupashipUserInfo {
    session: Session | null;
    profile: UserProfile | null;
}

export function useSession(): SupashipUserInfo {
    const [userInfo, setUserInfo] = useState<SupashipUserInfo>({
        profile: null,
        session: null,
    });
    const [channel, setChannel] = useState<RealtimeChannel | null>(null);

    // this block will set the session based on Auth, and update it if Auth changes
    useEffect(() => {
        supaClient.auth.getSession().then(({ data: { session } }) => {
            setUserInfo({ ...userInfo, session });
            supaClient.auth.onAuthStateChange((_event, session) => {
                setUserInfo({ ...userInfo, session });
            });
        });
    }, []);


    useEffect(() => {
        if (userInfo.session?.user && !userInfo.profile) {
            listenToUserProfileChanges(userInfo.session.user.id).then(
                (newChannel) => {
                    if (channel) {
                        channel.unsubscribe();
                    }
                    setChannel(newChannel);
                }
            )
        } else if (!userInfo.session?.user) {
            channel?.unsubscribe();
            setChannel(null);
        }
    }, [userInfo.session]);

    async function listenToUserProfileChanges(userId: string) {
        // find if user exists
        const { data } = await supaClient
            .from("user_profiles")
            .select("*")
            .filter("user_id", "eq", userId);
        // set User Info variable (above)
        if (data?.[0]) {
            setUserInfo({ ...userInfo, profile: data?.[0] });
        }
        // create channel from Supaclient to listen to changes
        return supaClient
            .channel(`public:user_profiles`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "user_profiles",
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    setUserInfo({ ...userInfo, profile: payload.new as UserProfile });
                }
            ).subscribe();
    }

    return userInfo;
}