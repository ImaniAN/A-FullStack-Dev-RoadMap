import { supabase } from "$lib/supabaseClient.js";

export async function loadSideNavData() {
	const [categoriesResult, tasksResult, resourcesResult] = await Promise.all([
		supabase
			.from('roadmap_categories')
			.select('id, name, parent_id, level, description, created_at')
			.order('id', { ascending: true }),

		supabase
			.from('roadmap_tasks')
			.select(`
				id, task_name, category_id, task_type, difficulty_level,
				estimated_hours, prerequisites, status,
				roadmap_categories(id, name)
			`)
			.order('id', { ascending: true }),

		supabase
			.from('roadmap_resources')
			.select('id, task_id, resource_name, resource_url, resource_type, is_free, rating')
			.order('id', { ascending: true })
	]);

	const categories = categoriesResult.data ?? [];
	const tasks = tasksResult.data ?? [];
	const resources = resourcesResult.data ?? [];

	const categoryHierarchy = buildCategoryTree(categories);
	const tasksByCategory = groupTasksByCategory(tasks, resources);

	return {
		categoryHierarchy,
		topicsByCategory: tasksByCategory,
		totalCategories: categories.length,
		totalTopics: tasks.length
	};
}

function groupTasksByCategory(tasks, resources) {
	const tasksByCategory = {};

	for (const task of tasks) {
		if (!task.category_id) continue;

		if (!tasksByCategory[task.category_id]) {
			tasksByCategory[task.category_id] = [];
		}

		const taskResources = resources.filter(r => r.task_id === task.id);

		tasksByCategory[task.category_id].push({
			...task,
			name: task.task_name,
			resources: taskResources
		});
	}

	// Sort tasks by insertion order
	for (const categoryId in tasksByCategory) {
		tasksByCategory[categoryId].sort((a, b) => a.id - b.id);
	}

	return tasksByCategory;
}

function buildCategoryTree(categories) {
	const categoryMap = {};
	const rootCategories = [];

	// Create lookup map
	for (const cat of categories) {
		categoryMap[cat.id] = { ...cat, children: [] };
	}

	// Build tree structure
	for (const cat of categories) {
		if (cat.parent_id === null || cat.parent_id === undefined) {
			rootCategories.push(categoryMap[cat.id]);
		} else if (categoryMap[cat.parent_id]) {
			categoryMap[cat.parent_id].children.push(categoryMap[cat.id]);
		}
	}

	// Sort children by insertion order
	function sortChildren(category) {
		if (category.children?.length > 0) {
			category.children.sort((a, b) => a.id - b.id);
			category.children.forEach(sortChildren);
		}
	}

	rootCategories.forEach(sortChildren);
	return rootCategories;
}