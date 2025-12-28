/**
 * Transaction Resource Actions
 * 
 * Provides access to transaction data from connected bank accounts.
 * Supports enrichment, categorization, and search functionality.
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { INodeProperties } from 'n8n-workflow';

export const transactionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
			},
		},
		options: [
			{
				name: 'Get Transactions',
				value: 'getTransactions',
				description: 'Get all transactions for a user',
				action: 'Get all transactions',
			},
			{
				name: 'Get Transaction',
				value: 'getTransaction',
				description: 'Get a specific transaction by ID',
				action: 'Get a transaction',
			},
			{
				name: 'Search Transactions',
				value: 'searchTransactions',
				description: 'Search transactions with filters',
				action: 'Search transactions',
			},
			{
				name: 'Get Transactions by Account',
				value: 'getTransactionsByAccount',
				description: 'Get transactions for a specific account',
				action: 'Get transactions by account',
			},
			{
				name: 'Get Transactions by Date',
				value: 'getTransactionsByDate',
				description: 'Get transactions within a date range',
				action: 'Get transactions by date',
			},
			{
				name: 'Get Pending Transactions',
				value: 'getPendingTransactions',
				description: 'Get pending (unbooked) transactions',
				action: 'Get pending transactions',
			},
			{
				name: 'Get Transaction Categories',
				value: 'getTransactionCategories',
				description: 'Get category breakdown for transactions',
				action: 'Get transaction categories',
			},
			{
				name: 'Categorize Transaction',
				value: 'categorizeTransaction',
				description: 'Update the category of a transaction',
				action: 'Categorize a transaction',
			},
			{
				name: 'Get Similar Transactions',
				value: 'getSimilarTransactions',
				description: 'Find similar transactions',
				action: 'Get similar transactions',
			},
		],
		default: 'getTransactions',
	},
];

export const transactionFields: INodeProperties[] = [
	// User ID field
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		description: 'The Tink user ID',
		displayOptions: {
			show: {
				resource: ['transaction'],
			},
		},
	},
	// Transaction ID
	{
		displayName: 'Transaction ID',
		name: 'transactionId',
		type: 'string',
		required: true,
		default: '',
		description: 'The transaction ID',
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['getTransaction', 'categorizeTransaction', 'getSimilarTransactions'],
			},
		},
	},
	// Account ID
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		description: 'The account ID to filter transactions',
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['getTransactionsByAccount'],
			},
		},
	},
	// Date range fields
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		default: '',
		description: 'Start date for transaction search',
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['getTransactionsByDate'],
			},
		},
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		required: true,
		default: '',
		description: 'End date for transaction search',
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['getTransactionsByDate'],
			},
		},
	},
	// Category for categorization
	{
		displayName: 'Category Code',
		name: 'categoryCode',
		type: 'string',
		required: true,
		default: '',
		description: 'The category code to assign to the transaction',
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['categorizeTransaction'],
			},
		},
	},
	// Search options
	{
		displayName: 'Search Query',
		name: 'searchQuery',
		type: 'string',
		default: '',
		description: 'Text to search for in transactions',
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['searchTransactions'],
			},
		},
	},
	// Filters
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['getTransactions', 'searchTransactions', 'getTransactionsByAccount'],
			},
		},
		options: [
			{
				displayName: 'Account IDs',
				name: 'accountIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of account IDs to filter by',
			},
			{
				displayName: 'Categories',
				name: 'categories',
				type: 'string',
				default: '',
				description: 'Comma-separated list of category codes to filter by',
			},
			{
				displayName: 'Min Amount',
				name: 'minAmount',
				type: 'number',
				default: 0,
				description: 'Minimum transaction amount',
			},
			{
				displayName: 'Max Amount',
				name: 'maxAmount',
				type: 'number',
				default: 0,
				description: 'Maximum transaction amount',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Filter transactions from this date',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'Filter transactions until this date',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: 'ALL' },
					{ name: 'Booked', value: 'BOOKED' },
					{ name: 'Pending', value: 'PENDING' },
				],
				default: 'ALL',
				description: 'Transaction status filter',
			},
		],
	},
	// Options
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['transaction'],
			},
		},
		options: [
			{
				displayName: 'Include Enrichment',
				name: 'includeEnrichment',
				type: 'boolean',
				default: true,
				description: 'Whether to include enriched transaction data',
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				default: 100,
				description: 'Maximum number of transactions to return',
			},
			{
				displayName: 'Page Token',
				name: 'pageToken',
				type: 'string',
				default: '',
				description: 'Token for pagination',
			},
		],
	},
];
