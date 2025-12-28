/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { TINK_CATEGORIES, PRIMARY_CATEGORIES, TinkCategory } from '../constants/categories';

/**
 * Category Utilities for Tink
 *
 * Helper functions for working with Tink's transaction categorization system.
 * Tink uses a hierarchical category system with primary and secondary categories.
 */

/**
 * Get category by code
 */
export function getCategoryByCode(code: string): TinkCategory | undefined {
  return TINK_CATEGORIES[code];
}

/**
 * Get all categories for a primary category
 */
export function getCategoriesByPrimary(primaryCode: string): TinkCategory[] {
  return Object.values(TINK_CATEGORIES).filter(
    (category) => category.primaryCategory === primaryCode,
  );
}

/**
 * Get category type (income, expense, transfer)
 */
export function getCategoryType(code: string): 'income' | 'expense' | 'transfer' | undefined {
  const category = getCategoryByCode(code);
  return category?.type;
}

/**
 * Check if category is an income category
 */
export function isIncomeCategory(code: string): boolean {
  return getCategoryType(code) === 'income';
}

/**
 * Check if category is an expense category
 */
export function isExpenseCategory(code: string): boolean {
  return getCategoryType(code) === 'expense';
}

/**
 * Check if category is a transfer category
 */
export function isTransferCategory(code: string): boolean {
  return getCategoryType(code) === 'transfer';
}

/**
 * Get primary category from a category code
 */
export function getPrimaryCategory(code: string): string {
  const category = getCategoryByCode(code);
  return category?.primaryCategory || code.split('.')[0] || 'uncategorized';
}

/**
 * Get human-readable category name
 */
export function getCategoryName(code: string): string {
  const category = getCategoryByCode(code);
  return category?.name || code;
}

/**
 * Get all primary categories
 */
export function getAllPrimaryCategories(): typeof PRIMARY_CATEGORIES {
  return PRIMARY_CATEGORIES;
}

/**
 * Get all categories as a flat array
 */
export function getAllCategories(): TinkCategory[] {
  return Object.values(TINK_CATEGORIES);
}

/**
 * Get categories grouped by type
 */
export function getCategoriesByType(): {
  income: TinkCategory[];
  expense: TinkCategory[];
  transfer: TinkCategory[];
} {
  const categories = getAllCategories();

  return {
    income: categories.filter((c) => c.type === 'income'),
    expense: categories.filter((c) => c.type === 'expense'),
    transfer: categories.filter((c) => c.type === 'transfer'),
  };
}

/**
 * Build category tree structure
 */
export function buildCategoryTree(): Record<
  string,
  { name: string; type: string; children: TinkCategory[] }
> {
  const tree: Record<string, { name: string; type: string; children: TinkCategory[] }> = {};

  for (const primary of PRIMARY_CATEGORIES) {
    tree[primary.code] = {
      name: primary.name,
      type: primary.type,
      children: getCategoriesByPrimary(primary.code),
    };
  }

  return tree;
}

/**
 * Suggest categories based on transaction description
 *
 * Simple keyword-based category suggestion.
 * In production, Tink's enrichment API provides more accurate suggestions.
 */
export function suggestCategory(description: string): string[] {
  const lowerDesc = description.toLowerCase();
  const suggestions: string[] = [];

  // Keyword to category mapping
  const keywordMap: Record<string, string> = {
    salary: 'income.salary',
    payroll: 'income.salary',
    wage: 'income.salary',
    rent: 'expenses.home.rent',
    mortgage: 'expenses.home.mortgage',
    utility: 'expenses.home.utilities',
    electric: 'expenses.home.utilities',
    gas: 'expenses.home.utilities',
    water: 'expenses.home.utilities',
    grocery: 'expenses.food.groceries',
    supermarket: 'expenses.food.groceries',
    restaurant: 'expenses.food.restaurants',
    cafe: 'expenses.food.coffee',
    coffee: 'expenses.food.coffee',
    uber: 'expenses.transport.taxi',
    taxi: 'expenses.transport.taxi',
    fuel: 'expenses.transport.fuel',
    petrol: 'expenses.transport.fuel',
    parking: 'expenses.transport.parking',
    amazon: 'expenses.shopping.online',
    netflix: 'expenses.entertainment.streaming',
    spotify: 'expenses.entertainment.streaming',
    gym: 'expenses.health.fitness',
    pharmacy: 'expenses.health.pharmacy',
    doctor: 'expenses.health.medical',
    insurance: 'expenses.financial.insurance',
    bank: 'expenses.financial.fees',
    atm: 'expenses.financial.fees',
    transfer: 'transfers.external',
  };

  for (const [keyword, category] of Object.entries(keywordMap)) {
    if (lowerDesc.includes(keyword)) {
      suggestions.push(category);
    }
  }

  // Return unique suggestions or uncategorized
  const uniqueSuggestions = [...new Set(suggestions)];
  return uniqueSuggestions.length > 0 ? uniqueSuggestions : ['uncategorized'];
}

/**
 * Calculate category statistics from transactions
 */
export function calculateCategoryStats(
  transactions: Array<{ category: string; amount: number }>,
): Record<string, { count: number; total: number }> {
  const stats: Record<string, { count: number; total: number }> = {};

  for (const tx of transactions) {
    const category = tx.category || 'uncategorized';
    if (!stats[category]) {
      stats[category] = { count: 0, total: 0 };
    }
    stats[category].count++;
    stats[category].total += Math.abs(tx.amount);
  }

  return stats;
}

/**
 * Get category icon name (for UI purposes)
 */
export function getCategoryIcon(code: string): string {
  const iconMap: Record<string, string> = {
    income: 'cash',
    'expenses.home': 'home',
    'expenses.food': 'restaurant',
    'expenses.transport': 'car',
    'expenses.shopping': 'cart',
    'expenses.entertainment': 'game',
    'expenses.health': 'medical',
    'expenses.financial': 'bank',
    transfers: 'swap',
    uncategorized: 'question',
  };

  const primaryCategory = getPrimaryCategory(code);
  return iconMap[primaryCategory] || iconMap[code] || 'receipt';
}

/**
 * Validate category code
 */
export function isValidCategory(code: string): boolean {
  return !!TINK_CATEGORIES[code];
}
