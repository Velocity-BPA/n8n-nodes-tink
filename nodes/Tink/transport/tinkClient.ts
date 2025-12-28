/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IExecuteFunctions,
  IHookFunctions,
  ILoadOptionsFunctions,
  IDataObject,
  NodeApiError,
  NodeOperationError,
  IHttpRequestMethods,
} from 'n8n-workflow';
import { TINK_ENVIRONMENTS, ENDPOINTS } from '../constants';

/**
 * Tink API Client
 *
 * This client handles all communication with the Tink API, including:
 * - OAuth 2.0 token management (client credentials and user tokens)
 * - Rate limiting
 * - Error handling
 * - Request/response transformation
 */

export interface TinkCredentials {
  environment: 'production' | 'sandbox' | 'custom';
  customApiUrl?: string;
  clientId: string;
  clientSecret: string;
  actorClientId?: string;
  webhookSecret?: string;
}

export interface TinkRequestOptions {
  method: IHttpRequestMethods;
  endpoint: string;
  body?: IDataObject;
  query?: IDataObject;
  headers?: IDataObject;
  json?: boolean;
  userToken?: string;
  scope?: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

// Token cache to avoid unnecessary token requests
const tokenCache: Map<string, { token: string; expiresAt: number }> = new Map();

/**
 * Get the base URL for the Tink API based on credentials
 */
export function getBaseUrl(credentials: TinkCredentials): string {
  if (credentials.environment === 'custom' && credentials.customApiUrl) {
    return credentials.customApiUrl.replace(/\/$/, '');
  }
  return TINK_ENVIRONMENTS[credentials.environment]?.apiUrl || TINK_ENVIRONMENTS.sandbox.apiUrl;
}

/**
 * Get a client access token using client credentials flow
 */
export async function getClientAccessToken(
  this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
  credentials: TinkCredentials,
  scope: string = 'user:read',
): Promise<string> {
  const cacheKey = `${credentials.clientId}:${scope}`;
  const cached = tokenCache.get(cacheKey);

  // Return cached token if still valid (with 60 second buffer)
  if (cached && cached.expiresAt > Date.now() + 60000) {
    return cached.token;
  }

  const baseUrl = getBaseUrl(credentials);

  const body: IDataObject = {
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
    grant_type: 'client_credentials',
    scope,
  };

  // Add actor client ID if present (for platform providers)
  if (credentials.actorClientId) {
    body.actor_client_id = credentials.actorClientId;
  }

  try {
    const response = await this.helpers.request({
      method: 'POST',
      url: `${baseUrl}${ENDPOINTS.oauth.token}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      form: body,
      json: true,
    });

    const tokenResponse = response as TokenResponse;

    // Cache the token
    tokenCache.set(cacheKey, {
      token: tokenResponse.access_token,
      expiresAt: Date.now() + tokenResponse.expires_in * 1000,
    });

    return tokenResponse.access_token;
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as Error, {
      message: 'Failed to obtain client access token',
    });
  }
}

/**
 * Get a user access token using authorization grant
 */
export async function getUserAccessToken(
  this: IExecuteFunctions | IHookFunctions,
  credentials: TinkCredentials,
  authorizationCode: string,
): Promise<TokenResponse> {
  const baseUrl = getBaseUrl(credentials);

  const body: IDataObject = {
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
    grant_type: 'authorization_code',
    code: authorizationCode,
  };

  try {
    const response = await this.helpers.request({
      method: 'POST',
      url: `${baseUrl}${ENDPOINTS.oauth.token}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      form: body,
      json: true,
    });

    return response as TokenResponse;
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as Error, {
      message: 'Failed to exchange authorization code for user token',
    });
  }
}

/**
 * Make an authenticated request to the Tink API
 */
export async function tinkApiRequest(
  this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
  options: TinkRequestOptions,
): Promise<IDataObject> {
  const credentials = (await this.getCredentials('tinkApi')) as unknown as TinkCredentials;

  const baseUrl = getBaseUrl(credentials);

  // Get access token (use provided user token or get client token)
  const accessToken = options.userToken
    ? options.userToken
    : await getClientAccessToken.call(this, credentials, options.scope || 'user:read');

  const requestOptions: IDataObject = {
    method: options.method,
    url: `${baseUrl}${options.endpoint}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    json: options.json !== false,
  };

  if (options.body && Object.keys(options.body).length > 0) {
    requestOptions.body = options.body;
  }

  if (options.query && Object.keys(options.query).length > 0) {
    requestOptions.qs = options.query;
  }

  try {
    const response = await this.helpers.request(requestOptions);
    return response as IDataObject;
  } catch (error) {
    // Handle specific Tink API errors
    const errorData = (error as Error & { response?: { body?: IDataObject } }).response?.body;

    if (errorData) {
      const errorCode = errorData.errorCode || errorData.error;
      const errorMessage = errorData.errorMessage || errorData.error_description || errorData.message;

      throw new NodeApiError(this.getNode(), error as Error, {
        message: `Tink API Error: ${errorCode}`,
        description: errorMessage as string,
      });
    }

    throw new NodeApiError(this.getNode(), error as Error);
  }
}

/**
 * Make a paginated request to the Tink API
 */
export async function tinkApiRequestAllItems(
  this: IExecuteFunctions | IHookFunctions,
  options: TinkRequestOptions,
  propertyName: string,
  maxResults?: number,
): Promise<IDataObject[]> {
  const returnData: IDataObject[] = [];
  let nextPageToken: string | undefined;

  do {
    const queryParams: IDataObject = {
      ...options.query,
    };

    if (nextPageToken) {
      queryParams.pageToken = nextPageToken;
    }

    if (maxResults && !queryParams.pageSize) {
      queryParams.pageSize = Math.min(maxResults - returnData.length, 100);
    }

    const response = await tinkApiRequest.call(this, {
      ...options,
      query: queryParams,
    });

    const items = response[propertyName] as IDataObject[];
    if (items) {
      returnData.push(...items);
    }

    nextPageToken = response.nextPageToken as string | undefined;

    // Stop if we've reached the desired number of results
    if (maxResults && returnData.length >= maxResults) {
      return returnData.slice(0, maxResults);
    }
  } while (nextPageToken);

  return returnData;
}

/**
 * Make a form-encoded request to the Tink API
 */
export async function tinkApiRequestForm(
  this: IExecuteFunctions | IHookFunctions,
  endpoint: string,
  body: IDataObject,
  userToken?: string,
): Promise<IDataObject> {
  const credentials = (await this.getCredentials('tinkApi')) as unknown as TinkCredentials;

  const baseUrl = getBaseUrl(credentials);

  const accessToken = userToken || (await getClientAccessToken.call(this, credentials));

  try {
    const response = await this.helpers.request({
      method: 'POST',
      url: `${baseUrl}${endpoint}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      form: body,
      json: true,
    });

    return response as IDataObject;
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as Error);
  }
}

/**
 * Validate that required parameters are present
 */
export function validateRequiredParams(
  context: IExecuteFunctions,
  params: Record<string, unknown>,
  required: string[],
): void {
  const missing = required.filter((param) => !params[param]);

  if (missing.length > 0) {
    throw new NodeOperationError(
      context.getNode(),
      `Missing required parameters: ${missing.join(', ')}`,
    );
  }
}

/**
 * Clear the token cache (useful for testing or forced refresh)
 */
export function clearTokenCache(): void {
  tokenCache.clear();
}
