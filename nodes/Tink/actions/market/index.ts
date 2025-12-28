/**
 * Market Resource
 * 
 * Query available markets and their capabilities
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { INodeProperties } from 'n8n-workflow';

export const marketOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['market'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get details for a specific market',
				action: 'Get a market',
			},
			{
				name: 'Get Currencies',
				value: 'getCurrencies',
				description: 'Get currencies for a market',
				action: 'Get market currencies',
			},
			{
				name: 'Get Providers',
				value: 'getProviders',
				description: 'Get providers in a market',
				action: 'Get market providers',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all available markets',
				action: 'List all markets',
			},
		],
		default: 'list',
	},
];

export const marketFields: INodeProperties[] = [
	// ----------------------------------
	//         market:get
	// ----------------------------------
	{
		displayName: 'Market',
		name: 'market',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['market'],
				operation: ['get', 'getCurrencies', 'getProviders'],
			},
		},
		options: [
			{ name: 'Austria', value: 'AT' },
			{ name: 'Belgium', value: 'BE' },
			{ name: 'Denmark', value: 'DK' },
			{ name: 'Estonia', value: 'EE' },
			{ name: 'Finland', value: 'FI' },
			{ name: 'France', value: 'FR' },
			{ name: 'Germany', value: 'DE' },
			{ name: 'Ireland', value: 'IE' },
			{ name: 'Italy', value: 'IT' },
			{ name: 'Latvia', value: 'LV' },
			{ name: 'Lithuania', value: 'LT' },
			{ name: 'Netherlands', value: 'NL' },
			{ name: 'Norway', value: 'NO' },
			{ name: 'Poland', value: 'PL' },
			{ name: 'Portugal', value: 'PT' },
			{ name: 'Spain', value: 'ES' },
			{ name: 'Sweden', value: 'SE' },
			{ name: 'United Kingdom', value: 'GB' },
		],
		default: 'SE',
		description: 'The market code (ISO 3166-1 alpha-2)',
	},

	// ----------------------------------
	//         market:getProviders
	// ----------------------------------
	{
		displayName: 'Provider Options',
		name: 'providerOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['market'],
				operation: ['getProviders'],
			},
		},
		options: [
			{
				displayName: 'Capability',
				name: 'capability',
				type: 'multiOptions',
				options: [
					{ name: 'Accounts', value: 'ACCOUNTS' },
					{ name: 'Identity', value: 'IDENTITY' },
					{ name: 'Payments', value: 'PAYMENTS' },
					{ name: 'Transfers', value: 'TRANSFERS' },
				],
				default: [],
				description: 'Filter by provider capabilities',
			},
			{
				displayName: 'Include Test Providers',
				name: 'includeTestProviders',
				type: 'boolean',
				default: false,
				description: 'Whether to include test/sandbox providers',
			},
			{
				displayName: 'Provider Type',
				name: 'providerType',
				type: 'options',
				options: [
					{ name: 'All', value: 'ALL' },
					{ name: 'Bank', value: 'BANK' },
					{ name: 'Credit Card', value: 'CREDIT_CARD' },
					{ name: 'Other', value: 'OTHER' },
				],
				default: 'ALL',
				description: 'Filter by provider type',
			},
		],
	},

	// ----------------------------------
	//         market:list filters
	// ----------------------------------
	{
		displayName: 'List Options',
		name: 'listOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['market'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Include Capabilities',
				name: 'includeCapabilities',
				type: 'boolean',
				default: true,
				description: 'Whether to include capability information',
			},
			{
				displayName: 'Only PSD2',
				name: 'onlyPsd2',
				type: 'boolean',
				default: false,
				description: 'Whether to only include PSD2-enabled markets',
			},
		],
	},

	// ----------------------------------
	//         pagination
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['market'],
				operation: ['getProviders'],
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
				resource: ['market'],
				operation: ['getProviders'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 500,
		},
		default: 100,
		description: 'Max number of results to return',
	},
];
