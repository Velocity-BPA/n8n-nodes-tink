/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Tink API Endpoints
 *
 * Tink provides REST APIs for accessing financial data across European banks.
 * The API follows PSD2 regulations and provides both AIS (Account Information Service)
 * and PIS (Payment Initiation Service) capabilities.
 */

export const TINK_ENVIRONMENTS = {
  production: {
    apiUrl: 'https://api.tink.com',
    linkUrl: 'https://link.tink.com',
    name: 'Production',
  },
  sandbox: {
    apiUrl: 'https://api.tink.com',
    linkUrl: 'https://link.tink.com',
    name: 'Sandbox',
  },
} as const;

export const API_VERSION = 'v1';

/**
 * API Endpoints organized by resource
 */
export const ENDPOINTS = {
  // OAuth & Authentication
  oauth: {
    token: '/api/v1/oauth/token',
    authorize: '/api/v1/oauth/authorize',
    revoke: '/api/v1/oauth/revoke',
  },

  // User Management
  user: {
    base: '/api/v1/user',
    create: '/api/v1/user/create',
    delete: '/api/v1/user/delete',
    list: '/api/v1/users',
    profile: '/api/v1/user/profile',
    authorize: '/api/v1/user/authorize',
    authorizationCode: '/api/v1/oauth/authorization-grant',
  },

  // Account Information (AIS)
  accounts: {
    base: '/data/v2/accounts',
    list: '/data/v2/accounts',
    byId: (accountId: string) => `/data/v2/accounts/${accountId}`,
    balances: (accountId: string) => `/data/v2/accounts/${accountId}/balances`,
  },

  // Transaction Data
  transactions: {
    base: '/data/v2/transactions',
    list: '/data/v2/transactions',
    byId: (transactionId: string) => `/data/v2/transactions/${transactionId}`,
    search: '/data/v2/transactions/search',
    byAccount: (accountId: string) => `/data/v2/accounts/${accountId}/transactions`,
    pending: '/data/v2/transactions/pending',
    categories: '/api/v1/categories',
    categorize: (transactionId: string) => `/data/v2/transactions/${transactionId}/categorize`,
  },

  // Balance Information
  balances: {
    base: '/data/v2/balances',
    list: '/data/v2/balances',
    byAccount: (accountId: string) => `/data/v2/accounts/${accountId}/balances`,
  },

  // Credentials (Bank Connections)
  credentials: {
    base: '/api/v1/credentials',
    list: '/api/v1/credentials/list',
    create: '/api/v1/credentials',
    byId: (credentialsId: string) => `/api/v1/credentials/${credentialsId}`,
    refresh: (credentialsId: string) => `/api/v1/credentials/${credentialsId}/refresh`,
    authenticate: (credentialsId: string) => `/api/v1/credentials/${credentialsId}/authenticate`,
    supplemental: (credentialsId: string) =>
      `/api/v1/credentials/${credentialsId}/supplemental-information`,
    thirdPartyCallback: '/api/v1/credentials/third-party/callback',
  },

  // Provider (Bank) Information
  providers: {
    base: '/api/v1/providers',
    list: '/api/v1/providers',
    byName: (providerName: string) => `/api/v1/providers/${providerName}`,
    byMarket: (market: string) => `/api/v1/providers?market=${market}`,
    search: '/api/v1/providers/search',
    financialInstitutions: '/api/v1/providers/financial-institutions',
  },

  // Identity Verification
  identity: {
    base: '/api/v1/identity',
    data: '/api/v1/identity/data',
    verify: '/api/v1/identity/verify',
    verification: '/api/v1/identity/verification',
  },

  // Payment Initiation (PIS)
  payments: {
    base: '/api/v1/payments',
    create: '/api/v1/payments',
    byId: (paymentId: string) => `/api/v1/payments/${paymentId}`,
    status: (paymentId: string) => `/api/v1/payments/${paymentId}/status`,
    sign: (paymentId: string) => `/api/v1/payments/${paymentId}/sign`,
    cancel: (paymentId: string) => `/api/v1/payments/${paymentId}/cancel`,
  },

  // Transfers
  transfers: {
    base: '/api/v1/transfers',
    create: '/api/v1/transfers',
    byId: (transferId: string) => `/api/v1/transfers/${transferId}`,
    status: (transferId: string) => `/api/v1/transfers/${transferId}/status`,
    accounts: '/api/v1/transfer/accounts',
    sign: (transferId: string) => `/api/v1/transfers/${transferId}/sign`,
  },

  // Beneficiaries
  beneficiaries: {
    base: '/api/v1/beneficiaries',
    list: '/api/v1/beneficiaries',
    create: '/api/v1/beneficiaries',
    byId: (beneficiaryId: string) => `/api/v1/beneficiaries/${beneficiaryId}`,
    accounts: (beneficiaryId: string) => `/api/v1/beneficiaries/${beneficiaryId}/accounts`,
  },

  // Consent Management
  consents: {
    base: '/api/v1/consents',
    list: '/api/v1/consents',
    byId: (consentId: string) => `/api/v1/consents/${consentId}`,
    status: (consentId: string) => `/api/v1/consents/${consentId}/status`,
    revoke: (consentId: string) => `/api/v1/consents/${consentId}/revoke`,
    extend: (consentId: string) => `/api/v1/consents/${consentId}/extend`,
    sessions: '/api/v1/consent/sessions',
  },

  // Insights & Analytics
  insights: {
    base: '/api/v1/insights',
    account: '/api/v1/insights/account',
    spending: '/api/v1/insights/spending',
    income: '/api/v1/insights/income',
    cashFlow: '/api/v1/insights/cash-flow',
    budget: '/api/v1/insights/budget',
    savings: '/api/v1/insights/savings-potential',
    risk: '/api/v1/insights/risk-assessment',
  },

  // Transaction Enrichment
  enrichment: {
    base: '/api/v1/enrichment',
    enrich: '/api/v1/enrichment/transactions',
    byId: (enrichmentId: string) => `/api/v1/enrichment/${enrichmentId}`,
    merchant: '/api/v1/enrichment/merchant',
    categories: '/api/v1/enrichment/category-suggestions',
  },

  // Tink Link (Connect)
  connect: {
    base: '/link/v1',
    session: '/link/v1/sessions',
    authorize: '/link/v1/authorize',
    grant: '/api/v1/oauth/authorization-grant',
    exchange: '/api/v1/oauth/token',
  },

  // Reports
  reports: {
    base: '/api/v1/reports',
    create: '/api/v1/reports',
    byId: (reportId: string) => `/api/v1/reports/${reportId}`,
    data: (reportId: string) => `/api/v1/reports/${reportId}/data`,
    accountVerification: '/api/v1/reports/account-verification',
    incomeVerification: '/api/v1/reports/income-verification',
    transactions: '/api/v1/reports/transactions',
    risk: '/api/v1/reports/risk',
    affordability: '/api/v1/reports/affordability',
  },

  // Webhooks
  webhooks: {
    base: '/api/v1/webhooks',
    list: '/api/v1/webhooks',
    create: '/api/v1/webhooks',
    byId: (webhookId: string) => `/api/v1/webhooks/${webhookId}`,
    test: (webhookId: string) => `/api/v1/webhooks/${webhookId}/test`,
    events: '/api/v1/webhooks/events',
  },

  // Markets
  markets: {
    base: '/api/v1/markets',
    list: '/api/v1/markets',
    byCode: (marketCode: string) => `/api/v1/markets/${marketCode}`,
    currencies: (marketCode: string) => `/api/v1/markets/${marketCode}/currencies`,
    providers: (marketCode: string) => `/api/v1/markets/${marketCode}/providers`,
  },

  // Categories
  categories: {
    base: '/api/v1/categories',
    list: '/api/v1/categories',
    tree: '/api/v1/categories/tree',
    byCode: (categoryCode: string) => `/api/v1/categories/${categoryCode}`,
    primary: '/api/v1/categories/primary',
    secondary: '/api/v1/categories/secondary',
  },

  // Statistics
  statistics: {
    base: '/api/v1/statistics',
    list: '/api/v1/statistics',
    account: (accountId: string) => `/api/v1/statistics/account/${accountId}`,
    transactions: '/api/v1/statistics/transactions',
    monthly: '/api/v1/statistics/monthly',
    category: '/api/v1/statistics/category',
  },

  // Utility
  utility: {
    status: '/api/v1/status',
    validateIban: '/api/v1/validate/iban',
    markets: '/api/v1/markets',
    currencies: '/api/v1/currencies',
  },
} as const;
