/**
 * Statistics Resource
 * 
 * Get aggregated statistics for accounts and transactions
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { INodeProperties } from 'n8n-workflow';

export const statisticsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['statistics'],
			},
		},
		options: [
			{
				name: 'Get Account Statistics',
				value: 'getAccountStatistics',
				description: 'Get statistics for accounts',
				action: 'Get account statistics',
			},
			{
				name: 'Get Category Statistics',
				value: 'getCategoryStatistics',
				description: 'Get statistics by category',
				action: 'Get category statistics',
			},
			{
				name: 'Get Monthly Statistics',
				value: 'getMonthlyStatistics',
				description: 'Get monthly statistics',
				action: 'Get monthly statistics',
			},
			{
				name: 'Get Statistics',
				value: 'getStatistics',
				description: 'Get general statistics',
				action: 'Get statistics',
			},
			{
				name: 'Get Transaction Statistics',
				value: 'getTransactionStatistics',
				description: 'Get transaction statistics',
				action: 'Get transaction statistics',
			},
		],
		default: 'getStatistics',
	},
];

export const statisticsFields: INodeProperties[] = [
	// ----------------------------------
	//         statistics:common
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['statistics'],
			},
		},
		default: '',
		description: 'The ID of the user',
	},

	// ----------------------------------
	//         statistics:dateRange
	// ----------------------------------
	{
		displayName: 'Date Range',
		name: 'dateRange',
		type: 'collection',
		placeholder: 'Add Date Range',
		default: {},
		displayOptions: {
			show: {
				resource: ['statistics'],
			},
		},
		options: [
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'End date for statistics',
			},
			{
				displayName: 'Period',
				name: 'period',
				type: 'options',
				options: [
					{ name: 'Last Week', value: 'LAST_WEEK' },
					{ name: 'Last Month', value: 'LAST_MONTH' },
					{ name: 'Last 3 Months', value: 'LAST_3_MONTHS' },
					{ name: 'Last 6 Months', value: 'LAST_6_MONTHS' },
					{ name: 'Last Year', value: 'LAST_YEAR' },
					{ name: 'All Time', value: 'ALL_TIME' },
					{ name: 'Custom', value: 'CUSTOM' },
				],
				default: 'LAST_MONTH',
				description: 'Predefined period',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Start date for statistics',
			},
		],
	},

	// ----------------------------------
	//         statistics:accountStatistics
	// ----------------------------------
	{
		displayName: 'Account Options',
		name: 'accountOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['statistics'],
				operation: ['getAccountStatistics'],
			},
		},
		options: [
			{
				displayName: 'Account IDs',
				name: 'accountIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of account IDs (leave empty for all)',
			},
			{
				displayName: 'Account Types',
				name: 'accountTypes',
				type: 'multiOptions',
				options: [
					{ name: 'Checking', value: 'CHECKING' },
					{ name: 'Credit Card', value: 'CREDIT_CARD' },
					{ name: 'Investment', value: 'INVESTMENT' },
					{ name: 'Loan', value: 'LOAN' },
					{ name: 'Mortgage', value: 'MORTGAGE' },
					{ name: 'Pension', value: 'PENSION' },
					{ name: 'Savings', value: 'SAVINGS' },
				],
				default: [],
				description: 'Filter by account types',
			},
			{
				displayName: 'Include Balances',
				name: 'includeBalances',
				type: 'boolean',
				default: true,
				description: 'Whether to include balance statistics',
			},
		],
	},

	// ----------------------------------
	//         statistics:transactionStatistics
	// ----------------------------------
	{
		displayName: 'Transaction Options',
		name: 'transactionOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['statistics'],
				operation: ['getTransactionStatistics'],
			},
		},
		options: [
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				default: '',
				description: 'Filter by account ID',
			},
			{
				displayName: 'Category',
				name: 'category',
				type: 'string',
				default: '',
				description: 'Filter by category code',
			},
			{
				displayName: 'Group By',
				name: 'groupBy',
				type: 'options',
				options: [
					{ name: 'Category', value: 'CATEGORY' },
					{ name: 'Day', value: 'DAY' },
					{ name: 'Merchant', value: 'MERCHANT' },
					{ name: 'Month', value: 'MONTH' },
					{ name: 'Week', value: 'WEEK' },
				],
				default: 'CATEGORY',
				description: 'How to group transaction statistics',
			},
			{
				displayName: 'Transaction Type',
				name: 'transactionType',
				type: 'options',
				options: [
					{ name: 'All', value: 'ALL' },
					{ name: 'Credit (Income)', value: 'CREDIT' },
					{ name: 'Debit (Expense)', value: 'DEBIT' },
				],
				default: 'ALL',
				description: 'Filter by transaction type',
			},
		],
	},

	// ----------------------------------
	//         statistics:monthlyStatistics
	// ----------------------------------
	{
		displayName: 'Monthly Options',
		name: 'monthlyOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['statistics'],
				operation: ['getMonthlyStatistics'],
			},
		},
		options: [
			{
				displayName: 'Include Breakdown',
				name: 'includeBreakdown',
				type: 'boolean',
				default: true,
				description: 'Whether to include category breakdown',
			},
			{
				displayName: 'Months',
				name: 'months',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 24,
				},
				default: 6,
				description: 'Number of months to include',
			},
		],
	},

	// ----------------------------------
	//         statistics:categoryStatistics
	// ----------------------------------
	{
		displayName: 'Category Options',
		name: 'categoryOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['statistics'],
				operation: ['getCategoryStatistics'],
			},
		},
		options: [
			{
				displayName: 'Categories',
				name: 'categories',
				type: 'string',
				default: '',
				description: 'Comma-separated list of category codes (leave empty for all)',
			},
			{
				displayName: 'Include Subcategories',
				name: 'includeSubcategories',
				type: 'boolean',
				default: true,
				description: 'Whether to include subcategory breakdown',
			},
			{
				displayName: 'Top N',
				name: 'topN',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 50,
				},
				default: 10,
				description: 'Number of top categories to return',
			},
		],
	},
];
