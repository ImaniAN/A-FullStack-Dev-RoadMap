// src/lib/roadmapDb.js - Database functions for the roadmap
import { supabase } from './supabaseClient';

// ===== CATEGORIES =====
export async function getCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('level', { ascending: true })
        .order('order_index', { ascending: true });

    if (error) throw error;
    return data;
}

export async function getCategoryHierarchy() {
    const { data, error } = await supabase
        .from('categories')
        .select(`
      id,
      name,
      description,
      level,
      order_index,
      parent_id,
      children:categories!parent_id(
        id,
        name,
        description,
        level,
        order_index
      )
    `)
        .is('parent_id', null)
        .order('order_index', { ascending: true });

    if (error) throw error;
    return data;
}

// ===== TOPICS =====
// @ts-ignore
export async function getTopicsByCategory(categoryId) {
    const { data, error } = await supabase
        .from('topics')
        .select(`
      id,
      name,
      description,
      estimated_hours,
      status,
      order_index,
      url,
      category:categories(name, description)
    `)
        .eq('category_id', categoryId)
        .order('order_index', { ascending: true });

    if (error) throw error;
    return data;
}

export async function getAllTopicsWithCategories() {
    const { data, error } = await supabase
        .from('topics')
        .select(`
      id,
      name,
      description,
      estimated_hours,
      status,
      order_index,
      url,
      category:categories(
        id,
        name,
        level
      ),
      materials:learning_materials(
        id,
        title,
        type,
        url,
        description
      )
    `)
        .order('category_id', { ascending: true })
        .order('order_index', { ascending: true });

    if (error) throw error;
    return data;
}

// ===== LEARNING MATERIALS =====
// @ts-ignore
export async function getMaterialsByTopic(topicId) {
    const { data, error } = await supabase
        .from('learning_materials')
        .select('*')
        .eq('topic_id', topicId)
        .order('order_index', { ascending: true });

    if (error) throw error;
    return data;
}

// ===== USER PROGRESS =====
// @ts-ignore
export async function getUserProgress(userId) {
    const { data, error } = await supabase
        .from('user_progress')
        .select(`
      id,
      status,
      progress_percentage,
      notes,
      updated_at,
      topic:topics(
        id,
        name,
        estimated_hours,
        category:categories(name)
      )
    `)
        .eq('user_id', userId);

    if (error) throw error;
    return data;
}

// @ts-ignore
export async function updateTopicProgress(userId, topicId, status, progressPercentage = 0, notes = null) {
    const { data, error } = await supabase
        .from('user_progress')
        .upsert({
            user_id: userId,
            topic_id: topicId,
            status,
            progress_percentage: progressPercentage,
            notes,
            updated_at: new Date().toISOString()
        })
        .select();

    if (error) throw error;
    return data;
}

// ===== DASHBOARD STATS =====
export async function getDashboardStats(userId = null) {
    try {
        // Get total topics count
        const { count: totalTopics } = await supabase
            .from('topics')
            .select('*', { count: 'exact', head: true });

        // Get total categories count
        const { count: totalCategories } = await supabase
            .from('categories')
            .select('*', { count: 'exact', head: true });

        // Get total estimated hours
        const { data: hoursData } = await supabase
            .from('topics')
            .select('estimated_hours')
            .not('estimated_hours', 'is', null);

        const totalHours = hoursData?.reduce((sum, topic) => sum + (topic.estimated_hours || 0), 0) || 0;

        let userStats = null;
        if (userId) {
            // Get user progress stats
            const { count: completedTopics } = await supabase
                .from('user_progress')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('status', 'completed');

            const { count: inProgressTopics } = await supabase
                .from('user_progress')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId)
                .eq('status', 'in_progress');

            userStats = {
                completed: completedTopics || 0,
                inProgress: inProgressTopics || 0,
                notStarted: (totalTopics || 0) - (completedTopics || 0) - (inProgressTopics || 0)
            };
        }

        return {
            total: {
                topics: totalTopics || 0,
                categories: totalCategories || 0,
                estimatedHours: totalHours
            },
            user: userStats
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
    }
}

// ===== LEARNING PATH =====
// @ts-ignore
export async function getRecommendedNextTopics(userId, limit = 5) {
    // Get topics user hasn't started yet, ordered by category level and topic order
    const { data, error } = await supabase
        .from('topics')
        .select(`
      id,
      name,
      description,
      estimated_hours,
      category:categories(name, level)
    `)
        .not('id', 'in',
            supabase
                .from('user_progress')
                .select('topic_id')
                .eq('user_id', userId)
        )
        .order('category_id', { ascending: true })
        .order('order_index', { ascending: true })
        .limit(limit);

    if (error) throw error;
    return data;
}