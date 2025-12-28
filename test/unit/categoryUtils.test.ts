/**
 * Unit tests for Tink category utilities
 *
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import {
	getCategoryByCode,
	getPrimaryCategories,
	getSecondaryCategories,
	getCategoryPath,
	isExpenseCategory,
	isIncomeCategory,
} from '../../nodes/Tink/utils/categoryUtils';

describe('Category Utils', () => {
	describe('getCategoryByCode', () => {
		it('should return category for valid code', () => {
			const category = getCategoryByCode('expenses.food.groceries');
			
			expect(category).toBeDefined();
			expect(category?.code).toBe('expenses.food.groceries');
		});

		it('should return undefined for invalid code', () => {
			const category = getCategoryByCode('invalid.category.code');
			
			expect(category).toBeUndefined();
		});

		it('should handle primary category code', () => {
			const category = getCategoryByCode('expenses');
			
			expect(category).toBeDefined();
			expect(category?.type).toBe('EXPENSE');
		});

		it('should handle empty string', () => {
			const category = getCategoryByCode('');
			
			expect(category).toBeUndefined();
		});
	});

	describe('getPrimaryCategories', () => {
		it('should return array of primary categories', () => {
			const categories = getPrimaryCategories();
			
			expect(Array.isArray(categories)).toBe(true);
			expect(categories.length).toBeGreaterThan(0);
		});

		it('should include expenses category', () => {
			const categories = getPrimaryCategories();
			const expenses = categories.find(c => c.code === 'expenses');
			
			expect(expenses).toBeDefined();
		});

		it('should include income category', () => {
			const categories = getPrimaryCategories();
			const income = categories.find(c => c.code === 'income');
			
			expect(income).toBeDefined();
		});

		it('should include transfers category', () => {
			const categories = getPrimaryCategories();
			const transfers = categories.find(c => c.code === 'transfers');
			
			expect(transfers).toBeDefined();
		});
	});

	describe('getSecondaryCategories', () => {
		it('should return secondary categories for expenses', () => {
			const categories = getSecondaryCategories('expenses');
			
			expect(Array.isArray(categories)).toBe(true);
			expect(categories.length).toBeGreaterThan(0);
		});

		it('should return secondary categories for income', () => {
			const categories = getSecondaryCategories('income');
			
			expect(Array.isArray(categories)).toBe(true);
			expect(categories.length).toBeGreaterThan(0);
		});

		it('should return empty array for invalid primary', () => {
			const categories = getSecondaryCategories('invalid');
			
			expect(Array.isArray(categories)).toBe(true);
			expect(categories.length).toBe(0);
		});

		it('should include food category under expenses', () => {
			const categories = getSecondaryCategories('expenses');
			const food = categories.find(c => c.code.includes('food'));
			
			expect(food).toBeDefined();
		});
	});

	describe('getCategoryPath', () => {
		it('should return path for tertiary category', () => {
			const path = getCategoryPath('expenses.food.groceries');
			
			expect(path).toBeDefined();
			expect(path.length).toBe(3);
			expect(path[0].code).toBe('expenses');
			expect(path[2].code).toBe('expenses.food.groceries');
		});

		it('should return path for secondary category', () => {
			const path = getCategoryPath('expenses.food');
			
			expect(path.length).toBe(2);
		});

		it('should return path for primary category', () => {
			const path = getCategoryPath('expenses');
			
			expect(path.length).toBe(1);
			expect(path[0].code).toBe('expenses');
		});

		it('should return empty array for invalid code', () => {
			const path = getCategoryPath('invalid');
			
			expect(path).toEqual([]);
		});
	});

	describe('isExpenseCategory', () => {
		it('should return true for expense category', () => {
			expect(isExpenseCategory('expenses.food.groceries')).toBe(true);
		});

		it('should return true for expense primary category', () => {
			expect(isExpenseCategory('expenses')).toBe(true);
		});

		it('should return false for income category', () => {
			expect(isExpenseCategory('income.salary')).toBe(false);
		});

		it('should return false for transfer category', () => {
			expect(isExpenseCategory('transfers.internal')).toBe(false);
		});

		it('should return false for invalid category', () => {
			expect(isExpenseCategory('invalid')).toBe(false);
		});
	});

	describe('isIncomeCategory', () => {
		it('should return true for income category', () => {
			expect(isIncomeCategory('income.salary')).toBe(true);
		});

		it('should return true for income primary category', () => {
			expect(isIncomeCategory('income')).toBe(true);
		});

		it('should return false for expense category', () => {
			expect(isIncomeCategory('expenses.food')).toBe(false);
		});

		it('should return false for transfer category', () => {
			expect(isIncomeCategory('transfers.internal')).toBe(false);
		});

		it('should return false for invalid category', () => {
			expect(isIncomeCategory('invalid')).toBe(false);
		});
	});
});
