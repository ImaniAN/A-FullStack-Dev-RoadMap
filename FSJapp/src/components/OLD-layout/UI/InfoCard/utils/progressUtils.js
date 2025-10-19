// Progress calculation utilities for hierarchical navigation

/**
 * @typedef {Object} Category
 * @property {number} id
 * @property {number} depth
 * @property {number} level
 * @property {number|null} parent_category_id
 * @property {number|null} parent_id
 * @property {string} name
 */

/**
 * Calculate position-based progress for local depth (within siblings)
 * @param {Category} category - Current category object
 * @param {Category[]} allCategories - All categories array
 * @returns {number} Progress percentage (10-90 range)
 */
export function getLocalDepthProgress(category, allCategories) {
    if (!category || !allCategories) return 10;

    // Use level field (from database) or depth field (computed) - prioritize level
    const categoryLevel = category.level ?? category.depth ?? 0;
    const parentId = category.parent_id ?? category.parent_category_id;

    // Find all siblings at the same level with same parent
    const siblings = allCategories.filter(cat => {
        const catLevel = cat.level ?? cat.depth ?? 0;
        const catParentId = cat.parent_id ?? cat.parent_category_id;
        return catLevel === categoryLevel && catParentId === parentId;
    });

    if (siblings.length <= 1) return 50; // Single item = mid-point

    // Sort siblings by some consistent order (id, name, or position)
    siblings.sort((a, b) => a.id - b.id);

    // Find current position in siblings
    const currentIndex = siblings.findIndex(sib => sib.id === category.id);
    if (currentIndex === -1) return 10;

    // Calculate position-based percentage (10% to 90% range)
    const positionRatio = currentIndex / (siblings.length - 1);
    return Math.round(10 + (positionRatio * 80)); // 10% + (0-1) * 80% = 10-90%
}

/**
 * Calculate simple depth percentage
 * @param {number} depth - Current depth level
 * @param {number} maxDepth - Maximum depth in tree
 * @returns {number} Progress percentage
 */
export function getDepthProgress(depth, maxDepth = 5) {
    if (depth <= 0) return 0;
    return Math.min(Math.round((depth / maxDepth) * 100), 100);
}

/**
 * Get progress display text and color
 * @param {number} percentage - Progress percentage
 * @returns {{text: string, color: string}} Display formatting
 */
export function getProgressDisplay(percentage) {
    if (percentage >= 80) {
        return { text: `${percentage}%`, color: 'text-green-600' };
    } else if (percentage >= 60) {
        return { text: `${percentage}%`, color: 'text-blue-600' };
    } else if (percentage >= 40) {
        return { text: `${percentage}%`, color: 'text-yellow-600' };
    } else if (percentage >= 20) {
        return { text: `${percentage}%`, color: 'text-orange-600' };
    } else {
        return { text: `${percentage}%`, color: 'text-red-600' };
    }
}

/**
 * Calculate exploration progress based on descendant counts and depth
 * @param {number} currentDepth - Current category depth/level
 * @param {number} maxDepth - Maximum depth in hierarchy
 * @param {number} totalDescendants - Total number of descendant items
 * @returns {number} Progress percentage (0-100)
 */
export function getExplorationProgress(currentDepth, maxDepth, totalDescendants) {
    if (currentDepth <= 0) return 5; // Minimum progress for being at root
    if (maxDepth <= 1) return 50; // Single level = halfway

    // Combine depth progression with descendant complexity
    const depthRatio = currentDepth / maxDepth;
    const complexityBonus = Math.min(totalDescendants / 100, 0.3); // Up to 30% bonus for complexity

    const baseProgress = Math.round(depthRatio * 70); // 70% max from depth
    const bonusProgress = Math.round(complexityBonus * 30); // 30% max from complexity

    return Math.min(baseProgress + bonusProgress + 5, 100); // +5 minimum, cap at 100%
}
