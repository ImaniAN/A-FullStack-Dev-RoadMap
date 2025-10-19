// Unified S-F Tier System - Single source of truth

/** @typedef {'S'|'A'|'B'|'C'|'D'|'E'|'F'} Tier */

export const DIFFICULTY_SYSTEM = {
    S: { level: 7, icon: '💎', color: 'text-purple-600 bg-purple-50 border-purple-200', description: 'Deep technical concepts' },
    A: { level: 6, icon: '🔥', color: 'text-red-600 bg-red-50 border-red-200', description: 'Complex topics' },
    B: { level: 5, icon: '⚡', color: 'text-orange-600 bg-orange-50 border-orange-200', description: 'Moderate challenge' },
    C: { level: 4, icon: '🌟', color: 'text-yellow-600 bg-yellow-50 border-yellow-200', description: 'Some experience needed' },
    D: { level: 3, icon: '🌱', color: 'text-green-600 bg-green-50 border-green-200', description: 'Baby steps level' },
    E: { level: 2, icon: '🎯', color: 'text-blue-600 bg-blue-50 border-blue-200', description: 'Super simple stuff' },
    F: { level: 1, icon: '🎓', color: 'text-gray-600 bg-gray-50 border-gray-200', description: 'Hand-holding mode' }
};

const TIERS = /** @type {Tier[]} */ (['S', 'A', 'B', 'C', 'D', 'E', 'F']);

/**
 * @param {number} level
 * @returns {{level: number, icon: string, color: string, description: string}}
 */
export function getTierByLevel(level) {
    const tier = TIERS.find(key => DIFFICULTY_SYSTEM[key].level === level);
    return tier ? DIFFICULTY_SYSTEM[tier] : DIFFICULTY_SYSTEM.F;
}

/**
 * @param {Tier} tier
 * @returns {{level: number, icon: string, color: string, description: string}}
 */
export function getTierByName(tier) {
    return DIFFICULTY_SYSTEM[tier] || DIFFICULTY_SYSTEM.F;
}

/**
 * @param {number} level
 * @returns {string}
 */
export function getTierColor(level) {
    return getTierByLevel(level).color;
}

/**
 * @param {number} level
 * @returns {Tier}
 */
export function getTierName(level) {
    const tier = TIERS.find(key => DIFFICULTY_SYSTEM[key].level === level);
    return tier || 'F';
}

/**
 * @param {number} level
 * @returns {string}
 */
export function getTierIcon(level) {
    return getTierByLevel(level).icon;
}

/**
 * @param {number} level
 * @returns {string}
 */
export function getTierDescription(level) {
    return getTierByLevel(level).description;
}

/**
 * Calculate average difficulty for a category based on its tasks
 * @param {Array} tasks - Array of tasks for the category
 * @returns {number} Average difficulty level (1-7)
 */
export function calculateCategoryDifficulty(tasks) {
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) return 1;

    const validDifficulties = tasks
        .map(task => {
            if (!task || typeof task !== 'object') return null;
            const difficulty = task.difficulty_level;
            return typeof difficulty === 'number' && !isNaN(difficulty)
                ? Math.max(1, Math.min(7, difficulty))
                : null;
        })
        .filter(difficulty => difficulty !== null);

    if (validDifficulties.length === 0) return 1;

    const average = validDifficulties.reduce((sum, diff) => sum + diff, 0) / validDifficulties.length;
    return typeof average === 'number' && !isNaN(average) ? Math.round(average) : 1;
}

/**
 * Get the tier information for a category based on its tasks
 * @param {Array} tasks - Array of tasks for the category
 * @returns {{level: number, icon: string, color: string, description: string, tier: string}}
 */
export function getCategoryTierInfo(tasks) {
    const avgDifficulty = calculateCategoryDifficulty(tasks);
    const tierInfo = getTierByLevel(avgDifficulty);
    const tierName = getTierName(avgDifficulty);

    return {
        level: avgDifficulty,
        icon: tierInfo?.icon || '🎓',
        color: tierInfo?.color || 'text-gray-600 bg-gray-50 border-gray-200',
        description: tierInfo?.description || 'Unknown difficulty',
        tier: tierName || 'F'
    };
}

// Legacy aliases for backward compatibility
export const getDifficultyIcon = getTierIcon;
export const getDifficultyColor = getTierColor;
export const getDifficultyByLevel = getTierByLevel;
export const getDifficultyByTier = getTierByName;
export const getDifficultyTier = getTierName;
export const getDifficultyDescription = getTierDescription;
