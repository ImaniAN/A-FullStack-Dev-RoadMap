import { writable } from 'svelte/store';

/**
 * @typedef {Object} BreadcrumbItem
 * @property {string} label
 * @property {string} href
 * @property {boolean} [active]
 * @property {number} [categoryId]
 * @property {number} [taskId]
 */

/**
 * @typedef {Object} NavigationContext
 * @property {any[]} categoryHierarchy
 * @property {Record<number, any[]>} topicsByCategory
 * @property {BreadcrumbItem[]} breadcrumbs
 * @property {any} selectedCategory
 * @property {any} selectedTask
 * @property {Set<number>} expandedCategories
 */

/** @type {import('svelte/store').Writable<NavigationContext>} */
export const navigationContext = writable({
    categoryHierarchy: [],
    topicsByCategory: {},
    breadcrumbs: [{ label: 'Home', href: '/' }],
    selectedCategory: null,
    selectedTask: null,
    expandedCategories: new Set()
});

/**
 * Update breadcrumbs based on selected category/task
 * @param {any} category
 * @param {any} [task]
 * @param {any[]} categoryHierarchy
 */
export function updateBreadcrumbs(category, task, categoryHierarchy) {
    const breadcrumbs = [{ label: 'Home', href: '/' }];

    // Find category path
    const categoryPath = findCategoryPath(category.id, categoryHierarchy);

    // Add category breadcrumbs
    categoryPath.forEach((cat, index) => {
        breadcrumbs.push({
            label: cat.name,
            href: `/category/${cat.id}`,
            categoryId: cat.id,
            active: !task && index === categoryPath.length - 1
        });
    });

    // Add task breadcrumb if present
    if (task) {
        breadcrumbs.push({
            label: task.task_name || task.name,
            href: `/category/${category.id}/task/${task.id}`,
            categoryId: category.id,
            taskId: task.id,
            active: true
        });
    }

    navigationContext.update(ctx => ({
        ...ctx,
        breadcrumbs,
        selectedCategory: category,
        selectedTask: task || null
    }));
}

/**
 * Find the path to a category in the hierarchy
 * @param {number} categoryId
 * @param {any[]} categories
 * @param {any[]} [path]
 * @returns {any[]}
 */
function findCategoryPath(categoryId, categories, path = []) {
    for (const category of categories) {
        const currentPath = [...path, category];

        if (category.id === categoryId) {
            return currentPath;
        }

        if (category.children && category.children.length > 0) {
            const foundPath = findCategoryPath(categoryId, category.children, currentPath);
            if (foundPath) return foundPath;
        }
    }
    return null;
}
