/**
 * Consent Resource
 * 
 * Manage PSD2 consent for user data access
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { INodeProperties } from 'n8n-workflow';

export const consentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['consent'],
			},
		},
		options: [
			{
				name: 'Extend',
				value: 'extend',
				description: 'Extend an existing consent',
				action: 'Extend a consent',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get consent details',
				action: 'Get a consent',
			},
			{
				name: 'Get Sessions',
				value: 'getSessions',
				description: 'Get consent sessions',
				action: 'Get consent sessions',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Get consent status',
				action: 'Get consent status',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all consents',
				action: 'List all consents',
			},
			{
				name: 'Revoke',
				value: 'revoke',
				description: 'Revoke a consent',
				action: 'Revoke a consent',
			},
		],
		default: 'list',
	},
];

export const consentFields: INodeProperties[] = [
	// ----------------------------------
	//         consent:list
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['consent'],
				operation: ['list', 'getSessions'],
			},
		},
		default: '',
		description: 'The ID of the user',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['consent'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Credentials ID',
				name: 'credentialsId',
				type: 'string',
				default: '',
				description: 'Filter by credentials ID',
			},
			{
				displayName: 'Provider ID',
				name: 'providerId',
				type: 'string',
				default: '',
				description: 'Filter by provider ID',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'ACTIVE' },
					{ name: 'Expired', value: 'EXPIRED' },
					{ name: 'Revoked', value: 'REVOKED' },
					{ name: 'Pending', value: 'PENDING' },
				],
				default: 'ACTIVE',
				description: 'Filter by consent status',
			},
		],
	},

	// ----------------------------------
	//         consent:get
	// ----------------------------------
	{
		displayName: 'Consent ID',
		name: 'consentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['consent'],
				operation: ['get', 'getStatus', 'revoke', 'extend'],
			},
		},
		default: '',
		description: 'The ID of the consent',
	},

	// ----------------------------------
	//         consent:extend
	// ----------------------------------
	{
		displayName: 'Extension Days',
		name: 'extensionDays',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['consent'],
				operation: ['extend'],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 90,
		},
		default: 90,
		description: 'Number of days to extend the consent (max 90 per PSD2)',
	},

	// ----------------------------------
	//         consent:revoke
	// ----------------------------------
	{
		displayName: 'Revoke Options',
		name: 'revokeOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['consent'],
				operation: ['revoke'],
			},
		},
		options: [
			{
				displayName: 'Delete Associated Data',
				name: 'deleteData',
				type: 'boolean',
				default: false,
				description: 'Whether to also delete all associated data',
			},
			{
				displayName: 'Reason',
				name: 'reason',
				type: 'string',
				default: '',
				description: 'Reason for revoking the consent',
			},
		],
	},

	// ----------------------------------
	//         consent:list pagination
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['consent'],
				operation: ['list', 'getSessions'],
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
				resource: ['consent'],
				operation: ['list', 'getSessions'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Max number of results to return',
	},
];
