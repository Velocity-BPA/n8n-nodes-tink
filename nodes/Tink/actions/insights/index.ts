/**
 * Insights Resource
 * 
 * Financial analytics and insights from Tink
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { INodeProperties } from 'n8n-workflow';

export const insightsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['insights'],
			},
		},
		options: [
			{
				name: 'Get Account Insights',
				value: 'getAccountInsights',
				description: 'Get insights for accounts',
				action: 'Get account insights',
			},
			{
				name: 'Get Budget Analysis',
				value: 'getBudgetAnalysis',
				description: 'Get budget analysis and recommendations',
				action: 'Get budget analysis',
			},
			{
				name: 'Get Cash Flow',
				value: 'getCashFlow',
				description: 'Get cash flow analysis',
				action: 'Get cash flow analysis',
			},
			{
				name: 'Get Income Insights',
				value: 'getIncomeInsights',
				description: 'Get income analysis',
				action: 'Get income insights',
			},
			{
				name: 'Get Risk Assessment',
				value: 'getRiskAssessment',
				description: 'Get financial risk assessment',
				action: 'Get risk assessment',
			},
			{
				name: 'Get Saving Potential',
				value: 'getSavingPotential',
				description: 'Get saving potential analysis',
				action: 'Get saving potential',
			},
			{
				name: 'Get Spending Insights',
				value: 'getSpendingInsights',
				description: 'Get spending analysis by category',
				action: 'Get spending insights',
			},
		],
		default: 'getSpendingInsights',
	},
];

export const insightsFields: INodeProperties[] = [
	// ----------------------------------
	//         insights:common
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['insights'],
			},
		},
		default: '',
		description: 'The ID of the user to analyze',
	},

	// ----------------------------------
	//         insights:dateRange
	// ----------------------------------
	{
		displayName: 'Date Range',
		name: 'dateRange',
		type: 'collection',
		placeholder: 'Add Date Range',
		default: {},
		displayOptions: {
			show: {
				resource: ['insights'],
				operation: [
					'getSpendingInsights',
					'getIncomeInsights',
					'getCashFlow',
					'getBudgetAnalysis',
				],
			},
		},
		options: [
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'End date for analysis period',
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
					{ name: 'Custom', value: 'CUSTOM' },
				],
				default: 'LAST_MONTH',
				description: 'Predefined analysis period',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Start date for analysis period',
			},
		],
	},

	// ----------------------------------
	//         insights:spending
	// ----------------------------------
	{
		displayName: 'Spending Options',
		name: 'spendingOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['insights'],
				operation: ['getSpendingInsights'],
			},
		},
		options: [
			{
				displayName: 'Categories',
				name: 'categories',
				type: 'multiOptions',
				options: [
					{ name: 'Entertainment', value: 'ENTERTAINMENT' },
					{ name: 'Food & Groceries', value: 'FOOD' },
					{ name: 'Health', value: 'HEALTH' },
					{ name: 'Housing', value: 'HOUSING' },
					{ name: 'Shopping', value: 'SHOPPING' },
					{ name: 'Transport', value: 'TRANSPORT' },
					{ name: 'Travel', value: 'TRAVEL' },
					{ name: 'Utilities', value: 'UTILITIES' },
				],
				default: [],
				description: 'Filter by specific categories',
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
				description: 'How to group spending data',
			},
			{
				displayName: 'Include Comparison',
				name: 'includeComparison',
				type: 'boolean',
				default: true,
				description: 'Whether to include comparison with previous period',
			},
		],
	},

	// ----------------------------------
	//         insights:cashFlow
	// ----------------------------------
	{
		displayName: 'Cash Flow Options',
		name: 'cashFlowOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['insights'],
				operation: ['getCashFlow'],
			},
		},
		options: [
			{
				displayName: 'Exclude Transfers',
				name: 'excludeTransfers',
				type: 'boolean',
				default: true,
				description: 'Whether to exclude internal transfers between accounts',
			},
			{
				displayName: 'Granularity',
				name: 'granularity',
				type: 'options',
				options: [
					{ name: 'Daily', value: 'DAILY' },
					{ name: 'Weekly', value: 'WEEKLY' },
					{ name: 'Monthly', value: 'MONTHLY' },
				],
				default: 'MONTHLY',
				description: 'Time granularity for cash flow data',
			},
			{
				displayName: 'Include Forecast',
				name: 'includeForecast',
				type: 'boolean',
				default: false,
				description: 'Whether to include cash flow forecast',
			},
		],
	},

	// ----------------------------------
	//         insights:risk
	// ----------------------------------
	{
		displayName: 'Risk Assessment Options',
		name: 'riskOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['insights'],
				operation: ['getRiskAssessment'],
			},
		},
		options: [
			{
				displayName: 'Assessment Types',
				name: 'assessmentTypes',
				type: 'multiOptions',
				options: [
					{ name: 'Affordability', value: 'AFFORDABILITY' },
					{ name: 'Credit Risk', value: 'CREDIT_RISK' },
					{ name: 'Default Risk', value: 'DEFAULT_RISK' },
					{ name: 'Gambling', value: 'GAMBLING' },
					{ name: 'Income Stability', value: 'INCOME_STABILITY' },
					{ name: 'Overdraft Usage', value: 'OVERDRAFT_USAGE' },
				],
				default: ['CREDIT_RISK', 'INCOME_STABILITY'],
				description: 'Types of risk assessments to include',
			},
			{
				displayName: 'Include Details',
				name: 'includeDetails',
				type: 'boolean',
				default: true,
				description: 'Whether to include detailed risk factors',
			},
		],
	},

	// ----------------------------------
	//         insights:accountInsights
	// ----------------------------------
	{
		displayName: 'Account Options',
		name: 'accountOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['insights'],
				operation: ['getAccountInsights'],
			},
		},
		options: [
			{
				displayName: 'Account IDs',
				name: 'accountIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of account IDs to analyze (leave empty for all)',
			},
			{
				displayName: 'Include Balance History',
				name: 'includeBalanceHistory',
				type: 'boolean',
				default: true,
				description: 'Whether to include historical balance data',
			},
			{
				displayName: 'Include Predictions',
				name: 'includePredictions',
				type: 'boolean',
				default: false,
				description: 'Whether to include balance predictions',
			},
		],
	},
];
