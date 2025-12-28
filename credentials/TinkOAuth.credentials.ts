/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { ICredentialType, INodeProperties } from 'n8n-workflow';

/**
 * Tink OAuth Credentials
 *
 * Used for user-level authentication where end-users authorize
 * access to their bank accounts via Tink Link.
 *
 * This implements OAuth 2.0 Authorization Code flow which is
 * required for accessing user-specific financial data under PSD2.
 *
 * Key concepts:
 * - Redirect URI: Where Tink sends users after authorization
 * - Scope: Permissions requested (e.g., accounts:read, transactions:read)
 * - Market: The country/region for bank connections
 */
export class TinkOAuth implements ICredentialType {
  name = 'tinkOAuth';
  displayName = 'Tink OAuth';
  documentationUrl = 'https://docs.tink.com/api';
  extends = ['oAuth2Api'];
  properties: INodeProperties[] = [
    {
      displayName: 'Environment',
      name: 'environment',
      type: 'options',
      default: 'sandbox',
      options: [
        {
          name: 'Production',
          value: 'production',
          description: 'Connect to Tink Production API',
        },
        {
          name: 'Sandbox',
          value: 'sandbox',
          description: 'Connect to Tink Sandbox for testing',
        },
      ],
      description: 'The Tink environment to connect to',
    },
    {
      displayName: 'Grant Type',
      name: 'grantType',
      type: 'hidden',
      default: 'authorizationCode',
    },
    {
      displayName: 'Authorization URL',
      name: 'authUrl',
      type: 'hidden',
      default: 'https://link.tink.com/1.0/authorize',
    },
    {
      displayName: 'Access Token URL',
      name: 'accessTokenUrl',
      type: 'hidden',
      default: 'https://api.tink.com/api/v1/oauth/token',
    },
    {
      displayName: 'Client ID',
      name: 'clientId',
      type: 'string',
      default: '',
      required: true,
      description: 'The OAuth Client ID from your Tink Console',
    },
    {
      displayName: 'Client Secret',
      name: 'clientSecret',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'The OAuth Client Secret from your Tink Console',
    },
    {
      displayName: 'Market',
      name: 'market',
      type: 'options',
      default: 'GB',
      options: [
        { name: 'Austria (AT)', value: 'AT' },
        { name: 'Belgium (BE)', value: 'BE' },
        { name: 'Denmark (DK)', value: 'DK' },
        { name: 'Estonia (EE)', value: 'EE' },
        { name: 'Finland (FI)', value: 'FI' },
        { name: 'France (FR)', value: 'FR' },
        { name: 'Germany (DE)', value: 'DE' },
        { name: 'Ireland (IE)', value: 'IE' },
        { name: 'Italy (IT)', value: 'IT' },
        { name: 'Latvia (LV)', value: 'LV' },
        { name: 'Lithuania (LT)', value: 'LT' },
        { name: 'Netherlands (NL)', value: 'NL' },
        { name: 'Norway (NO)', value: 'NO' },
        { name: 'Poland (PL)', value: 'PL' },
        { name: 'Portugal (PT)', value: 'PT' },
        { name: 'Spain (ES)', value: 'ES' },
        { name: 'Sweden (SE)', value: 'SE' },
        { name: 'United Kingdom (GB)', value: 'GB' },
      ],
      description: 'The market (country) for bank connections',
    },
    {
      displayName: 'Scope',
      name: 'scope',
      type: 'string',
      default:
        'accounts:read,balances:read,transactions:read,identity:read,credentials:read',
      description:
        'Comma-separated list of scopes to request. Common scopes: accounts:read, balances:read, transactions:read, identity:read, credentials:read, credentials:write, providers:read, user:read, user:write, payment:read, payment:write, transfer:read, transfer:write',
    },
    {
      displayName: 'Authentication',
      name: 'authentication',
      type: 'hidden',
      default: 'body',
    },
  ];
}
