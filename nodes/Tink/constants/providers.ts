/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Tink Provider Information
 *
 * Providers represent banks and financial institutions that can be connected
 * through Tink's open banking platform. Each provider has specific capabilities
 * and requirements based on their PSD2 API implementation.
 *
 * ASPSP = Account Servicing Payment Service Provider (the bank)
 * TPP = Third Party Provider (your application using Tink)
 */

export interface TinkProvider {
  name: string;
  displayName: string;
  market: string;
  type: 'bank' | 'creditCard' | 'investment' | 'pension';
  capabilities: ProviderCapabilities;
  authenticationMethods: string[];
  status: 'enabled' | 'disabled' | 'beta';
}

export interface ProviderCapabilities {
  accountInformation: boolean;
  paymentInitiation: boolean;
  fundConfirmation: boolean;
  balanceCheck: boolean;
  transactionHistory: boolean;
  identity: boolean;
}

/**
 * Account Types supported by Tink
 */
export const ACCOUNT_TYPES = {
  CHECKING: {
    value: 'CHECKING',
    name: 'Checking Account',
    description: 'Current/checking account for daily transactions',
  },
  SAVINGS: {
    value: 'SAVINGS',
    name: 'Savings Account',
    description: 'Savings account with interest',
  },
  CREDIT_CARD: {
    value: 'CREDIT_CARD',
    name: 'Credit Card',
    description: 'Credit card account',
  },
  LOAN: {
    value: 'LOAN',
    name: 'Loan',
    description: 'Loan or mortgage account',
  },
  INVESTMENT: {
    value: 'INVESTMENT',
    name: 'Investment Account',
    description: 'Investment or brokerage account',
  },
  PENSION: {
    value: 'PENSION',
    name: 'Pension Account',
    description: 'Pension or retirement account',
  },
  MORTGAGE: {
    value: 'MORTGAGE',
    name: 'Mortgage',
    description: 'Mortgage loan account',
  },
  OTHER: {
    value: 'OTHER',
    name: 'Other',
    description: 'Other account type',
  },
};

export const ACCOUNT_TYPE_OPTIONS = Object.values(ACCOUNT_TYPES).map((type) => ({
  name: type.name,
  value: type.value,
  description: type.description,
}));

/**
 * Credential Statuses
 *
 * Credentials (bank connections) go through various states during their lifecycle.
 * Understanding these states is crucial for proper error handling and UX.
 */
export const CREDENTIAL_STATUSES = {
  CREATED: {
    value: 'CREATED',
    name: 'Created',
    description: 'Credentials have been created but not yet authenticated',
  },
  AUTHENTICATING: {
    value: 'AUTHENTICATING',
    name: 'Authenticating',
    description: 'User is currently authenticating with the bank',
  },
  AWAITING_MOBILE_BANKID_AUTHENTICATION: {
    value: 'AWAITING_MOBILE_BANKID_AUTHENTICATION',
    name: 'Awaiting BankID',
    description: 'Waiting for Mobile BankID authentication',
  },
  AWAITING_THIRD_PARTY_APP_AUTHENTICATION: {
    value: 'AWAITING_THIRD_PARTY_APP_AUTHENTICATION',
    name: 'Awaiting Third Party App',
    description: 'Waiting for authentication in bank app',
  },
  AWAITING_SUPPLEMENTAL_INFORMATION: {
    value: 'AWAITING_SUPPLEMENTAL_INFORMATION',
    name: 'Awaiting Supplemental Info',
    description: 'Additional information required from user',
  },
  UPDATING: {
    value: 'UPDATING',
    name: 'Updating',
    description: 'Credentials are being updated/refreshed',
  },
  UPDATED: {
    value: 'UPDATED',
    name: 'Updated',
    description: 'Credentials have been successfully updated',
  },
  TEMPORARY_ERROR: {
    value: 'TEMPORARY_ERROR',
    name: 'Temporary Error',
    description: 'Temporary error occurred, will retry',
  },
  PERMANENT_ERROR: {
    value: 'PERMANENT_ERROR',
    name: 'Permanent Error',
    description: 'Permanent error, user action required',
  },
  AUTHENTICATION_ERROR: {
    value: 'AUTHENTICATION_ERROR',
    name: 'Authentication Error',
    description: 'Authentication failed, credentials may be invalid',
  },
  DISABLED: {
    value: 'DISABLED',
    name: 'Disabled',
    description: 'Credentials are disabled',
  },
  SESSION_EXPIRED: {
    value: 'SESSION_EXPIRED',
    name: 'Session Expired',
    description: 'Bank session has expired',
  },
  DELETED: {
    value: 'DELETED',
    name: 'Deleted',
    description: 'Credentials have been deleted',
  },
};

export const CREDENTIAL_STATUS_OPTIONS = Object.values(CREDENTIAL_STATUSES).map((status) => ({
  name: status.name,
  value: status.value,
  description: status.description,
}));

/**
 * Payment Statuses
 */
export const PAYMENT_STATUSES = {
  CREATED: {
    value: 'CREATED',
    name: 'Created',
    description: 'Payment has been created',
  },
  PENDING: {
    value: 'PENDING',
    name: 'Pending',
    description: 'Payment is pending execution',
  },
  AWAITING_SIGNING: {
    value: 'AWAITING_SIGNING',
    name: 'Awaiting Signing',
    description: 'Payment is awaiting user signature',
  },
  SIGNED: {
    value: 'SIGNED',
    name: 'Signed',
    description: 'Payment has been signed',
  },
  EXECUTING: {
    value: 'EXECUTING',
    name: 'Executing',
    description: 'Payment is being executed',
  },
  EXECUTED: {
    value: 'EXECUTED',
    name: 'Executed',
    description: 'Payment has been executed',
  },
  FAILED: {
    value: 'FAILED',
    name: 'Failed',
    description: 'Payment has failed',
  },
  CANCELLED: {
    value: 'CANCELLED',
    name: 'Cancelled',
    description: 'Payment has been cancelled',
  },
  REJECTED: {
    value: 'REJECTED',
    name: 'Rejected',
    description: 'Payment has been rejected by the bank',
  },
};

export const PAYMENT_STATUS_OPTIONS = Object.values(PAYMENT_STATUSES).map((status) => ({
  name: status.name,
  value: status.value,
  description: status.description,
}));

/**
 * OAuth Scopes
 *
 * Tink uses OAuth 2.0 scopes to control access to different resources.
 * The scope requested depends on the operations your application needs to perform.
 */
export const TINK_SCOPES = {
  // User scopes
  'user:read': 'Read user information',
  'user:write': 'Create and modify users',
  'user:delete': 'Delete users',

  // Account scopes (AIS)
  'accounts:read': 'Read account information',
  'balances:read': 'Read account balances',
  'transactions:read': 'Read transactions',

  // Identity scopes
  'identity:read': 'Read identity information',

  // Credentials scopes
  'credentials:read': 'Read credentials',
  'credentials:write': 'Create and modify credentials',
  'credentials:refresh': 'Refresh credentials',

  // Provider scopes
  'providers:read': 'Read provider information',

  // Payment scopes (PIS)
  'payment:read': 'Read payments',
  'payment:write': 'Create and execute payments',

  // Transfer scopes
  'transfer:read': 'Read transfers',
  'transfer:write': 'Create and execute transfers',

  // Beneficiary scopes
  'beneficiaries:read': 'Read beneficiaries',
  'beneficiaries:write': 'Create and modify beneficiaries',

  // Consent scopes
  'consent:read': 'Read consent information',
  'consent:write': 'Manage consents',

  // Insights scopes
  'insights:read': 'Read financial insights',

  // Report scopes
  'reports:read': 'Read reports',
  'reports:write': 'Create reports',

  // Webhook scopes
  'webhooks:read': 'Read webhooks',
  'webhooks:write': 'Manage webhooks',

  // Authorization scopes
  'authorization:read': 'Read authorization grants',
  'authorization:grant': 'Create authorization grants',
};

export const SCOPE_OPTIONS = Object.entries(TINK_SCOPES).map(([scope, description]) => ({
  name: scope,
  value: scope,
  description,
}));
