/**
 * Transfer Resource Actions
 * 
 * Provides transfer functionality between accounts.
 * Supports both internal and external transfers.
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { INodeProperties } from 'n8n-workflow';

export const transferOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['transfer'],
			},
		},
		options: [
			{
				name: 'Create Transfer',
				value: 'createTransfer',
				description: 'Create a new transfer',
				action: 'Create a transfer',
			},
			{
				name: 'Get Transfer',
				value: 'getTransfer',
				description: 'Get a transfer by ID',
				action: 'Get a transfer',
			},
			{
				name: 'List Transfers',
				value: 'listTransfers',
				description: 'List all transfers for a user',
				action: 'List transfers',
			},
			{
				name: 'Get Transfer Status',
				value: 'getTransferStatus',
				description: 'Get the status of a transfer',
				action: 'Get transfer status',
			},
			{
				name: 'Get Transfer Accounts',
				value: 'getTransferAccounts',
				description: 'Get accounts available for transfers',
				action: 'Get transfer accounts',
			},
			{
				name: 'Sign Transfer',
				value: 'signTransfer',
				description: 'Sign/authorize a transfer',
				action: 'Sign a transfer',
			},
		],
		default: 'createTransfer',
	},
];

export const transferFields: INodeProperties[] = [
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
				resource: ['transfer'],
			},
		},
	},
	// Transfer ID
	{
		displayName: 'Transfer ID',
		name: 'transferId',
		type: 'string',
		required: true,
		default: '',
		description: 'The transfer ID',
		displayOptions: {
			show: {
				resource: ['transfer'],
				operation: ['getTransfer', 'getTransferStatus', 'signTransfer'],
			},
		},
	},
	// Transfer details for creation
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		required: true,
		default: 0,
		description: 'Transfer amount',
		displayOptions: {
			show: {
				resource: ['transfer'],
				operation: ['createTransfer'],
			},
		},
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'options',
		options: [
			{ name: 'EUR', value: 'EUR' },
			{ name: 'GBP', value: 'GBP' },
			{ name: 'SEK', value: 'SEK' },
			{ name: 'NOK', value: 'NOK' },
			{ name: 'DKK', value: 'DKK' },
			{ name: 'PLN', value: 'PLN' },
		],
		required: true,
		default: 'EUR',
		description: 'Transfer currency',
		displayOptions: {
			show: {
				resource: ['transfer'],
				operation: ['createTransfer'],
			},
		},
	},
	{
		displayName: 'Source Account ID',
		name: 'sourceAccountId',
		type: 'string',
		required: true,
		default: '',
		description: 'Source account ID',
		displayOptions: {
			show: {
				resource: ['transfer'],
				operation: ['createTransfer'],
			},
		},
	},
	{
		displayName: 'Destination Account ID',
		name: 'destinationAccountId',
		type: 'string',
		required: true,
		default: '',
		description: 'Destination account ID (for internal transfers)',
		displayOptions: {
			show: {
				resource: ['transfer'],
				operation: ['createTransfer'],
			},
		},
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		default: '',
		description: 'Transfer message/reference',
		displayOptions: {
			show: {
				resource: ['transfer'],
				operation: ['createTransfer'],
			},
		},
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
				resource: ['transfer'],
				operation: ['createTransfer', 'listTransfers', 'getTransferAccounts'],
			},
		},
		options: [
			{
				displayName: 'Execution Date',
				name: 'executionDate',
				type: 'dateTime',
				default: '',
				description: 'Scheduled execution date',
			},
			{
				displayName: 'Status Filter',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: 'ALL' },
					{ name: 'Created', value: 'CREATED' },
					{ name: 'Pending', value: 'PENDING' },
					{ name: 'Signed', value: 'SIGNED' },
					{ name: 'Executed', value: 'EXECUTED' },
					{ name: 'Failed', value: 'FAILED' },
					{ name: 'Cancelled', value: 'CANCELLED' },
				],
				default: 'ALL',
				description: 'Filter transfers by status',
			},
			{
				displayName: 'Include Disabled',
				name: 'includeDisabled',
				type: 'boolean',
				default: false,
				description: 'Whether to include disabled accounts',
			},
		],
	},
];
