/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import * as crypto from 'crypto';
import {
  IWebhookFunctions,
  IHookFunctions,
  IDataObject,
  NodeApiError,
} from 'n8n-workflow';
import { TinkCredentials, getBaseUrl, tinkApiRequest } from './tinkClient';
import { ENDPOINTS, TINK_EVENT_TYPES } from '../constants';

/**
 * Webhook Handler for Tink
 *
 * Tink sends webhook notifications for various events in the open banking flow.
 * This handler manages webhook registration, verification, and event processing.
 *
 * Security:
 * - Webhooks are signed using HMAC-SHA256
 * - The signature is included in the X-Tink-Signature header
 * - Always verify signatures before processing events
 */

export interface WebhookConfig {
  url: string;
  events: string[];
  enabled?: boolean;
  description?: string;
}

export interface WebhookEvent {
  id: string;
  type: string;
  timestamp: string;
  userId?: string;
  data: IDataObject;
}

export interface TinkWebhook {
  id: string;
  url: string;
  events: string[];
  enabled: boolean;
  createdAt: string;
  description?: string;
}

/**
 * Verify webhook signature
 *
 * Tink signs webhooks using HMAC-SHA256 with the webhook secret.
 * The signature is sent in the X-Tink-Signature header.
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  if (!signature || !secret) {
    return false;
  }

  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex');

    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );
  } catch {
    return false;
  }
}

/**
 * Parse webhook payload
 */
export function parseWebhookPayload(body: IDataObject): WebhookEvent {
  return {
    id: body.id as string,
    type: body.type as string,
    timestamp: body.timestamp as string,
    userId: body.userId as string | undefined,
    data: (body.data as IDataObject) || body,
  };
}

/**
 * Create a webhook subscription
 */
export async function createWebhook(
  this: IHookFunctions,
  config: WebhookConfig,
): Promise<TinkWebhook> {
  try {
    const response = await tinkApiRequest.call(this, {
      method: 'POST',
      endpoint: ENDPOINTS.webhooks.create,
      body: {
        url: config.url,
        events: config.events,
        enabled: config.enabled !== false,
        description: config.description,
      },
      scope: 'webhooks:write',
    });

    return {
      id: response.id as string,
      url: response.url as string,
      events: response.events as string[],
      enabled: response.enabled as boolean,
      createdAt: response.createdAt as string,
      description: response.description as string | undefined,
    };
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as Error, {
      message: 'Failed to create webhook',
    });
  }
}

/**
 * Get a webhook by ID
 */
export async function getWebhook(
  this: IHookFunctions,
  webhookId: string,
): Promise<TinkWebhook | null> {
  try {
    const response = await tinkApiRequest.call(this, {
      method: 'GET',
      endpoint: ENDPOINTS.webhooks.byId(webhookId),
      scope: 'webhooks:read',
    });

    return {
      id: response.id as string,
      url: response.url as string,
      events: response.events as string[],
      enabled: response.enabled as boolean,
      createdAt: response.createdAt as string,
      description: response.description as string | undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Update a webhook
 */
export async function updateWebhook(
  this: IHookFunctions,
  webhookId: string,
  config: Partial<WebhookConfig>,
): Promise<TinkWebhook> {
  try {
    const response = await tinkApiRequest.call(this, {
      method: 'PATCH',
      endpoint: ENDPOINTS.webhooks.byId(webhookId),
      body: config as IDataObject,
      scope: 'webhooks:write',
    });

    return {
      id: response.id as string,
      url: response.url as string,
      events: response.events as string[],
      enabled: response.enabled as boolean,
      createdAt: response.createdAt as string,
      description: response.description as string | undefined,
    };
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as Error, {
      message: 'Failed to update webhook',
    });
  }
}

/**
 * Delete a webhook
 */
export async function deleteWebhook(
  this: IHookFunctions,
  webhookId: string,
): Promise<void> {
  try {
    await tinkApiRequest.call(this, {
      method: 'DELETE',
      endpoint: ENDPOINTS.webhooks.byId(webhookId),
      scope: 'webhooks:write',
    });
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as Error, {
      message: 'Failed to delete webhook',
    });
  }
}

/**
 * List all webhooks
 */
export async function listWebhooks(this: IHookFunctions): Promise<TinkWebhook[]> {
  try {
    const response = await tinkApiRequest.call(this, {
      method: 'GET',
      endpoint: ENDPOINTS.webhooks.list,
      scope: 'webhooks:read',
    });

    const webhooks = response.webhooks as IDataObject[] || [];

    return webhooks.map((webhook) => ({
      id: webhook.id as string,
      url: webhook.url as string,
      events: webhook.events as string[],
      enabled: webhook.enabled as boolean,
      createdAt: webhook.createdAt as string,
      description: webhook.description as string | undefined,
    }));
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as Error, {
      message: 'Failed to list webhooks',
    });
  }
}

/**
 * Test a webhook by sending a test event
 */
export async function testWebhook(
  this: IHookFunctions,
  webhookId: string,
): Promise<boolean> {
  try {
    await tinkApiRequest.call(this, {
      method: 'POST',
      endpoint: ENDPOINTS.webhooks.test(webhookId),
      scope: 'webhooks:write',
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Process incoming webhook and return structured event
 */
export function processWebhookEvent(
  this: IWebhookFunctions,
  body: IDataObject,
  headers: IDataObject,
  webhookSecret?: string,
): WebhookEvent | null {
  // Verify signature if secret is provided
  if (webhookSecret) {
    const signature = headers['x-tink-signature'] as string;
    const payload = JSON.stringify(body);

    if (!verifyWebhookSignature(payload, signature, webhookSecret)) {
      return null;
    }
  }

  return parseWebhookPayload(body);
}

/**
 * Get event type info
 */
export function getEventTypeInfo(eventType: string): {
  name: string;
  description: string;
  category: string;
} | null {
  const eventInfo = TINK_EVENT_TYPES[eventType];
  if (!eventInfo) {
    return null;
  }

  return {
    name: eventInfo.name,
    description: eventInfo.description,
    category: eventInfo.category,
  };
}

/**
 * Find existing webhook by URL
 */
export async function findWebhookByUrl(
  this: IHookFunctions,
  url: string,
): Promise<TinkWebhook | null> {
  const webhooks = await listWebhooks.call(this);
  return webhooks.find((w) => w.url === url) || null;
}
