/**
 * Balance Resource Actions
 * 
 * Provides access to account balance information.
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { INodeProperties } from 'n8n-workflow';

export const balanceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['balance'],
			},
		},
		options: [
			{
				name: 'Get Balances',
				value: 'getBalances',
				description: 'Get balances for all accounts',
				action: 'Get all balances',
			},
			{
				name: 'Get Account Balance',
				value: 'getAccountBalance',
				description: 'Get balance for a specific account',
				action: 'Get account balance',
			},
			{
				name: 'Get Balance History',
				value: 'getBalanceHistory',
				description: 'Get historical balance data',
				action: 'Get balance history',
			},
			{
				name: 'Get Available Balance',
				value: 'getAvailableBalance',
				description: 'Get available balance (funds available for use)',
				action: 'Get available balance',
			},
			{
				name: 'Get Booked Balance',
				value: 'getBookedBalance',
				description: 'Get booked balance (confirmed transactions)',
				action: 'Get booked balance',
			},
		],
		default: 'getBalances',
	},
];

export const balanceFields: INodeProperties[] = [
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
				resource: ['balance'],
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
		description: 'The account ID',
		displayOptions: {
			show: {
				resource: ['balance'],
				operation: ['getAccountBalance', 'getBalanceHistory', 'getAvailableBalance', 'getBookedBalance'],
			},
		},
	},
	// History options
	{
		displayName: 'History Options',
		name: 'historyOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['balance'],
				operation: ['getBalanceHistory'],
			},
		},
		options: [
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Start date for history',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'End date for history',
			},
			{
				displayName: 'Resolution',
				name: 'resolution',
				type: 'options',
				options: [
					{ name: 'Daily', value: 'DAILY' },
					{ name: 'Weekly', value: 'WEEKLY' },
					{ name: 'Monthly', value: 'MONTHLY' },
				],
				default: 'DAILY',
				description: 'Time resolution for history data',
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
				resource: ['balance'],
				operation: ['getBalances'],
			},
		},
		options: [
			{
				displayName: 'Account Types',
				name: 'accountTypes',
				type: 'multiOptions',
				options: [
					{ name: 'Checking', value: 'CHECKING' },
					{ name: 'Savings', value: 'SAVINGS' },
					{ name: 'Credit Card', value: 'CREDIT_CARD' },
					{ name: 'Investment', value: 'INVESTMENT' },
					{ name: 'Loan', value: 'LOAN' },
				],
				default: [],
				description: 'Filter by account types',
			},
			{
				displayName: 'Include Account Details',
				name: 'includeAccountDetails',
				type: 'boolean',
				default: false,
				description: 'Whether to include account details with balances',
			},
		],
	},
];
