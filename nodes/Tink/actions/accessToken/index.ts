/**
 * Access Token Resource
 * 
 * OAuth token management for Tink API access
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { INodeProperties } from 'n8n-workflow';

export const accessTokenOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['accessToken'],
			},
		},
		options: [
			{
				name: 'Get Access Token',
				value: 'getAccessToken',
				description: 'Get a new access token',
				action: 'Get access token',
			},
			{
				name: 'Get Client Access Token',
				value: 'getClientAccessToken',
				description: 'Get a client-level access token',
				action: 'Get client access token',
			},
			{
				name: 'Get Token Info',
				value: 'getTokenInfo',
				description: 'Get information about a token',
				action: 'Get token info',
			},
			{
				name: 'Get User Access Token',
				value: 'getUserAccessToken',
				description: 'Get a user-level access token',
				action: 'Get user access token',
			},
			{
				name: 'Refresh Token',
				value: 'refreshToken',
				description: 'Refresh an access token',
				action: 'Refresh token',
			},
			{
				name: 'Revoke Token',
				value: 'revokeToken',
				description: 'Revoke an access token',
				action: 'Revoke token',
			},
		],
		default: 'getAccessToken',
	},
];

export const accessTokenFields: INodeProperties[] = [
	// ----------------------------------
	//         accessToken:getAccessToken
	// ----------------------------------
	{
		displayName: 'Grant Type',
		name: 'grantType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['accessToken'],
				operation: ['getAccessToken'],
			},
		},
		options: [
			{ name: 'Authorization Code', value: 'authorization_code' },
			{ name: 'Client Credentials', value: 'client_credentials' },
			{ name: 'Refresh Token', value: 'refresh_token' },
		],
		default: 'client_credentials',
		description: 'OAuth grant type',
	},
	{
		displayName: 'Authorization Code',
		name: 'authorizationCode',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['accessToken'],
				operation: ['getAccessToken'],
				grantType: ['authorization_code'],
			},
		},
		default: '',
		description: 'The authorization code from OAuth callback',
	},
	{
		displayName: 'Refresh Token',
		name: 'refreshTokenValue',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['accessToken'],
				operation: ['getAccessToken'],
				grantType: ['refresh_token'],
			},
		},
		default: '',
		description: 'The refresh token to exchange',
	},
	{
		displayName: 'Scopes',
		name: 'scopes',
		type: 'multiOptions',
		displayOptions: {
			show: {
				resource: ['accessToken'],
				operation: ['getAccessToken', 'getClientAccessToken'],
			},
		},
		options: [
			{ name: 'Accounts:Read', value: 'accounts:read' },
			{ name: 'Authorization:Grant', value: 'authorization:grant' },
			{ name: 'Authorization:Read', value: 'authorization:read' },
			{ name: 'Balances:Read', value: 'balances:read' },
			{ name: 'Credentials:Read', value: 'credentials:read' },
			{ name: 'Credentials:Refresh', value: 'credentials:refresh' },
			{ name: 'Credentials:Write', value: 'credentials:write' },
			{ name: 'Identity:Read', value: 'identity:read' },
			{ name: 'Payment:Read', value: 'payment:read' },
			{ name: 'Payment:Write', value: 'payment:write' },
			{ name: 'Providers:Read', value: 'providers:read' },
			{ name: 'Transactions:Read', value: 'transactions:read' },
			{ name: 'Transfer:Execute', value: 'transfer:execute' },
			{ name: 'Transfer:Read', value: 'transfer:read' },
			{ name: 'User:Create', value: 'user:create' },
			{ name: 'User:Delete', value: 'user:delete' },
			{ name: 'User:Read', value: 'user:read' },
			{ name: 'User:Write', value: 'user:write' },
			{ name: 'Webhooks:Read', value: 'webhooks:read' },
			{ name: 'Webhooks:Write', value: 'webhooks:write' },
		],
		default: [],
		description: 'OAuth scopes to request',
	},

	// ----------------------------------
	//         accessToken:getUserAccessToken
	// ----------------------------------
	{
		displayName: 'External User ID',
		name: 'externalUserId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['accessToken'],
				operation: ['getUserAccessToken'],
			},
		},
		default: '',
		description: 'The external user ID',
	},
	{
		displayName: 'User Scopes',
		name: 'userScopes',
		type: 'multiOptions',
		required: true,
		displayOptions: {
			show: {
				resource: ['accessToken'],
				operation: ['getUserAccessToken'],
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
		description: 'OAuth scopes for the user token',
	},

	// ----------------------------------
	//         accessToken:refreshToken
	// ----------------------------------
	{
		displayName: 'Refresh Token',
		name: 'refreshToken',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['accessToken'],
				operation: ['refreshToken'],
			},
		},
		default: '',
		description: 'The refresh token to use',
	},

	// ----------------------------------
	//         accessToken:revokeToken
	// ----------------------------------
	{
		displayName: 'Token',
		name: 'token',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['accessToken'],
				operation: ['revokeToken', 'getTokenInfo'],
			},
		},
		default: '',
		description: 'The token to revoke or inspect',
	},
	{
		displayName: 'Token Type Hint',
		name: 'tokenTypeHint',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['accessToken'],
				operation: ['revokeToken'],
			},
		},
		options: [
			{ name: 'Access Token', value: 'access_token' },
			{ name: 'Refresh Token', value: 'refresh_token' },
		],
		default: 'access_token',
		description: 'Type of token being revoked',
	},
];
