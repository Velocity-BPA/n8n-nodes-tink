/**
 * Report Resource
 * 
 * Generate financial reports (verification, income, risk)
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { INodeProperties } from 'n8n-workflow';

export const reportOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['report'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new report',
				action: 'Create a report',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a report by ID',
				action: 'Get a report',
			},
			{
				name: 'Get Account Verification',
				value: 'getAccountVerification',
				description: 'Get account verification report',
				action: 'Get account verification report',
			},
			{
				name: 'Get Affordability',
				value: 'getAffordability',
				description: 'Get affordability report',
				action: 'Get affordability report',
			},
			{
				name: 'Get Data',
				value: 'getData',
				description: 'Get report data/content',
				action: 'Get report data',
			},
			{
				name: 'Get Income Verification',
				value: 'getIncomeVerification',
				description: 'Get income verification report',
				action: 'Get income verification report',
			},
			{
				name: 'Get Risk',
				value: 'getRisk',
				description: 'Get risk assessment report',
				action: 'Get risk report',
			},
			{
				name: 'Get Transaction',
				value: 'getTransaction',
				description: 'Get transaction report',
				action: 'Get transaction report',
			},
		],
		default: 'create',
	},
];

export const reportFields: INodeProperties[] = [
	// ----------------------------------
	//         report:create
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['report'],
				operation: [
					'create',
					'getAccountVerification',
					'getIncomeVerification',
					'getRisk',
					'getAffordability',
					'getTransaction',
				],
			},
		},
		default: '',
		description: 'The ID of the user for the report',
	},
	{
		displayName: 'Report Type',
		name: 'reportType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['create'],
			},
		},
		options: [
			{ name: 'Account Verification', value: 'ACCOUNT_VERIFICATION' },
			{ name: 'Affordability', value: 'AFFORDABILITY' },
			{ name: 'Income Verification', value: 'INCOME_VERIFICATION' },
			{ name: 'Risk Assessment', value: 'RISK_ASSESSMENT' },
			{ name: 'Transaction', value: 'TRANSACTION' },
		],
		default: 'ACCOUNT_VERIFICATION',
		description: 'The type of report to generate',
	},
	{
		displayName: 'Report Options',
		name: 'reportOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Account IDs',
				name: 'accountIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of account IDs to include',
			},
			{
				displayName: 'Date Range End',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'End date for report data',
			},
			{
				displayName: 'Date Range Start',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Start date for report data',
			},
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				options: [
					{ name: 'JSON', value: 'JSON' },
					{ name: 'PDF', value: 'PDF' },
				],
				default: 'JSON',
				description: 'Report output format',
			},
			{
				displayName: 'Include Raw Data',
				name: 'includeRawData',
				type: 'boolean',
				default: false,
				description: 'Whether to include raw transaction data',
			},
			{
				displayName: 'Locale',
				name: 'locale',
				type: 'string',
				default: 'en_US',
				description: 'Locale for report formatting',
			},
		],
	},

	// ----------------------------------
	//         report:get
	// ----------------------------------
	{
		displayName: 'Report ID',
		name: 'reportId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['get', 'getData'],
			},
		},
		default: '',
		description: 'The ID of the report',
	},

	// ----------------------------------
	//         report:verification options
	// ----------------------------------
	{
		displayName: 'Verification Options',
		name: 'verificationOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['getAccountVerification', 'getIncomeVerification'],
			},
		},
		options: [
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				default: '',
				description: 'Specific account to verify',
			},
			{
				displayName: 'Include Details',
				name: 'includeDetails',
				type: 'boolean',
				default: true,
				description: 'Whether to include detailed verification data',
			},
			{
				displayName: 'Refresh Data',
				name: 'refreshData',
				type: 'boolean',
				default: false,
				description: 'Whether to refresh data before generating report',
			},
		],
	},

	// ----------------------------------
	//         report:risk options
	// ----------------------------------
	{
		displayName: 'Risk Options',
		name: 'riskOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['getRisk'],
			},
		},
		options: [
			{
				displayName: 'Months to Analyze',
				name: 'monthsToAnalyze',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 24,
				},
				default: 3,
				description: 'Number of months of data to analyze',
			},
			{
				displayName: 'Risk Types',
				name: 'riskTypes',
				type: 'multiOptions',
				options: [
					{ name: 'Credit Risk', value: 'CREDIT' },
					{ name: 'Default Risk', value: 'DEFAULT' },
					{ name: 'Gambling', value: 'GAMBLING' },
					{ name: 'Income Stability', value: 'INCOME_STABILITY' },
					{ name: 'Overdraft', value: 'OVERDRAFT' },
				],
				default: ['CREDIT', 'DEFAULT'],
				description: 'Types of risk to assess',
			},
		],
	},

	// ----------------------------------
	//         report:affordability options
	// ----------------------------------
	{
		displayName: 'Affordability Options',
		name: 'affordabilityOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['getAffordability'],
			},
		},
		options: [
			{
				displayName: 'Include Recommendations',
				name: 'includeRecommendations',
				type: 'boolean',
				default: true,
				description: 'Whether to include affordability recommendations',
			},
			{
				displayName: 'Loan Amount',
				name: 'loanAmount',
				type: 'number',
				default: 0,
				description: 'Proposed loan amount to assess',
			},
			{
				displayName: 'Loan Term (Months)',
				name: 'loanTermMonths',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 360,
				},
				default: 12,
				description: 'Proposed loan term in months',
			},
		],
	},

	// ----------------------------------
	//         report:transaction options
	// ----------------------------------
	{
		displayName: 'Transaction Options',
		name: 'transactionOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['report'],
				operation: ['getTransaction'],
			},
		},
		options: [
			{
				displayName: 'Account IDs',
				name: 'accountIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of account IDs',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'End date for transactions',
			},
			{
				displayName: 'Include Categories',
				name: 'includeCategories',
				type: 'boolean',
				default: true,
				description: 'Whether to include category breakdown',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Start date for transactions',
			},
		],
	},
];
