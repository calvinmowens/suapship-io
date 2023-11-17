import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_API_URL;
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

export const supaClient = createClient<Database>(supabaseUrl, supabaseKey);

supaClient.from("user_profiles").select("*").then(({ data }) => {})

// Authenticate to Supabase for User related data
// supaClient.auth.signInWithPassword();

// We can call functions to modify the DB
// supaClient.from("my_table").delete;

// We can also call Postgres functions like this, client auth state dependence
// supaClient.rpc("my_function", { data: "foo"});

// Edge functions can be called like this
// supaClient.functions.invoke("edge_function")

// Subscriptioons for realtime data, client auth state dependence
// supaClient.channel("my_channel").on
