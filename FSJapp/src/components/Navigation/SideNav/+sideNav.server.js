import { supabase } from "$lib/supabaseClient.js";
import { DIFFICULTY_SYSTEM, getTierName } from "../../UI/InfoCard/utils/difficultySystem.js";

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
				estimated_hours, prerequisites, status, created_at,
				roadmap_categories(id, name)
			`)
			.order('id', { ascending: true }),

		supabase
			.from('roadmap_resources')
			.select('id, task_id, resource_name, resource_url, resource_type, is_free, rating, created_at')
			.order('rating', { ascending: false })
	]);

	const categories = categoriesResult.data ?? [];
	const tasks = tasksResult.data ?? [];
	// Count total resources under each category (nodes below)
	const resources = resourcesResult.data ?? [];
	categories.forEach(category => {
		category.resourcesCount = resources.filter(r => {
			const task = tasks.find(t => t.id === r.task_id);
			return task && task.category_id === category.id;
		}).length;
	});

	const categoryHierarchy = buildCategoryTree(categories);
	const tasksByCategory = groupTasksByCategory(tasks, resources);
	const categoryStats = calculateCategoryStats(categories, tasks, resources);

	return {
		categoryHierarchy,
		topicsByCategory: tasksByCategory,
		totalCategories: categories.length,
		totalTopics: tasks.length,
		categoryStats,
		allResources: resources,
		recentlyAdded: getRecentlyAdded(tasks, categories),
		difficultyDistribution: getTierDistribution(tasks),
		completionStats: getCompletionStats(tasks),
		resourceStats: getResourceStats(resources),
		learningPathStats: getLearningPathStats(categories, tasks)
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

// Calculate comprehensive category statistics
function calculateCategoryStats(categories, tasks, resources) {
	const stats = {};

	for (const category of categories) {
		const categoryTasks = tasks.filter(task => task.category_id === category.id);
		const categoryResources = resources.filter(resource =>
			categoryTasks.some(task => task.id === resource.task_id)
		);

		stats[category.id] = {
			taskCount: categoryTasks.length,
			resourceCount: categoryResources.length,
			completedTasks: categoryTasks.filter(task => task.completed).length,
			averageDifficulty: categoryTasks.length > 0
				? categoryTasks.reduce((sum, task) => sum + (task.difficulty_level || 1), 0) / categoryTasks.length
				: 0,
			difficultyBreakdown: getTierBreakdown(categoryTasks),
			lastUpdated: Math.max(...categoryTasks.map(task => new Date(task.updated_at || task.created_at).getTime()))
		};
	}

	return stats;
}

// Get recently added or updated items
function getRecentlyAdded(tasks, categories) {
	const allItems = [
		...tasks.map(task => ({ ...task, type: 'task' })),
		...categories.map(cat => ({ ...cat, type: 'category' }))
	];

	return allItems
		.sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
		.slice(0, 10);
}

// Get tier distribution across all tasks
function getTierDistribution(tasks) {
	const distribution = {};

	// Initialize distribution based on centralized difficulty system
	Object.entries(DIFFICULTY_SYSTEM).forEach(([tier, config]) => {
		distribution[config.level] = 0;
	});

	tasks.forEach(task => {
		const level = task.difficulty_level || 1;
		if (distribution[level] !== undefined) {
			distribution[level]++;
		}
	});

	return distribution;
}

// Get tier breakdown for a specific set of tasks
function getTierBreakdown(tasks) {
	const breakdown = {};

	// Initialize breakdown based on centralized difficulty system
	Object.entries(DIFFICULTY_SYSTEM).forEach(([tier, config]) => {
		breakdown[tier] = 0;
	});

	tasks.forEach(task => {
		const tier = getTierName(task.difficulty_level || 1);
		if (breakdown[tier] !== undefined) {
			breakdown[tier]++;
		}
	});

	return breakdown;
}

// Calculate completion statistics
function getCompletionStats(tasks) {
	const total = tasks.length;
	const completed = tasks.filter(task => task.completed).length;
	const inProgress = tasks.filter(task => task.status === 'in_progress').length;
	const notStarted = total - completed - inProgress;

	// Calculate completion rate and clamp between 1-99%
	let completionRate = 0;
	if (total > 0) {
		completionRate = Math.round((completed / total) * 100);
		// Ensure completion rate is between 1-99%
		if (completionRate === 0 && completed > 0) completionRate = 1;
		if (completionRate === 100) completionRate = 99;
		if (completionRate === 0 && total > 0) completionRate = 1;
	}

	return {
		total,
		completed,
		inProgress,
		notStarted,
		completionRate
	};
}

// Calculate resource statistics
function getResourceStats(resources) {
	const total = resources.length;
	const freeResources = resources.filter(resource => resource.is_free).length;
	const paidResources = total - freeResources;
	const ratedResources = resources.filter(resource => resource.rating && resource.rating > 0).length;
	const averageRating = ratedResources > 0
		? resources.reduce((sum, resource) => sum + (resource.rating || 0), 0) / ratedResources
		: 0;

	// Resource type breakdown
	const typeBreakdown = {};
	resources.forEach(resource => {
		const type = resource.resource_type || 'Other';
		typeBreakdown[type] = (typeBreakdown[type] || 0) + 1;
	});

	return {
		total,
		freeResources,
		paidResources,
		freePercentage: total > 0 ? Math.round((freeResources / total) * 100) : 0,
		ratedResources,
		averageRating: Math.round(averageRating * 10) / 10,
		typeBreakdown,
		topRatedResources: resources
			.filter(r => r.rating && r.rating >= 4)
			.sort((a, b) => (b.rating || 0) - (a.rating || 0))
			.slice(0, 5)
	};
}

// Calculate learning path statistics
function getLearningPathStats(categories, tasks) {
	const pathLengths = [];
	const leafCategories = categories.filter(cat => !cat.children || cat.children.length === 0);

	// Calculate average path depth
	leafCategories.forEach(leafCat => {
		let depth = 0;
		let currentCat = leafCat;
		while (currentCat && currentCat.parent_id) {
			depth++;
			currentCat = categories.find(c => c.id === currentCat.parent_id);
		}
		pathLengths.push(depth);
	});

	const averagePathDepth = pathLengths.length > 0
		? pathLengths.reduce((sum, depth) => sum + depth, 0) / pathLengths.length
		: 0;

	// Calculate task distribution by category level
	const tasksByLevel = {};
	categories.forEach(category => {
		const level = category.level || 0;
		const categoryTasks = tasks.filter(task => task.category_id === category.id);
		tasksByLevel[level] = (tasksByLevel[level] || 0) + categoryTasks.length;
	});

	// Estimate learning time
	const totalEstimatedHours = tasks.reduce((sum, task) => sum + (task.estimated_hours || 0), 0);
	const averageTaskHours = tasks.length > 0
		? totalEstimatedHours / tasks.length
		: 0;

	return {
		totalPaths: leafCategories.length,
		averagePathDepth: Math.round(averagePathDepth * 10) / 10,
		maxDepth: Math.max(...pathLengths, 0),
		minDepth: Math.min(...pathLengths, 0),
		tasksByLevel,
		totalEstimatedHours,
		averageTaskHours: Math.round(averageTaskHours * 10) / 10,
		estimatedWeeks: Math.round(totalEstimatedHours / 20), // Assuming 20 hours per week
		prerequisites: tasks.filter(task => task.prerequisites && task.prerequisites.trim().length > 0).length
	};
}