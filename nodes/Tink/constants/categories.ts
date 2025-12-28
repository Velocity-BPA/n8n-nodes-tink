/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Tink Transaction Categories
 *
 * Tink provides automatic categorization of transactions using machine learning.
 * Categories are organized hierarchically with primary and secondary levels.
 *
 * The Tink category system follows PFM (Personal Financial Management) standards
 * and is designed to provide meaningful insights into spending patterns.
 */

export interface TinkCategory {
  code: string;
  name: string;
  primaryCategory: string;
  type: 'income' | 'expense' | 'transfer';
}

export const TINK_CATEGORIES: Record<string, TinkCategory> = {
  // Income Categories
  'income.salary': {
    code: 'income.salary',
    name: 'Salary',
    primaryCategory: 'income',
    type: 'income',
  },
  'income.benefits': {
    code: 'income.benefits',
    name: 'Benefits',
    primaryCategory: 'income',
    type: 'income',
  },
  'income.pension': {
    code: 'income.pension',
    name: 'Pension',
    primaryCategory: 'income',
    type: 'income',
  },
  'income.investment': {
    code: 'income.investment',
    name: 'Investment Income',
    primaryCategory: 'income',
    type: 'income',
  },
  'income.refund': {
    code: 'income.refund',
    name: 'Refunds',
    primaryCategory: 'income',
    type: 'income',
  },
  'income.other': {
    code: 'income.other',
    name: 'Other Income',
    primaryCategory: 'income',
    type: 'income',
  },

  // Housing & Utilities
  'expenses.home.rent': {
    code: 'expenses.home.rent',
    name: 'Rent',
    primaryCategory: 'expenses.home',
    type: 'expense',
  },
  'expenses.home.mortgage': {
    code: 'expenses.home.mortgage',
    name: 'Mortgage',
    primaryCategory: 'expenses.home',
    type: 'expense',
  },
  'expenses.home.utilities': {
    code: 'expenses.home.utilities',
    name: 'Utilities',
    primaryCategory: 'expenses.home',
    type: 'expense',
  },
  'expenses.home.insurance': {
    code: 'expenses.home.insurance',
    name: 'Home Insurance',
    primaryCategory: 'expenses.home',
    type: 'expense',
  },
  'expenses.home.maintenance': {
    code: 'expenses.home.maintenance',
    name: 'Home Maintenance',
    primaryCategory: 'expenses.home',
    type: 'expense',
  },

  // Food & Groceries
  'expenses.food.groceries': {
    code: 'expenses.food.groceries',
    name: 'Groceries',
    primaryCategory: 'expenses.food',
    type: 'expense',
  },
  'expenses.food.restaurants': {
    code: 'expenses.food.restaurants',
    name: 'Restaurants & Dining',
    primaryCategory: 'expenses.food',
    type: 'expense',
  },
  'expenses.food.coffee': {
    code: 'expenses.food.coffee',
    name: 'Coffee & Snacks',
    primaryCategory: 'expenses.food',
    type: 'expense',
  },
  'expenses.food.delivery': {
    code: 'expenses.food.delivery',
    name: 'Food Delivery',
    primaryCategory: 'expenses.food',
    type: 'expense',
  },

  // Transportation
  'expenses.transport.fuel': {
    code: 'expenses.transport.fuel',
    name: 'Fuel',
    primaryCategory: 'expenses.transport',
    type: 'expense',
  },
  'expenses.transport.public': {
    code: 'expenses.transport.public',
    name: 'Public Transport',
    primaryCategory: 'expenses.transport',
    type: 'expense',
  },
  'expenses.transport.taxi': {
    code: 'expenses.transport.taxi',
    name: 'Taxi & Rideshare',
    primaryCategory: 'expenses.transport',
    type: 'expense',
  },
  'expenses.transport.car': {
    code: 'expenses.transport.car',
    name: 'Car Expenses',
    primaryCategory: 'expenses.transport',
    type: 'expense',
  },
  'expenses.transport.parking': {
    code: 'expenses.transport.parking',
    name: 'Parking',
    primaryCategory: 'expenses.transport',
    type: 'expense',
  },

  // Shopping
  'expenses.shopping.clothing': {
    code: 'expenses.shopping.clothing',
    name: 'Clothing & Accessories',
    primaryCategory: 'expenses.shopping',
    type: 'expense',
  },
  'expenses.shopping.electronics': {
    code: 'expenses.shopping.electronics',
    name: 'Electronics',
    primaryCategory: 'expenses.shopping',
    type: 'expense',
  },
  'expenses.shopping.household': {
    code: 'expenses.shopping.household',
    name: 'Household Items',
    primaryCategory: 'expenses.shopping',
    type: 'expense',
  },
  'expenses.shopping.online': {
    code: 'expenses.shopping.online',
    name: 'Online Shopping',
    primaryCategory: 'expenses.shopping',
    type: 'expense',
  },

  // Entertainment
  'expenses.entertainment.streaming': {
    code: 'expenses.entertainment.streaming',
    name: 'Streaming Services',
    primaryCategory: 'expenses.entertainment',
    type: 'expense',
  },
  'expenses.entertainment.events': {
    code: 'expenses.entertainment.events',
    name: 'Events & Tickets',
    primaryCategory: 'expenses.entertainment',
    type: 'expense',
  },
  'expenses.entertainment.hobbies': {
    code: 'expenses.entertainment.hobbies',
    name: 'Hobbies',
    primaryCategory: 'expenses.entertainment',
    type: 'expense',
  },
  'expenses.entertainment.gaming': {
    code: 'expenses.entertainment.gaming',
    name: 'Gaming',
    primaryCategory: 'expenses.entertainment',
    type: 'expense',
  },

  // Health & Wellness
  'expenses.health.medical': {
    code: 'expenses.health.medical',
    name: 'Medical',
    primaryCategory: 'expenses.health',
    type: 'expense',
  },
  'expenses.health.pharmacy': {
    code: 'expenses.health.pharmacy',
    name: 'Pharmacy',
    primaryCategory: 'expenses.health',
    type: 'expense',
  },
  'expenses.health.fitness': {
    code: 'expenses.health.fitness',
    name: 'Fitness & Gym',
    primaryCategory: 'expenses.health',
    type: 'expense',
  },
  'expenses.health.insurance': {
    code: 'expenses.health.insurance',
    name: 'Health Insurance',
    primaryCategory: 'expenses.health',
    type: 'expense',
  },

  // Financial
  'expenses.financial.fees': {
    code: 'expenses.financial.fees',
    name: 'Bank Fees',
    primaryCategory: 'expenses.financial',
    type: 'expense',
  },
  'expenses.financial.interest': {
    code: 'expenses.financial.interest',
    name: 'Interest Payments',
    primaryCategory: 'expenses.financial',
    type: 'expense',
  },
  'expenses.financial.loans': {
    code: 'expenses.financial.loans',
    name: 'Loan Payments',
    primaryCategory: 'expenses.financial',
    type: 'expense',
  },
  'expenses.financial.insurance': {
    code: 'expenses.financial.insurance',
    name: 'Insurance',
    primaryCategory: 'expenses.financial',
    type: 'expense',
  },

  // Transfers
  'transfers.internal': {
    code: 'transfers.internal',
    name: 'Internal Transfer',
    primaryCategory: 'transfers',
    type: 'transfer',
  },
  'transfers.external': {
    code: 'transfers.external',
    name: 'External Transfer',
    primaryCategory: 'transfers',
    type: 'transfer',
  },
  'transfers.savings': {
    code: 'transfers.savings',
    name: 'Savings Transfer',
    primaryCategory: 'transfers',
    type: 'transfer',
  },

  // Other
  'expenses.other': {
    code: 'expenses.other',
    name: 'Other Expenses',
    primaryCategory: 'expenses',
    type: 'expense',
  },
  uncategorized: {
    code: 'uncategorized',
    name: 'Uncategorized',
    primaryCategory: 'uncategorized',
    type: 'expense',
  },
};

export const PRIMARY_CATEGORIES = [
  { code: 'income', name: 'Income', type: 'income' },
  { code: 'expenses.home', name: 'Housing & Utilities', type: 'expense' },
  { code: 'expenses.food', name: 'Food & Dining', type: 'expense' },
  { code: 'expenses.transport', name: 'Transportation', type: 'expense' },
  { code: 'expenses.shopping', name: 'Shopping', type: 'expense' },
  { code: 'expenses.entertainment', name: 'Entertainment', type: 'expense' },
  { code: 'expenses.health', name: 'Health & Wellness', type: 'expense' },
  { code: 'expenses.financial', name: 'Financial', type: 'expense' },
  { code: 'transfers', name: 'Transfers', type: 'transfer' },
  { code: 'expenses.other', name: 'Other', type: 'expense' },
];

export const CATEGORY_OPTIONS = Object.entries(TINK_CATEGORIES).map(([code, category]) => ({
  name: category.name,
  value: code,
  description: `Type: ${category.type}, Primary: ${category.primaryCategory}`,
}));
