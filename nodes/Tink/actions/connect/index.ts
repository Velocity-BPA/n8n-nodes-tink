/**
 * Connect Resource (Tink Link)
 * 
 * Manage Tink Link sessions for bank connections
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { INodeProperties } from 'n8n-workflow';

export const connectOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['connect'],
			},
		},
		options: [
			{
				name: 'Create Session',
				value: 'createSession',
				description: 'Create a new Tink Link session',
				action: 'Create a connect session',
			},
			{
				name: 'Exchange Grant',
				value: 'exchangeGrant',
				description: 'Exchange authorization grant for tokens',
				action: 'Exchange grant for token',
			},
			{
				name: 'Get Authorization Grant',
				value: 'getAuthorizationGrant',
				description: 'Get an authorization grant for a user',
				action: 'Get authorization grant',
			},
			{
				name: 'Get Connect URL',
				value: 'getConnectUrl',
				description: 'Get the Tink Link URL for a session',
				action: 'Get connect URL',
			},
			{
				name: 'Get Session Status',
				value: 'getSessionStatus',
				description: 'Get the status of a Tink Link session',
				action: 'Get session status',
			},
		],
		default: 'createSession',
	},
];

export const connectFields: INodeProperties[] = [
	// ----------------------------------
	//         connect:createSession
	// ----------------------------------
	{
		displayName: 'External User ID',
		name: 'externalUserId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['connect'],
				operation: ['createSession', 'getAuthorizationGrant'],
			},
		},
		default: '',
		description: 'External user ID for the session',
	},
	{
		displayName: 'Market',
		name: 'market',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['connect'],
				operation: ['createSession'],
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
		description: 'The market for bank connections',
	},
	{
		displayName: 'Locale',
		name: 'locale',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['connect'],
				operation: ['createSession'],
			},
		},
		options: [
			{ name: 'Danish', value: 'da_DK' },
			{ name: 'Dutch', value: 'nl_NL' },
			{ name: 'English (UK)', value: 'en_GB' },
			{ name: 'English (US)', value: 'en_US' },
			{ name: 'Estonian', value: 'et_EE' },
			{ name: 'Finnish', value: 'fi_FI' },
			{ name: 'French', value: 'fr_FR' },
			{ name: 'German', value: 'de_DE' },
			{ name: 'Italian', value: 'it_IT' },
			{ name: 'Latvian', value: 'lv_LV' },
			{ name: 'Lithuanian', value: 'lt_LT' },
			{ name: 'Norwegian', value: 'nb_NO' },
			{ name: 'Polish', value: 'pl_PL' },
			{ name: 'Portuguese', value: 'pt_PT' },
			{ name: 'Spanish', value: 'es_ES' },
			{ name: 'Swedish', value: 'sv_SE' },
		],
		default: 'en_US',
		description: 'The locale for the Tink Link UI',
	},
	{
		displayName: 'Session Options',
		name: 'sessionOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['connect'],
				operation: ['createSession'],
			},
		},
		options: [
			{
				displayName: 'Input Provider',
				name: 'inputProvider',
				type: 'string',
				default: '',
				description: 'Preselect a specific provider',
			},
			{
				displayName: 'Redirect URI',
				name: 'redirectUri',
				type: 'string',
				default: '',
				description: 'Redirect URI after completion',
			},
			{
				displayName: 'Scopes',
				name: 'scopes',
				type: 'multiOptions',
				options: [
					{ name: 'Accounts:Read', value: 'accounts:read' },
					{ name: 'Balances:Read', value: 'balances:read' },
					{ name: 'Credentials:Read', value: 'credentials:read' },
					{ name: 'Credentials:Refresh', value: 'credentials:refresh' },
					{ name: 'Credentials:Write', value: 'credentials:write' },
					{ name: 'Identity:Read', value: 'identity:read' },
					{ name: 'Payment:Read', value: 'payment:read' },
					{ name: 'Payment:Write', value: 'payment:write' },
					{ name: 'Transactions:Read', value: 'transactions:read' },
					{ name: 'Transfer:Execute', value: 'transfer:execute' },
					{ name: 'Transfer:Read', value: 'transfer:read' },
				],
				default: ['accounts:read', 'balances:read', 'transactions:read'],
				description: 'OAuth scopes to request',
			},
			{
				displayName: 'Session Expiry',
				name: 'sessionExpiry',
				type: 'number',
				typeOptions: {
					minValue: 300,
					maxValue: 86400,
				},
				default: 3600,
				description: 'Session expiry in seconds',
			},
			{
				displayName: 'Test Mode',
				name: 'test',
				type: 'boolean',
				default: false,
				description: 'Whether to use test/sandbox mode',
			},
		],
	},

	// ----------------------------------
	//         connect:getConnectUrl
	// ----------------------------------
	{
		displayName: 'Session ID',
		name: 'sessionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['connect'],
				operation: ['getConnectUrl', 'getSessionStatus'],
			},
		},
		default: '',
		description: 'The Tink Link session ID',
	},

	// ----------------------------------
	//         connect:getAuthorizationGrant
	// ----------------------------------
	{
		displayName: 'Scopes',
		name: 'scopes',
		type: 'multiOptions',
		required: true,
		displayOptions: {
			show: {
				resource: ['connect'],
				operation: ['getAuthorizationGrant'],
			},
		},
		options: [
			{ name: 'Accounts:Read', value: 'accounts:read' },
			{ name: 'Balances:Read', value: 'balances:read' },
			{ name: 'Credentials:Read', value: 'credentials:read' },
			{ name: 'Credentials:Refresh', value: 'credentials:refresh' },
			{ name: 'Credentials:Write', value: 'credentials:write' },
			{ name: 'Identity:Read', value: 'identity:read' },
			{ name: 'Payment:Read', value: 'payment:read' },
			{ name: 'Payment:Write', value: 'payment:write' },
			{ name: 'Transactions:Read', value: 'transactions:read' },
			{ name: 'Transfer:Execute', value: 'transfer:execute' },
			{ name: 'Transfer:Read', value: 'transfer:read' },
			{ name: 'User:Read', value: 'user:read' },
		],
		default: ['accounts:read', 'transactions:read'],
		description: 'OAuth scopes for the grant',
	},

	// ----------------------------------
	//         connect:exchangeGrant
	// ----------------------------------
	{
		displayName: 'Code',
		name: 'code',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['connect'],
				operation: ['exchangeGrant'],
			},
		},
		default: '',
		description: 'The authorization code to exchange',
	},
];
