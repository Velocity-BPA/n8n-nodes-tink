/**
 * Tink Trigger Node - Webhook Event Handler
 * Real-time event monitoring for Tink Open Banking Platform
 *
 * @license BSL-1.1
 * @copyright Velocity BPA
 *
 * [Velocity BPA Licensing Notice]
 *
 * This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
 *
 * Use of this node by for-profit organizations in production environments
 * requires a commercial license from Velocity BPA.
 *
 * For licensing information, visit https://velobpa.com/licensing
 * or contact licensing@velobpa.com.
 */

import type {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';

import { verifyWebhookSignature } from './transport/webhookHandler';
import { tinkApiRequest } from './transport/tinkClient';

export class TinkTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Tink Trigger',
		name: 'tinkTrigger',
		icon: 'file:tink.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Listen for Tink webhook events',
		defaults: {
			name: 'Tink Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'tinkApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event Category',
				name: 'eventCategory',
				type: 'options',
				options: [
					{
						name: 'Account',
						value: 'account',
						description: 'Account-related events',
					},
					{
						name: 'Transaction',
						value: 'transaction',
						description: 'Transaction-related events',
					},
					{
						name: 'Credentials',
						value: 'credentials',
						description: 'Credentials-related events',
					},
					{
						name: 'Balance',
						value: 'balance',
						description: 'Balance-related events',
					},
					{
						name: 'Payment',
						value: 'payment',
						description: 'Payment-related events',
					},
					{
						name: 'Transfer',
						value: 'transfer',
						description: 'Transfer-related events',
					},
					{
						name: 'Consent',
						value: 'consent',
						description: 'Consent-related events',
					},
					{
						name: 'Report',
						value: 'report',
						description: 'Report-related events',
					},
					{
						name: 'User',
						value: 'user',
						description: 'User-related events',
					},
				],
				default: 'account',
				description: 'Category of events to listen for',
			},
			// Account Events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['account'],
					},
				},
				options: [
					{
						name: 'Account Created',
						value: 'account:created',
						description: 'A new account has been added',
					},
					{
						name: 'Account Updated',
						value: 'account:updated',
						description: 'Account information has been updated',
					},
					{
						name: 'Account Deleted',
						value: 'account:deleted',
						description: 'An account has been removed',
					},
					{
						name: 'Account Refreshed',
						value: 'account:refreshed',
						description: 'Account data has been refreshed from the bank',
					},
				],
				default: 'account:created',
				description: 'The account event to listen for',
			},
			// Transaction Events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['transaction'],
					},
				},
				options: [
					{
						name: 'Transactions Available',
						value: 'transactions:available',
						description: 'New transactions are available for processing',
					},
					{
						name: 'Transaction Created',
						value: 'transaction:created',
						description: 'A new transaction has been recorded',
					},
					{
						name: 'Transaction Updated',
						value: 'transaction:updated',
						description: 'Transaction details have been updated',
					},
					{
						name: 'New Transactions',
						value: 'transactions:new',
						description: 'Batch of new transactions detected',
					},
				],
				default: 'transactions:available',
				description: 'The transaction event to listen for',
			},
			// Credentials Events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['credentials'],
					},
				},
				options: [
					{
						name: 'Credentials Created',
						value: 'credentials:created',
						description: 'New bank credentials have been added',
					},
					{
						name: 'Credentials Updated',
						value: 'credentials:updated',
						description: 'Credentials have been updated',
					},
					{
						name: 'Credentials Deleted',
						value: 'credentials:deleted',
						description: 'Credentials have been removed',
					},
					{
						name: 'Credentials Error',
						value: 'credentials:error',
						description: 'An error occurred with credentials',
					},
					{
						name: 'Refresh Required',
						value: 'credentials:refresh_required',
						description: 'Credentials need to be refreshed',
					},
					{
						name: 'Supplemental Information Required',
						value: 'credentials:supplemental_required',
						description: 'Additional information needed for authentication',
					},
				],
				default: 'credentials:created',
				description: 'The credentials event to listen for',
			},
			// Balance Events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['balance'],
					},
				},
				options: [
					{
						name: 'Balance Updated',
						value: 'balance:updated',
						description: 'Account balance has been updated',
					},
					{
						name: 'Low Balance Alert',
						value: 'balance:low',
						description: 'Account balance is below threshold',
					},
				],
				default: 'balance:updated',
				description: 'The balance event to listen for',
			},
			// Payment Events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['payment'],
					},
				},
				options: [
					{
						name: 'Payment Initiated',
						value: 'payment:initiated',
						description: 'A payment has been initiated',
					},
					{
						name: 'Payment Signed',
						value: 'payment:signed',
						description: 'A payment has been signed/authorized',
					},
					{
						name: 'Payment Executed',
						value: 'payment:executed',
						description: 'A payment has been executed successfully',
					},
					{
						name: 'Payment Failed',
						value: 'payment:failed',
						description: 'A payment has failed',
					},
					{
						name: 'Payment Cancelled',
						value: 'payment:cancelled',
						description: 'A payment has been cancelled',
					},
				],
				default: 'payment:initiated',
				description: 'The payment event to listen for',
			},
			// Transfer Events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['transfer'],
					},
				},
				options: [
					{
						name: 'Transfer Initiated',
						value: 'transfer:initiated',
						description: 'A transfer has been initiated',
					},
					{
						name: 'Transfer Completed',
						value: 'transfer:completed',
						description: 'A transfer has been completed',
					},
					{
						name: 'Transfer Failed',
						value: 'transfer:failed',
						description: 'A transfer has failed',
					},
				],
				default: 'transfer:initiated',
				description: 'The transfer event to listen for',
			},
			// Consent Events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['consent'],
					},
				},
				options: [
					{
						name: 'Consent Granted',
						value: 'consent:granted',
						description: 'User has granted consent',
					},
					{
						name: 'Consent Revoked',
						value: 'consent:revoked',
						description: 'User has revoked consent',
					},
					{
						name: 'Consent Expired',
						value: 'consent:expired',
						description: 'Consent has expired',
					},
				],
				default: 'consent:granted',
				description: 'The consent event to listen for',
			},
			// Report Events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['report'],
					},
				},
				options: [
					{
						name: 'Report Ready',
						value: 'report:ready',
						description: 'A report has been generated and is ready',
					},
					{
						name: 'Report Failed',
						value: 'report:failed',
						description: 'Report generation has failed',
					},
				],
				default: 'report:ready',
				description: 'The report event to listen for',
			},
			// User Events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['user'],
					},
				},
				options: [
					{
						name: 'User Created',
						value: 'user:created',
						description: 'A new user has been created',
					},
					{
						name: 'User Deleted',
						value: 'user:deleted',
						description: 'A user has been deleted',
					},
				],
				default: 'user:created',
				description: 'The user event to listen for',
			},
			{
				displayName: 'Verify Signature',
				name: 'verifySignature',
				type: 'boolean',
				default: true,
				description: 'Whether to verify the webhook signature using HMAC-SHA256',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Filter by User ID',
						name: 'userId',
						type: 'string',
						default: '',
						description: 'Only trigger for events from a specific user',
					},
					{
						displayName: 'Filter by Credentials ID',
						name: 'credentialsId',
						type: 'string',
						default: '',
						description: 'Only trigger for events from specific credentials',
					},
					{
						displayName: 'Filter by Account ID',
						name: 'accountId',
						type: 'string',
						default: '',
						description: 'Only trigger for events from a specific account',
					},
					{
						displayName: 'Include Raw Payload',
						name: 'includeRaw',
						type: 'boolean',
						default: false,
						description: 'Whether to include the raw webhook payload in the output',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;
				
				try {
					// List all webhooks and check if one exists for this URL and event
					const response = await tinkApiRequest.call(
						this,
						'GET',
						'/webhook/v1/subscriptions',
					);
					
					const webhooks = response.webhooks as IDataObject[] || [];
					
					for (const webhook of webhooks) {
						if (
							webhook.url === webhookUrl &&
							(webhook.events as string[] || []).includes(event)
						) {
							// Store webhook ID for later deletion
							const webhookData = this.getWorkflowStaticData('node');
							webhookData.webhookId = webhook.id;
							return true;
						}
					}
					
					return false;
				} catch {
					return false;
				}
			},
			
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;
				
				const body: IDataObject = {
					url: webhookUrl,
					events: [event],
					enabled: true,
				};
				
				try {
					const response = await tinkApiRequest.call(
						this,
						'POST',
						'/webhook/v1/subscriptions',
						body,
					);
					
					// Store webhook ID for later deletion
					const webhookData = this.getWorkflowStaticData('node');
					webhookData.webhookId = response.id;
					
					return true;
				} catch (error) {
					// If webhook creation fails, return false
					console.error('Failed to create Tink webhook:', error);
					return false;
				}
			},
			
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookId = webhookData.webhookId as string;
				
				if (!webhookId) {
					return true;
				}
				
				try {
					await tinkApiRequest.call(
						this,
						'DELETE',
						`/webhook/v1/subscriptions/${webhookId}`,
					);
					
					delete webhookData.webhookId;
					return true;
				} catch {
					return false;
				}
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const body = this.getBodyData() as IDataObject;
		const headers = this.getHeaderData() as IDataObject;
		
		const verifySignature = this.getNodeParameter('verifySignature') as boolean;
		const event = this.getNodeParameter('event') as string;
		const options = this.getNodeParameter('options') as IDataObject;
		
		// Verify webhook signature if enabled
		if (verifySignature) {
			const credentials = await this.getCredentials('tinkApi');
			const webhookSecret = credentials.webhookSecret as string;
			
			if (webhookSecret) {
				const signature = headers['x-tink-signature'] as string || 
								  headers['tink-signature'] as string;
				
				if (!signature) {
					return {
						webhookResponse: {
							status: 401,
							body: { error: 'Missing signature header' },
						},
					};
				}
				
				const rawBody = JSON.stringify(body);
				const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);
				
				if (!isValid) {
					return {
						webhookResponse: {
							status: 401,
							body: { error: 'Invalid signature' },
						},
					};
				}
			}
		}
		
		// Check if the event matches
		const eventType = body.type as string || body.event as string;
		if (eventType && eventType !== event) {
			// Event doesn't match, acknowledge but don't process
			return {
				webhookResponse: {
					status: 200,
					body: { received: true, processed: false },
				},
			};
		}
		
		// Apply filters
		const data = body.data as IDataObject || body;
		
		if (options.userId && data.userId !== options.userId) {
			return {
				webhookResponse: {
					status: 200,
					body: { received: true, processed: false },
				},
			};
		}
		
		if (options.credentialsId && data.credentialsId !== options.credentialsId) {
			return {
				webhookResponse: {
					status: 200,
					body: { received: true, processed: false },
				},
			};
		}
		
		if (options.accountId && data.accountId !== options.accountId) {
			return {
				webhookResponse: {
					status: 200,
					body: { received: true, processed: false },
				},
			};
		}
		
		// Build output
		const output: IDataObject = {
			event: eventType || event,
			timestamp: body.timestamp || new Date().toISOString(),
			...data,
		};
		
		// Include raw payload if requested
		if (options.includeRaw) {
			output.rawPayload = body;
			output.rawHeaders = headers;
		}
		
		return {
			workflowData: [
				this.helpers.returnJsonArray([output]),
			],
		};
	}
}
