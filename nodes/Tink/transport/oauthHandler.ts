/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IExecuteFunctions,
  IHookFunctions,
  IDataObject,
  NodeApiError,
} from 'n8n-workflow';
import { TINK_ENVIRONMENTS, ENDPOINTS } from '../constants';
import { TinkCredentials, getBaseUrl } from './tinkClient';

/**
 * OAuth Handler for Tink
 *
 * Handles the OAuth 2.0 flows required for Tink integration:
 *
 * 1. Client Credentials Flow:
 *    - Used for server-to-server communication
 *    - Gets a client access token for operations that don't require user context
 *
 * 2. Authorization Code Flow:
 *    - Used when user authorization is required
 *    - Involves redirecting user to Tink Link for bank authentication
 *    - Exchanges authorization code for user access token
 *
 * 3. User Delegation:
 *    - Creating user-level access tokens for specific users
 *    - Required for accessing user's financial data
 */

export interface AuthorizationGrant {
  code: string;
  userId: string;
  expiresIn: number;
}

export interface UserToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  scope: string;
  tokenType: string;
}

export interface TinkLinkConfig {
  clientId: string;
  redirectUri: string;
  market: string;
  locale?: string;
  scope: string;
  state?: string;
  test?: boolean;
  inputProvider?: string;
  inputUsername?: string;
  sessionId?: string;
}

/**
 * Generate a Tink Link URL for user authentication
 *
 * Tink Link is Tink's hosted UI that handles bank authentication.
 * Users are redirected to this URL to connect their bank accounts.
 */
export function generateTinkLinkUrl(config: TinkLinkConfig): string {
  const baseUrl = TINK_ENVIRONMENTS.production.linkUrl;
  const params = new URLSearchParams();

  params.append('client_id', config.clientId);
  params.append('redirect_uri', config.redirectUri);
  params.append('market', config.market);
  params.append('scope', config.scope);

  if (config.locale) {
    params.append('locale', config.locale);
  }

  if (config.state) {
    params.append('state', config.state);
  }

  if (config.test) {
    params.append('test', 'true');
  }

  if (config.inputProvider) {
    params.append('input_provider', config.inputProvider);
  }

  if (config.inputUsername) {
    params.append('input_username', config.inputUsername);
  }

  if (config.sessionId) {
    params.append('session_id', config.sessionId);
  }

  return `${baseUrl}/1.0/authorize?${params.toString()}`;
}

/**
 * Create an authorization grant for a user
 *
 * This is used when you need to create a user-specific token
 * without going through the full OAuth redirect flow.
 */
export async function createAuthorizationGrant(
  this: IExecuteFunctions | IHookFunctions,
  userId: string,
  scope: string,
): Promise<AuthorizationGrant> {
  const credentials = (await this.getCredentials('tinkApi')) as unknown as TinkCredentials;
  const baseUrl = getBaseUrl(credentials);

  // First, get a client access token with authorization:grant scope
  const tokenResponse = await this.helpers.request({
    method: 'POST',
    url: `${baseUrl}${ENDPOINTS.oauth.token}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    form: {
      client_id: credentials.clientId,
      client_secret: credentials.clientSecret,
      grant_type: 'client_credentials',
      scope: 'authorization:grant',
    },
    json: true,
  });

  const clientToken = (tokenResponse as { access_token: string }).access_token;

  // Now create the authorization grant for the user
  const grantResponse = await this.helpers.request({
    method: 'POST',
    url: `${baseUrl}${ENDPOINTS.connect.grant}`,
    headers: {
      Authorization: `Bearer ${clientToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    form: {
      user_id: userId,
      scope,
    },
    json: true,
  });

  const grant = grantResponse as { code: string; expires_in: number };

  return {
    code: grant.code,
    userId,
    expiresIn: grant.expires_in,
  };
}

/**
 * Exchange an authorization code for a user access token
 */
export async function exchangeCodeForToken(
  this: IExecuteFunctions | IHookFunctions,
  authorizationCode: string,
): Promise<UserToken> {
  const credentials = (await this.getCredentials('tinkApi')) as unknown as TinkCredentials;
  const baseUrl = getBaseUrl(credentials);

  try {
    const response = await this.helpers.request({
      method: 'POST',
      url: `${baseUrl}${ENDPOINTS.oauth.token}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      form: {
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        grant_type: 'authorization_code',
        code: authorizationCode,
      },
      json: true,
    });

    const tokenData = response as {
      access_token: string;
      refresh_token?: string;
      expires_in: number;
      scope: string;
      token_type: string;
    };

    return {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      scope: tokenData.scope,
      tokenType: tokenData.token_type,
    };
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as Error, {
      message: 'Failed to exchange authorization code for token',
    });
  }
}

/**
 * Refresh a user access token using a refresh token
 */
export async function refreshUserToken(
  this: IExecuteFunctions | IHookFunctions,
  refreshToken: string,
): Promise<UserToken> {
  const credentials = (await this.getCredentials('tinkApi')) as unknown as TinkCredentials;
  const baseUrl = getBaseUrl(credentials);

  try {
    const response = await this.helpers.request({
      method: 'POST',
      url: `${baseUrl}${ENDPOINTS.oauth.token}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      form: {
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
      json: true,
    });

    const tokenData = response as {
      access_token: string;
      refresh_token?: string;
      expires_in: number;
      scope: string;
      token_type: string;
    };

    return {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      scope: tokenData.scope,
      tokenType: tokenData.token_type,
    };
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as Error, {
      message: 'Failed to refresh user token',
    });
  }
}

/**
 * Revoke an access token
 */
export async function revokeToken(
  this: IExecuteFunctions | IHookFunctions,
  token: string,
): Promise<void> {
  const credentials = (await this.getCredentials('tinkApi')) as unknown as TinkCredentials;
  const baseUrl = getBaseUrl(credentials);

  try {
    await this.helpers.request({
      method: 'POST',
      url: `${baseUrl}${ENDPOINTS.oauth.revoke}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      form: {
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        token,
      },
    });
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as Error, {
      message: 'Failed to revoke token',
    });
  }
}

/**
 * Get user access token by creating delegation
 *
 * This creates a user-specific access token for a given user ID,
 * allowing operations to be performed on behalf of that user.
 */
export async function getUserAccessTokenByDelegation(
  this: IExecuteFunctions | IHookFunctions,
  userId: string,
  scope: string,
): Promise<UserToken> {
  // Create an authorization grant
  const grant = await createAuthorizationGrant.call(this, userId, scope);

  // Exchange the grant code for a user token
  return await exchangeCodeForToken.call(this, grant.code);
}

/**
 * Parse and validate an OAuth callback
 */
export function parseOAuthCallback(query: IDataObject): {
  code?: string;
  state?: string;
  error?: string;
  errorDescription?: string;
} {
  return {
    code: query.code as string | undefined,
    state: query.state as string | undefined,
    error: query.error as string | undefined,
    errorDescription: query.error_description as string | undefined,
  };
}
