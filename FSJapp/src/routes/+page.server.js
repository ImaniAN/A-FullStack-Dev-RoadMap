import { supabase } from "$lib/supabaseClient";

export async function load() {
  const { data } = await supabase.from("task_overview").select();
  return {
    task_overview: data ?? [],
  };
}