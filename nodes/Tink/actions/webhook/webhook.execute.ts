/**
 * Webhook Operations Execute
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { tinkApiRequest, tinkApiRequestAllItems } from '../../transport/tinkClient';
import { createWebhook, updateWebhook, deleteWebhook, testWebhook } from '../../transport/webhookHandler';
import { TINK_ENDPOINTS, WEBHOOK_EVENTS } from '../../constants/endpoints';

export async function executeWebhookOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[] = {};

	if (operation === 'create') {
		const url = this.getNodeParameter('url', i) as string;
		const events = this.getNodeParameter('events', i) as string[];
		const webhookOptions = this.getNodeParameter('webhookOptions', i, {}) as IDataObject;

		responseData = await createWebhook.call(this, {
			url,
			events,
			description: webhookOptions.description as string,
			secret: webhookOptions.secret as string,
			enabled: webhookOptions.enabled as boolean ?? true,
		});
	}

	if (operation === 'get') {
		const webhookId = this.getNodeParameter('webhookId', i) as string;

		responseData = await tinkApiRequest.call(
			this,
			'GET',
			TINK_ENDPOINTS.WEBHOOKS.BY_ID(webhookId),
		);
	}

	if (operation === 'update') {
		const webhookId = this.getNodeParameter('webhookId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

		responseData = await updateWebhook.call(this, webhookId, updateFields);
	}

	if (operation === 'delete') {
		const webhookId = this.getNodeParameter('webhookId', i) as string;

		await deleteWebhook.call(this, webhookId);
		responseData = { success: true, deleted: webhookId };
	}

	if (operation === 'list') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;

		if (returnAll) {
			responseData = await tinkApiRequestAllItems.call(
				this,
				'webhooks',
				'GET',
				TINK_ENDPOINTS.WEBHOOKS.BASE,
			);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.WEBHOOKS.BASE,
				{},
				{ pageSize: limit },
			);
			responseData = (responseData as IDataObject).webhooks as IDataObject[] || [];
		}
	}

	if (operation === 'test') {
		const webhookId = this.getNodeParameter('webhookId', i) as string;
		const testEventType = this.getNodeParameter('testEventType', i) as string;

		responseData = await testWebhook.call(this, webhookId, testEventType);
	}

	if (operation === 'getEvents') {
		// Return available webhook event types
		responseData = WEBHOOK_EVENTS.map(event => ({
			event: event.type,
			category: event.category,
			description: event.description,
		}));
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: i } },
	);

	return executionData;
}
