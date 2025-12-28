/**
 * Provider Resource Actions
 * 
 * Provides access to financial institution provider information.
 * Providers are banks and other financial institutions available in Tink.
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { INodeProperties } from 'n8n-workflow';

export const providerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['provider'],
			},
		},
		options: [
			{
				name: 'Get Providers',
				value: 'getProviders',
				description: 'Get all available providers',
				action: 'Get all providers',
			},
			{
				name: 'Get Provider',
				value: 'getProvider',
				description: 'Get a specific provider by ID',
				action: 'Get a provider',
			},
			{
				name: 'Get Providers by Market',
				value: 'getProvidersByMarket',
				description: 'Get providers available in a specific market',
				action: 'Get providers by market',
			},
			{
				name: 'Get Provider Capabilities',
				value: 'getProviderCapabilities',
				description: 'Get capabilities of a provider',
				action: 'Get provider capabilities',
			},
			{
				name: 'Search Providers',
				value: 'searchProviders',
				description: 'Search for providers by name',
				action: 'Search providers',
			},
			{
				name: 'Get Financial Institutions',
				value: 'getFinancialInstitutions',
				description: 'Get financial institutions list',
				action: 'Get financial institutions',
			},
			{
				name: 'Get Provider Fields',
				value: 'getProviderFields',
				description: 'Get required fields for a provider',
				action: 'Get provider fields',
			},
		],
		default: 'getProviders',
	},
];

export const providerFields: INodeProperties[] = [
	// Provider ID
	{
		displayName: 'Provider ID',
		name: 'providerId',
		type: 'string',
		required: true,
		default: '',
		description: 'The provider ID',
		displayOptions: {
			show: {
				resource: ['provider'],
				operation: ['getProvider', 'getProviderCapabilities', 'getProviderFields'],
			},
		},
	},
	// Market
	{
		displayName: 'Market',
		name: 'market',
		type: 'options',
		options: [
			{ name: 'Austria (AT)', value: 'AT' },
			{ name: 'Belgium (BE)', value: 'BE' },
			{ name: 'Denmark (DK)', value: 'DK' },
			{ name: 'Estonia (EE)', value: 'EE' },
			{ name: 'Finland (FI)', value: 'FI' },
			{ name: 'France (FR)', value: 'FR' },
			{ name: 'Germany (DE)', value: 'DE' },
			{ name: 'Ireland (IE)', value: 'IE' },
			{ name: 'Italy (IT)', value: 'IT' },
			{ name: 'Latvia (LV)', value: 'LV' },
			{ name: 'Lithuania (LT)', value: 'LT' },
			{ name: 'Netherlands (NL)', value: 'NL' },
			{ name: 'Norway (NO)', value: 'NO' },
			{ name: 'Poland (PL)', value: 'PL' },
			{ name: 'Portugal (PT)', value: 'PT' },
			{ name: 'Spain (ES)', value: 'ES' },
			{ name: 'Sweden (SE)', value: 'SE' },
			{ name: 'United Kingdom (GB)', value: 'GB' },
		],
		required: true,
		default: 'GB',
		description: 'The market to get providers for',
		displayOptions: {
			show: {
				resource: ['provider'],
				operation: ['getProvidersByMarket'],
			},
		},
	},
	// Search query
	{
		displayName: 'Search Query',
		name: 'searchQuery',
		type: 'string',
		required: true,
		default: '',
		description: 'The search term',
		displayOptions: {
			show: {
				resource: ['provider'],
				operation: ['searchProviders'],
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
				resource: ['provider'],
				operation: ['getProviders', 'getProvidersByMarket', 'searchProviders', 'getFinancialInstitutions'],
			},
		},
		options: [
			{
				displayName: 'Include Disabled',
				name: 'includeDisabled',
				type: 'boolean',
				default: false,
				description: 'Whether to include disabled providers',
			},
			{
				displayName: 'Capability Filter',
				name: 'capability',
				type: 'multiOptions',
				options: [
					{ name: 'Transfers', value: 'TRANSFERS' },
					{ name: 'Payments', value: 'PAYMENTS' },
					{ name: 'Mortgage Aggregation', value: 'MORTGAGE_AGGREGATION' },
					{ name: 'Checking Accounts', value: 'CHECKING_ACCOUNTS' },
					{ name: 'Savings Accounts', value: 'SAVINGS_ACCOUNTS' },
					{ name: 'Credit Cards', value: 'CREDIT_CARDS' },
					{ name: 'Investments', value: 'INVESTMENTS' },
					{ name: 'Loans', value: 'LOANS' },
					{ name: 'Identity Data', value: 'IDENTITY_DATA' },
				],
				default: [],
				description: 'Filter by provider capabilities',
			},
			{
				displayName: 'Access Type',
				name: 'accessType',
				type: 'options',
				options: [
					{ name: 'All', value: 'ALL' },
					{ name: 'Open Banking', value: 'OPEN_BANKING' },
					{ name: 'Other', value: 'OTHER' },
				],
				default: 'ALL',
				description: 'Filter by access type (PSD2 Open Banking vs other)',
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				default: 100,
				description: 'Maximum number of providers to return',
			},
		],
	},
];
