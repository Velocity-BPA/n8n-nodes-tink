/**
 * Account Resource Actions
 * 
 * Provides access to aggregated bank accounts from connected financial institutions.
 * Supports PSD2 AIS (Account Information Service) functionality.
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { INodeProperties } from 'n8n-workflow';

export const accountOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['account'],
			},
		},
		options: [
			{
				name: 'Get Accounts',
				value: 'getAccounts',
				description: 'Get all accounts for a user',
				action: 'Get all accounts',
			},
			{
				name: 'Get Account',
				value: 'getAccount',
				description: 'Get a specific account by ID',
				action: 'Get an account',
			},
			{
				name: 'Get Account Balances',
				value: 'getAccountBalances',
				description: 'Get balances for a specific account',
				action: 'Get account balances',
			},
			{
				name: 'Get Accounts by Type',
				value: 'getAccountsByType',
				description: 'Get accounts filtered by type',
				action: 'Get accounts by type',
			},
			{
				name: 'Get Checking Accounts',
				value: 'getCheckingAccounts',
				description: 'Get all checking/current accounts',
				action: 'Get checking accounts',
			},
			{
				name: 'Get Savings Accounts',
				value: 'getSavingsAccounts',
				description: 'Get all savings accounts',
				action: 'Get savings accounts',
			},
			{
				name: 'Get Credit Cards',
				value: 'getCreditCards',
				description: 'Get all credit card accounts',
				action: 'Get credit cards',
			},
			{
				name: 'Get Investment Accounts',
				value: 'getInvestmentAccounts',
				description: 'Get all investment accounts',
				action: 'Get investment accounts',
			},
			{
				name: 'Get Loan Accounts',
				value: 'getLoanAccounts',
				description: 'Get all loan accounts',
				action: 'Get loan accounts',
			},
		],
		default: 'getAccounts',
	},
];

export const accountFields: INodeProperties[] = [
	// User ID field - required for all operations
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		description: 'The Tink user ID (permanent or external)',
		displayOptions: {
			show: {
				resource: ['account'],
			},
		},
	},
	// Account ID for single account operations
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		description: 'The account ID to retrieve',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getAccount', 'getAccountBalances'],
			},
		},
	},
	// Account type filter
	{
		displayName: 'Account Type',
		name: 'accountType',
		type: 'options',
		options: [
			{ name: 'Checking', value: 'CHECKING' },
			{ name: 'Savings', value: 'SAVINGS' },
			{ name: 'Credit Card', value: 'CREDIT_CARD' },
			{ name: 'Investment', value: 'INVESTMENT' },
			{ name: 'Loan', value: 'LOAN' },
			{ name: 'Mortgage', value: 'MORTGAGE' },
			{ name: 'Pension', value: 'PENSION' },
			{ name: 'External', value: 'EXTERNAL' },
			{ name: 'Other', value: 'OTHER' },
		],
		default: 'CHECKING',
		description: 'The type of accounts to retrieve',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getAccountsByType'],
			},
		},
	},
	// Additional options
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getAccounts', 'getAccountsByType', 'getCheckingAccounts', 'getSavingsAccounts', 'getCreditCards', 'getInvestmentAccounts', 'getLoanAccounts'],
			},
		},
		options: [
			{
				displayName: 'Include Details',
				name: 'includeDetails',
				type: 'boolean',
				default: true,
				description: 'Whether to include full account details',
			},
			{
				displayName: 'Include Balances',
				name: 'includeBalances',
				type: 'boolean',
				default: false,
				description: 'Whether to include balance information',
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				default: 100,
				description: 'Maximum number of accounts to return',
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
