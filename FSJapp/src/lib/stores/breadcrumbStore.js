import { writable } from 'svelte/store';

export const navigationContext = writable({
    categoryHierarchy: [],
    topicsByCategory: {},
    breadcrumbs: [{ label: 'Home', href: '/' }],
    selectedCategory: null,
    selectedTask: null,
    expandedCategories: new Set()
});

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

function findCategoryPath(categoryId, categories, path = []) {
    for (const category of categories) {
        const currentPath = [...path, category];

        if (category.id === categoryId) {
            return currentPath;
        }

        if (category.children?.length > 0) {
            const foundPath = findCategoryPath(categoryId, category.children, currentPath);
            if (foundPath) return foundPath;
        }
    }
    return null;
}
