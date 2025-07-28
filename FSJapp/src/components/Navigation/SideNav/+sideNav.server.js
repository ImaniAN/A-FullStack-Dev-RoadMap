import { supabase } from "$lib/supabaseClient.js";

/**
 * @typedef {Object} Category
 * @property {number} id
 * @property {string} name
 * @property {number|null} parent_id
 * @property {number} level
 * @property {string|null} description
 * @property {string} created_at
 * @property {Category[]} children
 */

/**
 * @typedef {Object} Task
 * @property {number} id
 * @property {string} task_name
 * @property {number} category_id
 * @property {string} task_type
 * @property {string} difficulty_level
 * @property {number|null} estimated_hours
 * @property {string|null} prerequisites
 * @property {string} status
 * @property {string} name
 * @property {Resource[]} resources
 */

/**
 * @typedef {Object} Resource
 * @property {number} id
 * @property {number} task_id
 * @property {string} resource_name
 * @property {string|null} resource_url
 * @property {string} resource_type
 * @property {boolean} is_free
 * @property {number|null} rating
 */

export async function loadSideNavData() {
	// Get all roadmap categories with their hierarchy
	const { data: categories } = await supabase
		.from('roadmap_categories')
		.select(`
            id,
            name,
            parent_id,
            level,
            description,
            created_at
        `)
		.order('id', { ascending: true }); // Order by insertion order (rowid)

	// Get all roadmap tasks with their category relationships
	const { data: tasks } = await supabase
		.from('roadmap_tasks')
		.select(`
            id,
            task_name,
            category_id,
            task_type,
            difficulty_level,
            estimated_hours,
            prerequisites,
            status,
            roadmap_categories(
                id,
                name
            )
        `)
		.order('id', { ascending: true }); // Order by insertion order (rowid)

	// Get resources for tasks
	const { data: resources } = await supabase
		.from('roadmap_resources')
		.select(`
            id,
            task_id,
            resource_name,
            resource_url,
            resource_type,
            is_free,
            rating
        `)
		.order('id', { ascending: true }); // Order by insertion order (rowid)

	// Build hierarchical structure
	const categoryHierarchy = buildCategoryTree(categories ?? []);

	// Group tasks by category and enhance with resources
	const tasksByCategory = (tasks ?? []).reduce((acc, task) => {
		const categoryId = task.category_id;
		if (categoryId) {
			if (!acc[categoryId]) {
				acc[categoryId] = [];
			}

			// Add resources to task
			const taskResources = (resources ?? []).filter(r => r.task_id === task.id);

			acc[categoryId].push({
				...task,
				name: task.task_name,
				resources: taskResources
			});
		}
		return acc;
	}, /** @type {Record<number, Task[]>} */({}));

	// Sort tasks within each category by their insertion order (id)
	Object.keys(tasksByCategory).forEach(categoryId => {
		tasksByCategory[parseInt(categoryId)].sort((/** @type {Task} */ a, /** @type {Task} */ b) => a.id - b.id);
	});

	return {
		categoryHierarchy,
		topicsByCategory: tasksByCategory,
		totalCategories: (categories ?? []).length,
		totalTopics: (tasks ?? []).length
	};
}

/**
 * @param {any[]} categories
 * @returns {Category[]}
 */
function buildCategoryTree(categories) {
	/** @type {Record<number, Category>} */
	const categoryMap = {};
	/** @type {Category[]} */
	const rootCategories = [];

	// Create a map for quick lookup
	categories.forEach(cat => {
		categoryMap[cat.id] = { ...cat, children: [] };
	});

	// Build the tree structure
	categories.forEach(cat => {
		if (cat.parent_id === null || cat.parent_id === undefined) {
			rootCategories.push(categoryMap[cat.id]);
		} else if (categoryMap[cat.parent_id]) {
			categoryMap[cat.parent_id].children.push(categoryMap[cat.id]);
		}
	});

	// Sort children arrays by id to maintain insertion order
	/**
	 * @param {Category} category
	 */
	const sortChildrenById = (category) => {
		if (category.children && category.children.length > 0) {
			category.children.sort((/** @type {Category} */ a, /** @type {Category} */ b) => a.id - b.id);
			category.children.forEach(sortChildrenById);
		}
	};

	rootCategories.forEach(sortChildrenById);

	return rootCategories;
}

export async function loadSideNavDataLegacy() {
	// Get all categories with their hierarchy
	const { data: categories } = await supabase
		.from('categories')
		.select(`
            id,
            name,
            parent_id,
            level,
            order_index,
            description
        `)
		.order('order_index', { ascending: true });

	// Get all topics with their category relationships
	const { data: topics } = await supabase
		.from('topics')
		.select(`
            id,
            name,
            category_id,
            parent_topic_id,
            level,
            order_index,
            url,
            status,
            estimated_hours,
            description
        `)
		.order('order_index', { ascending: true });

	// Build hierarchical structure
	const categoryHierarchy = buildCategoryTree(categories ?? []);

	// Group topics by category
	const topicsByCategory = (topics ?? []).reduce((acc, topic) => {
		const categoryId = topic.category_id;
		if (categoryId) {
			if (!acc[categoryId]) {
				acc[categoryId] = [];
			}
			acc[categoryId].push(topic);
		}
		return acc;
	}, /** @type {Record<number, any[]>} */({}));

	return {
		categoryHierarchy,
		topicsByCategory,
		totalCategories: (categories ?? []).length,
		totalTopics: (topics ?? []).length
	};
}