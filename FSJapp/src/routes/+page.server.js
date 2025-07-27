import { supabase } from "$lib/supabaseClient";

export async function load() {
  const { data } = await supabase
    .from("roadmap_tasks")
    .select(`
      *,
      roadmap_categories(name)
    `)
    .order('created_at', { ascending: true });

  return {
    roadmap_tasks: data ?? [],
  };
}