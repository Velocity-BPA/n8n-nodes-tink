/**
 * Enrichment Resource
 * 
 * Transaction enrichment with merchant info and categorization
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { INodeProperties } from 'n8n-workflow';

export const enrichmentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['enrichment'],
			},
		},
		options: [
			{
				name: 'Enrich Transactions',
				value: 'enrichTransactions',
				description: 'Enrich transactions with additional data',
				action: 'Enrich transactions',
			},
			{
				name: 'Get Category Suggestions',
				value: 'getCategorySuggestions',
				description: 'Get category suggestions for a transaction',
				action: 'Get category suggestions',
			},
			{
				name: 'Get Enriched Transactions',
				value: 'getEnrichedTransactions',
				description: 'Get previously enriched transactions',
				action: 'Get enriched transactions',
			},
			{
				name: 'Get Enrichment',
				value: 'getEnrichment',
				description: 'Get enrichment status for a batch',
				action: 'Get enrichment status',
			},
			{
				name: 'Get Merchant Info',
				value: 'getMerchantInfo',
				description: 'Get merchant information',
				action: 'Get merchant info',
			},
		],
		default: 'enrichTransactions',
	},
];

export const enrichmentFields: INodeProperties[] = [
	// ----------------------------------
	//         enrichment:enrichTransactions
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['enrichment'],
				operation: ['enrichTransactions', 'getEnrichedTransactions'],
			},
		},
		default: '',
		description: 'The ID of the user',
	},
	{
		displayName: 'Transaction IDs',
		name: 'transactionIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['enrichment'],
				operation: ['enrichTransactions'],
			},
		},
		default: '',
		description: 'Comma-separated list of transaction IDs to enrich',
	},
	{
		displayName: 'Enrichment Options',
		name: 'enrichmentOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['enrichment'],
				operation: ['enrichTransactions'],
			},
		},
		options: [
			{
				displayName: 'Include Categories',
				name: 'includeCategories',
				type: 'boolean',
				default: true,
				description: 'Whether to include category enrichment',
			},
			{
				displayName: 'Include Merchant',
				name: 'includeMerchant',
				type: 'boolean',
				default: true,
				description: 'Whether to include merchant enrichment',
			},
			{
				displayName: 'Include Payment Type',
				name: 'includePaymentType',
				type: 'boolean',
				default: true,
				description: 'Whether to include payment type detection',
			},
			{
				displayName: 'Include Recurring',
				name: 'includeRecurring',
				type: 'boolean',
				default: true,
				description: 'Whether to detect recurring transactions',
			},
		],
	},

	// ----------------------------------
	//         enrichment:getEnrichment
	// ----------------------------------
	{
		displayName: 'Enrichment ID',
		name: 'enrichmentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['enrichment'],
				operation: ['getEnrichment'],
			},
		},
		default: '',
		description: 'The ID of the enrichment batch',
	},

	// ----------------------------------
	//         enrichment:getMerchantInfo
	// ----------------------------------
	{
		displayName: 'Merchant Query',
		name: 'merchantQuery',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['enrichment'],
				operation: ['getMerchantInfo'],
			},
		},
		default: '',
		description: 'Merchant name or description to look up',
	},
	{
		displayName: 'Merchant Options',
		name: 'merchantOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['enrichment'],
				operation: ['getMerchantInfo'],
			},
		},
		options: [
			{
				displayName: 'Include Logo',
				name: 'includeLogo',
				type: 'boolean',
				default: true,
				description: 'Whether to include merchant logo URL',
			},
			{
				displayName: 'Market',
				name: 'market',
				type: 'string',
				default: '',
				description: 'Market code for localized merchant data',
			},
		],
	},

	// ----------------------------------
	//         enrichment:getCategorySuggestions
	// ----------------------------------
	{
		displayName: 'Transaction Description',
		name: 'transactionDescription',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['enrichment'],
				operation: ['getCategorySuggestions'],
			},
		},
		default: '',
		description: 'Transaction description to categorize',
	},
	{
		displayName: 'Category Options',
		name: 'categoryOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['enrichment'],
				operation: ['getCategorySuggestions'],
			},
		},
		options: [
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				default: 0,
				description: 'Transaction amount for better categorization',
			},
			{
				displayName: 'Max Suggestions',
				name: 'maxSuggestions',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 10,
				},
				default: 3,
				description: 'Maximum number of category suggestions',
			},
			{
				displayName: 'Transaction Type',
				name: 'transactionType',
				type: 'options',
				options: [
					{ name: 'Credit', value: 'CREDIT' },
					{ name: 'Debit', value: 'DEBIT' },
				],
				default: 'DEBIT',
				description: 'Type of transaction',
			},
		],
	},

	// ----------------------------------
	//         enrichment:getEnrichedTransactions
	// ----------------------------------
	{
		displayName: 'Transaction Filters',
		name: 'transactionFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['enrichment'],
				operation: ['getEnrichedTransactions'],
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
				displayName: 'Category Code',
				name: 'categoryCode',
				type: 'string',
				default: '',
				description: 'Filter by category code',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'End date filter',
			},
			{
				displayName: 'Merchant Name',
				name: 'merchantName',
				type: 'string',
				default: '',
				description: 'Filter by merchant name',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Start date filter',
			},
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['enrichment'],
				operation: ['getEnrichedTransactions'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['enrichment'],
				operation: ['getEnrichedTransactions'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		default: 100,
		description: 'Max number of results to return',
	},
];
