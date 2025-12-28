/**
 * Webhook Resource
 * 
 * Manage webhook subscriptions for event notifications
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { INodeProperties } from 'n8n-workflow';

export const webhookOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new webhook',
				action: 'Create a webhook',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a webhook',
				action: 'Delete a webhook',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a webhook by ID',
				action: 'Get a webhook',
			},
			{
				name: 'Get Events',
				value: 'getEvents',
				description: 'Get webhook event types',
				action: 'Get webhook events',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all webhooks',
				action: 'List all webhooks',
			},
			{
				name: 'Test',
				value: 'test',
				description: 'Send a test webhook event',
				action: 'Test a webhook',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a webhook',
				action: 'Update a webhook',
			},
		],
		default: 'list',
	},
];

export const webhookFields: INodeProperties[] = [
	// ----------------------------------
	//         webhook:create
	// ----------------------------------
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		default: '',
		placeholder: 'https://example.com/webhook',
		description: 'The URL to receive webhook events',
	},
	{
		displayName: 'Events',
		name: 'events',
		type: 'multiOptions',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		options: [
			{ name: 'Account Created', value: 'account:created' },
			{ name: 'Account Deleted', value: 'account:deleted' },
			{ name: 'Account Refreshed', value: 'account:refreshed' },
			{ name: 'Account Updated', value: 'account:updated' },
			{ name: 'Balance Updated', value: 'balance:updated' },
			{ name: 'Consent Expired', value: 'consent:expired' },
			{ name: 'Consent Granted', value: 'consent:granted' },
			{ name: 'Consent Revoked', value: 'consent:revoked' },
			{ name: 'Credentials Created', value: 'credentials:created' },
			{ name: 'Credentials Deleted', value: 'credentials:deleted' },
			{ name: 'Credentials Error', value: 'credentials:error' },
			{ name: 'Credentials Updated', value: 'credentials:updated' },
			{ name: 'Payment Cancelled', value: 'payment:cancelled' },
			{ name: 'Payment Executed', value: 'payment:executed' },
			{ name: 'Payment Failed', value: 'payment:failed' },
			{ name: 'Payment Initiated', value: 'payment:initiated' },
			{ name: 'Payment Signed', value: 'payment:signed' },
			{ name: 'Refresh Required', value: 'credentials:refresh_required' },
			{ name: 'Report Failed', value: 'report:failed' },
			{ name: 'Report Ready', value: 'report:ready' },
			{ name: 'Supplemental Info Required', value: 'credentials:supplemental_required' },
			{ name: 'Transactions Available', value: 'transactions:available' },
			{ name: 'Transfer Completed', value: 'transfer:completed' },
			{ name: 'Transfer Failed', value: 'transfer:failed' },
			{ name: 'Transfer Initiated', value: 'transfer:initiated' },
			{ name: 'User Created', value: 'user:created' },
			{ name: 'User Deleted', value: 'user:deleted' },
		],
		default: ['account:created', 'transactions:available'],
		description: 'Events to subscribe to',
	},
	{
		displayName: 'Webhook Options',
		name: 'webhookOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the webhook',
			},
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether the webhook is enabled',
			},
			{
				displayName: 'Secret',
				name: 'secret',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'Secret for signing webhook payloads',
			},
		],
	},

	// ----------------------------------
	//         webhook:get/update/delete
	// ----------------------------------
	{
		displayName: 'Webhook ID',
		name: 'webhookId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['get', 'update', 'delete', 'test'],
			},
		},
		default: '',
		description: 'The ID of the webhook',
	},

	// ----------------------------------
	//         webhook:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the webhook',
			},
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether the webhook is enabled',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: [
					{ name: 'Account Created', value: 'account:created' },
					{ name: 'Account Deleted', value: 'account:deleted' },
					{ name: 'Account Refreshed', value: 'account:refreshed' },
					{ name: 'Account Updated', value: 'account:updated' },
					{ name: 'Balance Updated', value: 'balance:updated' },
					{ name: 'Credentials Created', value: 'credentials:created' },
					{ name: 'Credentials Error', value: 'credentials:error' },
					{ name: 'Credentials Updated', value: 'credentials:updated' },
					{ name: 'Payment Executed', value: 'payment:executed' },
					{ name: 'Payment Failed', value: 'payment:failed' },
					{ name: 'Transactions Available', value: 'transactions:available' },
				],
				default: [],
				description: 'Events to subscribe to',
			},
			{
				displayName: 'Secret',
				name: 'secret',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'Secret for signing webhook payloads',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				description: 'The URL to receive webhook events',
			},
		],
	},

	// ----------------------------------
	//         webhook:test
	// ----------------------------------
	{
		displayName: 'Test Event Type',
		name: 'testEventType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['test'],
			},
		},
		options: [
			{ name: 'Account Created', value: 'account:created' },
			{ name: 'Account Updated', value: 'account:updated' },
			{ name: 'Balance Updated', value: 'balance:updated' },
			{ name: 'Credentials Updated', value: 'credentials:updated' },
			{ name: 'Transactions Available', value: 'transactions:available' },
		],
		default: 'account:created',
		description: 'The event type to test',
	},

	// ----------------------------------
	//         webhook:list pagination
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['list'],
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
				resource: ['webhook'],
				operation: ['list'],
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
