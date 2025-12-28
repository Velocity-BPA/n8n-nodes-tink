/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Tink Webhook Event Types
 *
 * Tink provides real-time notifications via webhooks for various events
 * in the open banking data flow. These events allow you to build
 * reactive applications that respond to changes in financial data.
 *
 * Events are organized by resource type (accounts, transactions, credentials, etc.)
 * and follow the format: resource:action
 */

export interface TinkEventType {
  event: string;
  name: string;
  description: string;
  category: string;
}

export const TINK_EVENT_TYPES: Record<string, TinkEventType> = {
  // Account Events
  'account:created': {
    event: 'account:created',
    name: 'Account Created',
    description: 'Triggered when a new account is added',
    category: 'account',
  },
  'account:updated': {
    event: 'account:updated',
    name: 'Account Updated',
    description: 'Triggered when account details are updated',
    category: 'account',
  },
  'account:deleted': {
    event: 'account:deleted',
    name: 'Account Deleted',
    description: 'Triggered when an account is removed',
    category: 'account',
  },
  'account:refreshed': {
    event: 'account:refreshed',
    name: 'Account Refreshed',
    description: 'Triggered when account data is refreshed from the bank',
    category: 'account',
  },

  // Transaction Events
  'transactions:available': {
    event: 'transactions:available',
    name: 'Transactions Available',
    description: 'Triggered when new transactions are available',
    category: 'transaction',
  },
  'transaction:created': {
    event: 'transaction:created',
    name: 'Transaction Created',
    description: 'Triggered when a new transaction is detected',
    category: 'transaction',
  },
  'transaction:updated': {
    event: 'transaction:updated',
    name: 'Transaction Updated',
    description: 'Triggered when transaction details are updated',
    category: 'transaction',
  },
  'transactions:new': {
    event: 'transactions:new',
    name: 'New Transactions',
    description: 'Triggered when batch of new transactions is available',
    category: 'transaction',
  },

  // Credential Events
  'credentials:created': {
    event: 'credentials:created',
    name: 'Credentials Created',
    description: 'Triggered when a new bank connection is established',
    category: 'credentials',
  },
  'credentials:updated': {
    event: 'credentials:updated',
    name: 'Credentials Updated',
    description: 'Triggered when credentials are updated',
    category: 'credentials',
  },
  'credentials:deleted': {
    event: 'credentials:deleted',
    name: 'Credentials Deleted',
    description: 'Triggered when a bank connection is removed',
    category: 'credentials',
  },
  'credentials:error': {
    event: 'credentials:error',
    name: 'Credentials Error',
    description: 'Triggered when there is an error with credentials',
    category: 'credentials',
  },
  'credentials:refresh_required': {
    event: 'credentials:refresh_required',
    name: 'Refresh Required',
    description: 'Triggered when credentials need to be refreshed',
    category: 'credentials',
  },
  'credentials:supplemental_information_required': {
    event: 'credentials:supplemental_information_required',
    name: 'Supplemental Information Required',
    description: 'Triggered when additional authentication is needed',
    category: 'credentials',
  },

  // Balance Events
  'balance:updated': {
    event: 'balance:updated',
    name: 'Balance Updated',
    description: 'Triggered when account balance changes',
    category: 'balance',
  },
  'balance:low': {
    event: 'balance:low',
    name: 'Low Balance Alert',
    description: 'Triggered when balance falls below threshold',
    category: 'balance',
  },

  // Payment Events
  'payment:initiated': {
    event: 'payment:initiated',
    name: 'Payment Initiated',
    description: 'Triggered when a payment is initiated',
    category: 'payment',
  },
  'payment:signed': {
    event: 'payment:signed',
    name: 'Payment Signed',
    description: 'Triggered when a payment is signed by the user',
    category: 'payment',
  },
  'payment:executed': {
    event: 'payment:executed',
    name: 'Payment Executed',
    description: 'Triggered when a payment is successfully executed',
    category: 'payment',
  },
  'payment:failed': {
    event: 'payment:failed',
    name: 'Payment Failed',
    description: 'Triggered when a payment fails',
    category: 'payment',
  },
  'payment:cancelled': {
    event: 'payment:cancelled',
    name: 'Payment Cancelled',
    description: 'Triggered when a payment is cancelled',
    category: 'payment',
  },

  // Transfer Events
  'transfer:initiated': {
    event: 'transfer:initiated',
    name: 'Transfer Initiated',
    description: 'Triggered when a transfer is initiated',
    category: 'transfer',
  },
  'transfer:completed': {
    event: 'transfer:completed',
    name: 'Transfer Completed',
    description: 'Triggered when a transfer is completed',
    category: 'transfer',
  },
  'transfer:failed': {
    event: 'transfer:failed',
    name: 'Transfer Failed',
    description: 'Triggered when a transfer fails',
    category: 'transfer',
  },

  // Consent Events
  'consent:granted': {
    event: 'consent:granted',
    name: 'Consent Granted',
    description: 'Triggered when user grants consent',
    category: 'consent',
  },
  'consent:revoked': {
    event: 'consent:revoked',
    name: 'Consent Revoked',
    description: 'Triggered when user revokes consent',
    category: 'consent',
  },
  'consent:expired': {
    event: 'consent:expired',
    name: 'Consent Expired',
    description: 'Triggered when consent expires',
    category: 'consent',
  },

  // Report Events
  'report:ready': {
    event: 'report:ready',
    name: 'Report Ready',
    description: 'Triggered when a report is ready for download',
    category: 'report',
  },
  'report:failed': {
    event: 'report:failed',
    name: 'Report Failed',
    description: 'Triggered when report generation fails',
    category: 'report',
  },

  // User Events
  'user:created': {
    event: 'user:created',
    name: 'User Created',
    description: 'Triggered when a new user is created',
    category: 'user',
  },
  'user:deleted': {
    event: 'user:deleted',
    name: 'User Deleted',
    description: 'Triggered when a user is deleted',
    category: 'user',
  },
};

export const EVENT_TYPE_OPTIONS = Object.entries(TINK_EVENT_TYPES).map(([event, eventType]) => ({
  name: eventType.name,
  value: event,
  description: eventType.description,
}));

export const EVENT_CATEGORIES = [
  'account',
  'transaction',
  'credentials',
  'balance',
  'payment',
  'transfer',
  'consent',
  'report',
  'user',
];

export const EVENTS_BY_CATEGORY = EVENT_CATEGORIES.reduce(
  (acc, category) => {
    acc[category] = Object.entries(TINK_EVENT_TYPES)
      .filter(([_, eventType]) => eventType.category === category)
      .map(([event, eventType]) => ({
        name: eventType.name,
        value: event,
        description: eventType.description,
      }));
    return acc;
  },
  {} as Record<string, Array<{ name: string; value: string; description: string }>>,
);
