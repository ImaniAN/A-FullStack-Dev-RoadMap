import { writable, derived } from 'svelte/store';

export const navigationContext = writable({
    categoryHierarchy: [],
    topicsByCategory: {},
    allResources: [],
    breadcrumbs: [{ label: 'Home', href: '/' }],
    selectedCategory: null,
    selectedTask: null,
    expandedCategories: new Set(),
    // Additional data from sideNav
    categoryStats: {},
    totalCategories: 0,
    totalTopics: 0,
    recentlyAdded: [],
    difficultyDistribution: {},
    completionStats: {},
    resourceStats: {},
    learningPathStats: {}
});

// Derived store for cumulative counts that updates automatically
export const cumulativeCounts = derived(
    navigationContext,
    ($navigationContext) => {
        const selectedCategory = $navigationContext.selectedCategory;
        if (!selectedCategory || !selectedCategory.id) {
            return { totalSubcategories: 0, totalResources: 0, totalTasks: 0 };
        }

        return calculateCumulativeCountsForCategory(
            selectedCategory.id,
            $navigationContext.categoryHierarchy,
            $navigationContext.topicsByCategory,
            $navigationContext.allResources
        );
    }
);

// Centralized function to calculate cumulative counts
export function calculateCumulativeCountsForCategory(categoryId, categoryHierarchy, topicsByCategory, allResources) {
    if (!categoryId || !categoryHierarchy || !Array.isArray(categoryHierarchy)) {
        return { totalSubcategories: 0, totalResources: 0, totalTasks: 0 };
    }

    let totalSubcategories = 0;
    let totalTasks = 0;
    let totalResources = 0;
    const visited = new Set(); // Prevent infinite loops

    function countDescendants(catId) {
        if (!catId || visited.has(catId)) return;
        visited.add(catId);

        // Find direct children in flat hierarchy or nested structure
        const children = findDirectChildren(catId, categoryHierarchy);
        totalSubcategories += children.length;

        // Count tasks for this category
        const categoryTasks = topicsByCategory[catId] || [];
        if (Array.isArray(categoryTasks)) {
            totalTasks += categoryTasks.length;

            // Count resources for these tasks
            const taskIds = categoryTasks.map(task => task?.id).filter(id => id != null);
            if (Array.isArray(allResources)) {
                const categoryResources = allResources.filter(
                    resource => resource?.task_id && taskIds.includes(resource.task_id)
                );
                totalResources += categoryResources.length;
            }
        }

        // Recursively count for children
        children.forEach(child => {
            if (child?.id) {
                countDescendants(child.id);
            }
        });
    }

    countDescendants(categoryId);
    return { totalSubcategories, totalResources, totalTasks };
}

// Helper function to find direct children in both flat and nested structures
function findDirectChildren(parentId, categoryHierarchy) {
    const children = [];

    // Handle flat structure (array with parent_id references)
    if (Array.isArray(categoryHierarchy)) {
        for (const category of categoryHierarchy) {
            if (category.parent_id === parentId) {
                children.push(category);
            }
            // Handle nested structure (categories with children property)
            if (category.children && Array.isArray(category.children)) {
                if (category.id === parentId) {
                    children.push(...category.children);
                }
                // Recursively search in nested children
                const nestedChildren = findDirectChildren(parentId, category.children);
                children.push(...nestedChildren);
            }
        }
    }

    return children;
}

export function updateBreadcrumbs(category, categoryHierarchy, task) {
    const breadcrumbs = [{ label: 'Home', href: '/' }];
    const categoryPath = findCategoryPath(category.id, categoryHierarchy);

    if (categoryPath) {
        categoryPath.forEach((cat, index) => {
            const breadcrumbItem = {
                label: cat.name,
                href: `/category/${cat.id}`,
                categoryId: cat.id,
                active: !task && index === categoryPath.length - 1
            };
            breadcrumbs.push(breadcrumbItem);
        });
    }

    if (task) {
        const taskBreadcrumb = {
            label: task.task_name || task.name,
            href: `/category/${category.id}/task/${task.id}`,
            categoryId: category.id,
            taskId: task.id,
            active: true
        };
        breadcrumbs.push(taskBreadcrumb);
    }

    navigationContext.update(ctx => ({
        ...ctx,
        breadcrumbs,
        selectedCategory: category,
        selectedTask: task || null
    }));
}

// Enhanced function to find category path in both flat and nested structures
function findCategoryPath(categoryId, categories, path = []) {
    if (!Array.isArray(categories)) return null;

    for (const category of categories) {
        const currentPath = [...path, category];

        if (category.id === categoryId) {
            return currentPath;
        }

        // Handle nested structure
        if (category.children?.length > 0) {
            const foundPath = findCategoryPath(categoryId, category.children, currentPath);
            if (foundPath) return foundPath;
        }
    }

    // Handle flat structure - build path by walking up parent_id chain
    if (path.length === 0) {
        const targetCategory = categories.find(cat => cat.id === categoryId);
        if (targetCategory) {
            const pathIds = [];
            let currentCat = targetCategory;

            // Walk up the parent chain
            while (currentCat) {
                pathIds.unshift(currentCat.id);
                if (currentCat.parent_id) {
                    currentCat = categories.find(cat => cat.id === currentCat.parent_id);
                } else {
                    break;
                }
            }

            // Convert IDs to category objects
            return pathIds.map(id => categories.find(cat => cat.id === id)).filter(Boolean);
        }
    }

    return null;
}
