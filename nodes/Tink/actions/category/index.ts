/**
 * Category Resource
 * 
 * Query transaction categories and hierarchy
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { INodeProperties } from 'n8n-workflow';

export const categoryOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['category'],
			},
		},
		options: [
			{
				name: 'Get by Code',
				value: 'getByCode',
				description: 'Get a category by its code',
				action: 'Get category by code',
			},
			{
				name: 'Get Primary',
				value: 'getPrimary',
				description: 'Get primary (top-level) categories',
				action: 'Get primary categories',
			},
			{
				name: 'Get Secondary',
				value: 'getSecondary',
				description: 'Get secondary categories for a primary',
				action: 'Get secondary categories',
			},
			{
				name: 'Get Tree',
				value: 'getTree',
				description: 'Get full category hierarchy',
				action: 'Get category tree',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all categories',
				action: 'List all categories',
			},
		],
		default: 'list',
	},
];

export const categoryFields: INodeProperties[] = [
	// ----------------------------------
	//         category:getByCode
	// ----------------------------------
	{
		displayName: 'Category Code',
		name: 'categoryCode',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['category'],
				operation: ['getByCode'],
			},
		},
		default: '',
		placeholder: 'expenses.food.restaurants',
		description: 'The category code (e.g., expenses.food.restaurants)',
	},

	// ----------------------------------
	//         category:getSecondary
	// ----------------------------------
	{
		displayName: 'Primary Category',
		name: 'primaryCategory',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['category'],
				operation: ['getSecondary'],
			},
		},
		options: [
			{ name: 'Expenses - Entertainment', value: 'expenses.entertainment' },
			{ name: 'Expenses - Financial', value: 'expenses.financial' },
			{ name: 'Expenses - Food', value: 'expenses.food' },
			{ name: 'Expenses - Health', value: 'expenses.health' },
			{ name: 'Expenses - Home', value: 'expenses.home' },
			{ name: 'Expenses - Miscellaneous', value: 'expenses.misc' },
			{ name: 'Expenses - Shopping', value: 'expenses.shopping' },
			{ name: 'Expenses - Transport', value: 'expenses.transport' },
			{ name: 'Expenses - Travel', value: 'expenses.travel' },
			{ name: 'Income - Benefits', value: 'income.benefits' },
			{ name: 'Income - Other', value: 'income.other' },
			{ name: 'Income - Pension', value: 'income.pension' },
			{ name: 'Income - Refund', value: 'income.refund' },
			{ name: 'Income - Salary', value: 'income.salary' },
			{ name: 'Transfers - Internal', value: 'transfers.internal' },
			{ name: 'Transfers - Savings', value: 'transfers.savings' },
		],
		default: 'expenses.food',
		description: 'The primary category to get subcategories for',
	},

	// ----------------------------------
	//         category:list filters
	// ----------------------------------
	{
		displayName: 'List Options',
		name: 'listOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['category'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Include Codes',
				name: 'includeCodes',
				type: 'boolean',
				default: true,
				description: 'Whether to include category codes',
			},
			{
				displayName: 'Locale',
				name: 'locale',
				type: 'options',
				options: [
					{ name: 'Danish', value: 'da_DK' },
					{ name: 'Dutch', value: 'nl_NL' },
					{ name: 'English (UK)', value: 'en_GB' },
					{ name: 'English (US)', value: 'en_US' },
					{ name: 'Finnish', value: 'fi_FI' },
					{ name: 'French', value: 'fr_FR' },
					{ name: 'German', value: 'de_DE' },
					{ name: 'Italian', value: 'it_IT' },
					{ name: 'Norwegian', value: 'nb_NO' },
					{ name: 'Polish', value: 'pl_PL' },
					{ name: 'Portuguese', value: 'pt_PT' },
					{ name: 'Spanish', value: 'es_ES' },
					{ name: 'Swedish', value: 'sv_SE' },
				],
				default: 'en_US',
				description: 'Locale for category names',
			},
			{
				displayName: 'Type Filter',
				name: 'typeFilter',
				type: 'options',
				options: [
					{ name: 'All', value: 'ALL' },
					{ name: 'Expenses', value: 'EXPENSE' },
					{ name: 'Income', value: 'INCOME' },
					{ name: 'Transfers', value: 'TRANSFER' },
				],
				default: 'ALL',
				description: 'Filter by category type',
			},
		],
	},

	// ----------------------------------
	//         category:getTree options
	// ----------------------------------
	{
		displayName: 'Tree Options',
		name: 'treeOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['category'],
				operation: ['getTree'],
			},
		},
		options: [
			{
				displayName: 'Depth',
				name: 'depth',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 5,
				},
				default: 3,
				description: 'Maximum depth of the category tree',
			},
			{
				displayName: 'Locale',
				name: 'locale',
				type: 'string',
				default: 'en_US',
				description: 'Locale for category names',
			},
			{
				displayName: 'Root Category',
				name: 'rootCategory',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Expenses', value: 'expenses' },
					{ name: 'Income', value: 'income' },
					{ name: 'Transfers', value: 'transfers' },
				],
				default: '',
				description: 'Starting point for the tree',
			},
		],
	},
];
