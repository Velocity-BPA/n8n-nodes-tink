/**
 * Credentials Resource Actions
 * 
 * Manages bank credentials (connections to financial institutions).
 * In Tink terminology, "credentials" refers to a user's bank connection.
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { INodeProperties } from 'n8n-workflow';

export const credentialsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['credentials'],
			},
		},
		options: [
			{
				name: 'Create Credentials',
				value: 'createCredentials',
				description: 'Create a new bank connection',
				action: 'Create credentials',
			},
			{
				name: 'Get Credentials',
				value: 'getCredentials',
				description: 'Get a specific credentials by ID',
				action: 'Get credentials',
			},
			{
				name: 'Update Credentials',
				value: 'updateCredentials',
				description: 'Update existing credentials',
				action: 'Update credentials',
			},
			{
				name: 'Delete Credentials',
				value: 'deleteCredentials',
				description: 'Delete credentials',
				action: 'Delete credentials',
			},
			{
				name: 'List Credentials',
				value: 'listCredentials',
				description: 'List all credentials for a user',
				action: 'List credentials',
			},
			{
				name: 'Refresh Credentials',
				value: 'refreshCredentials',
				description: 'Trigger a credentials refresh',
				action: 'Refresh credentials',
			},
			{
				name: 'Get Provider Credentials',
				value: 'getProviderCredentials',
				description: 'Get credentials for a specific provider',
				action: 'Get provider credentials',
			},
			{
				name: 'Authenticate Credentials',
				value: 'authenticateCredentials',
				description: 'Initiate authentication for credentials',
				action: 'Authenticate credentials',
			},
			{
				name: 'Get Third Party Callback',
				value: 'getThirdPartyCallback',
				description: 'Get third party callback data',
				action: 'Get third party callback',
			},
			{
				name: 'Supplemental Information',
				value: 'supplementalInformation',
				description: 'Provide supplemental information for authentication',
				action: 'Provide supplemental information',
			},
		],
		default: 'listCredentials',
	},
];

export const credentialsFields: INodeProperties[] = [
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
				resource: ['credentials'],
			},
		},
	},
	// Credentials ID
	{
		displayName: 'Credentials ID',
		name: 'credentialsId',
		type: 'string',
		required: true,
		default: '',
		description: 'The credentials ID',
		displayOptions: {
			show: {
				resource: ['credentials'],
				operation: ['getCredentials', 'updateCredentials', 'deleteCredentials', 'refreshCredentials', 'authenticateCredentials', 'getThirdPartyCallback', 'supplementalInformation'],
			},
		},
	},
	// Provider ID
	{
		displayName: 'Provider ID',
		name: 'providerId',
		type: 'string',
		required: true,
		default: '',
		description: 'The financial institution provider ID',
		displayOptions: {
			show: {
				resource: ['credentials'],
				operation: ['createCredentials', 'getProviderCredentials'],
			},
		},
	},
	// Supplemental fields
	{
		displayName: 'Supplemental Fields',
		name: 'supplementalFields',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		description: 'Additional fields required for authentication',
		displayOptions: {
			show: {
				resource: ['credentials'],
				operation: ['supplementalInformation'],
			},
		},
		options: [
			{
				displayName: 'Fields',
				name: 'fields',
				values: [
					{
						displayName: 'Field Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'The field name',
					},
					{
						displayName: 'Field Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'The field value',
					},
				],
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
				resource: ['credentials'],
				operation: ['listCredentials', 'refreshCredentials'],
			},
		},
		options: [
			{
				displayName: 'Include Accounts',
				name: 'includeAccounts',
				type: 'boolean',
				default: false,
				description: 'Whether to include account information',
			},
			{
				displayName: 'Filter by Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: 'ALL' },
					{ name: 'Created', value: 'CREATED' },
					{ name: 'Authenticating', value: 'AUTHENTICATING' },
					{ name: 'Awaiting Mobile Bank ID', value: 'AWAITING_MOBILE_BANKID_AUTHENTICATION' },
					{ name: 'Awaiting Supplemental', value: 'AWAITING_SUPPLEMENTAL_INFORMATION' },
					{ name: 'Awaiting Third Party', value: 'AWAITING_THIRD_PARTY_APP_AUTHENTICATION' },
					{ name: 'Updating', value: 'UPDATING' },
					{ name: 'Updated', value: 'UPDATED' },
					{ name: 'Authentication Error', value: 'AUTHENTICATION_ERROR' },
					{ name: 'Temporary Error', value: 'TEMPORARY_ERROR' },
					{ name: 'Permanent Error', value: 'PERMANENT_ERROR' },
					{ name: 'Session Expired', value: 'SESSION_EXPIRED' },
					{ name: 'Disabled', value: 'DISABLED' },
				],
				default: 'ALL',
				description: 'Filter credentials by status',
			},
		],
	},
];
