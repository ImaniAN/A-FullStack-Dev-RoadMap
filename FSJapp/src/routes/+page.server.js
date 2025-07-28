import { supabase } from "$lib/supabaseClient";
import { loadSideNavData } from "../components/MainBody/SideNav/+sideNav.server.js";

export async function load() {
  // Load existing roadmap tasks
  const { data: roadmapTasks } = await supabase
    .from("roadmap_tasks")
    .select(`
      *,
      roadmap_categories(name)
    `)
    .order('created_at', { ascending: true });

  // Load SideNav data
  const sideNavData = await loadSideNavData();

  return {
    roadmap_tasks: roadmapTasks || [],
    sideNavData
  };
}