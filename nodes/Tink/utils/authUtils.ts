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
} from 'n8n-workflow';
import { TinkCredentials } from '../transport/tinkClient';

/**
 * Authentication Utilities for Tink
 *
 * Helper functions for managing authentication state and
 * determining the appropriate authentication method for different operations.
 */

/**
 * Determine the required scopes for a resource/operation combination
 */
export function getRequiredScopes(resource: string, operation: string): string {
  const scopeMap: Record<string, Record<string, string>> = {
    user: {
      create: 'user:write',
      get: 'user:read',
      delete: 'user:delete',
      list: 'user:read',
      authorize: 'authorization:grant',
      getProfile: 'user:read',
      updateProfile: 'user:write',
      getAuthorizationCode: 'authorization:grant',
    },
    account: {
      default: 'accounts:read',
    },
    transaction: {
      default: 'transactions:read',
      categorize: 'transactions:write',
    },
    balance: {
      default: 'balances:read',
    },
    credentials: {
      list: 'credentials:read',
      get: 'credentials:read',
      create: 'credentials:write',
      update: 'credentials:write',
      delete: 'credentials:write',
      refresh: 'credentials:refresh',
      authenticate: 'credentials:write',
      supplemental: 'credentials:write',
      thirdPartyCallback: 'credentials:write',
    },
    provider: {
      default: 'providers:read',
    },
    identity: {
      default: 'identity:read',
    },
    payment: {
      get: 'payment:read',
      list: 'payment:read',
      create: 'payment:write',
      sign: 'payment:write',
      cancel: 'payment:write',
    },
    transfer: {
      get: 'transfer:read',
      list: 'transfer:read',
      create: 'transfer:write',
      sign: 'transfer:write',
      getAccounts: 'transfer:read',
    },
    beneficiary: {
      get: 'beneficiaries:read',
      list: 'beneficiaries:read',
      create: 'beneficiaries:write',
      update: 'beneficiaries:write',
      delete: 'beneficiaries:write',
    },
    consent: {
      get: 'consent:read',
      list: 'consent:read',
      revoke: 'consent:write',
      extend: 'consent:write',
    },
    insights: {
      default: 'insights:read',
    },
    enrichment: {
      default: 'transactions:read',
    },
    connect: {
      createSession: 'authorization:grant',
      getUrl: 'authorization:grant',
      getStatus: 'authorization:read',
      getGrant: 'authorization:grant',
      exchangeToken: 'authorization:grant',
    },
    report: {
      get: 'reports:read',
      create: 'reports:write',
    },
    webhook: {
      get: 'webhooks:read',
      list: 'webhooks:read',
      create: 'webhooks:write',
      update: 'webhooks:write',
      delete: 'webhooks:write',
      test: 'webhooks:write',
    },
    accessToken: {
      default: 'authorization:grant',
    },
    market: {
      default: 'providers:read',
    },
    category: {
      default: 'transactions:read',
    },
    statistics: {
      default: 'accounts:read,transactions:read',
    },
    utility: {
      default: 'user:read',
    },
  };

  const resourceScopes = scopeMap[resource];
  if (!resourceScopes) {
    return 'user:read';
  }

  return resourceScopes[operation] || resourceScopes.default || 'user:read';
}

/**
 * Check if an operation requires user-level authentication
 *
 * Some operations can be performed with client credentials (server-to-server),
 * while others require a user-specific access token.
 */
export function requiresUserToken(resource: string, operation: string): boolean {
  const userTokenRequired: Record<string, string[]> = {
    account: ['getAccounts', 'getAccount', 'getAccountBalances', 'getByType'],
    transaction: ['getTransactions', 'getTransaction', 'search', 'getByAccount', 'getPending'],
    balance: ['getBalances', 'getAccountBalance', 'getHistory'],
    credentials: ['list', 'get', 'refresh', 'update', 'authenticate'],
    identity: ['getData', 'verify', 'getVerification'],
    payment: ['create', 'sign', 'get', 'getStatus'],
    transfer: ['create', 'sign', 'get', 'getStatus', 'getAccounts'],
    consent: ['get', 'list', 'revoke', 'extend'],
    insights: ['getAccountInsights', 'getSpending', 'getIncome', 'getCashFlow'],
    statistics: ['getStatistics', 'getAccountStatistics', 'getMonthly'],
  };

  const resourceOps = userTokenRequired[resource];
  if (!resourceOps) {
    return false;
  }

  return resourceOps.includes(operation);
}

/**
 * Determine if the operation should use external ID for user lookup
 */
export function usesExternalId(resource: string): boolean {
  const externalIdResources = ['user', 'credentials', 'account'];
  return externalIdResources.includes(resource);
}

/**
 * Get credentials and validate they are complete
 */
export async function getValidatedCredentials(
  context: IExecuteFunctions | IHookFunctions,
): Promise<TinkCredentials> {
  const credentials = (await context.getCredentials('tinkApi')) as unknown as TinkCredentials;

  if (!credentials.clientId || !credentials.clientSecret) {
    throw new Error('Tink credentials are incomplete. Please provide Client ID and Client Secret.');
  }

  return credentials;
}

/**
 * Build authorization header
 */
export function buildAuthHeader(accessToken: string): IDataObject {
  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

/**
 * Generate a random state parameter for OAuth
 */
export function generateOAuthState(): string {
  const randomBytes = new Array(32);
  for (let i = 0; i < 32; i++) {
    randomBytes[i] = Math.floor(Math.random() * 256);
  }
  return Buffer.from(randomBytes).toString('hex');
}

/**
 * Validate OAuth state parameter
 */
export function validateOAuthState(expectedState: string, receivedState: string): boolean {
  if (!expectedState || !receivedState) {
    return false;
  }
  return expectedState === receivedState;
}
