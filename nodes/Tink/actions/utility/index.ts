/**
 * Utility Resource - Operations and Field Definitions
 * Provides API utility functions, validation, and system status
 *
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { INodeProperties } from 'n8n-workflow';

export const operations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['utility'],
			},
		},
		options: [
			{
				name: 'Get API Status',
				value: 'getApiStatus',
				description: 'Get the current status of the Tink API',
				action: 'Get API status',
			},
			{
				name: 'Get Supported Currencies',
				value: 'getSupportedCurrencies',
				description: 'Get list of currencies supported by Tink',
				action: 'Get supported currencies',
			},
			{
				name: 'Get Supported Markets',
				value: 'getSupportedMarkets',
				description: 'Get list of markets (countries) supported by Tink',
				action: 'Get supported markets',
			},
			{
				name: 'Test Connection',
				value: 'testConnection',
				description: 'Test the connection to Tink API',
				action: 'Test connection',
			},
			{
				name: 'Validate IBAN',
				value: 'validateIban',
				description: 'Validate an IBAN number format',
				action: 'Validate IBAN',
			},
		],
		default: 'testConnection',
	},
];

export const fields: INodeProperties[] = [
	// ----------------------------------
	//         utility: validateIban
	// ----------------------------------
	{
		displayName: 'IBAN',
		name: 'iban',
		type: 'string',
		required: true,
		default: '',
		description: 'The IBAN number to validate',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['validateIban'],
			},
		},
		placeholder: 'DE89370400440532013000',
	},

	// ----------------------------------
	//         utility: getApiStatus
	// ----------------------------------
	{
		displayName: 'Include Details',
		name: 'includeDetails',
		type: 'boolean',
		default: false,
		description: 'Whether to include detailed service status for each API endpoint',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['getApiStatus'],
			},
		},
	},

	// ----------------------------------
	//         utility: getSupportedMarkets
	// ----------------------------------
	{
		displayName: 'Additional Options',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['getSupportedMarkets'],
			},
		},
		options: [
			{
				displayName: 'Include Provider Count',
				name: 'includeProviderCount',
				type: 'boolean',
				default: false,
				description: 'Whether to include the number of providers per market',
			},
			{
				displayName: 'Include PSD2 Status',
				name: 'includePsd2Status',
				type: 'boolean',
				default: true,
				description: 'Whether to include PSD2 compliance status for each market',
			},
			{
				displayName: 'Capability Filter',
				name: 'capability',
				type: 'options',
				default: '',
				description: 'Filter markets by capability',
				options: [
					{
						name: 'All',
						value: '',
					},
					{
						name: 'Accounts',
						value: 'ACCOUNTS',
					},
					{
						name: 'Identity',
						value: 'IDENTITY',
					},
					{
						name: 'Payments',
						value: 'PAYMENTS',
					},
					{
						name: 'Transfers',
						value: 'TRANSFERS',
					},
				],
			},
		],
	},

	// ----------------------------------
	//         utility: getSupportedCurrencies
	// ----------------------------------
	{
		displayName: 'Market Code',
		name: 'marketCode',
		type: 'string',
		default: '',
		description: 'Optional market code to filter currencies (e.g., GB, DE, SE)',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['getSupportedCurrencies'],
			},
		},
		placeholder: 'SE',
	},

	// ----------------------------------
	//         utility: testConnection
	// ----------------------------------
	{
		displayName: 'Test Type',
		name: 'testType',
		type: 'options',
		default: 'basic',
		description: 'Type of connection test to perform',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['testConnection'],
			},
		},
		options: [
			{
				name: 'Basic (Connectivity Only)',
				value: 'basic',
				description: 'Test basic API connectivity',
			},
			{
				name: 'Authentication',
				value: 'auth',
				description: 'Test authentication with credentials',
			},
			{
				name: 'Full (All Services)',
				value: 'full',
				description: 'Test connectivity to all major services',
			},
		],
	},
];
