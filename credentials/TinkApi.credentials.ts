/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

/**
 * Tink API Credentials
 *
 * Tink is an open banking platform that enables access to financial data
 * across European banks. These credentials are used for server-to-server
 * API calls using OAuth 2.0 client credentials flow.
 *
 * Key concepts:
 * - Client ID: Identifies your application in the Tink system
 * - Client Secret: Secret key for authenticating your application
 * - Environment: Production vs Sandbox for testing
 * - Actor Client ID: Used when acting on behalf of another TPP
 */
export class TinkApi implements ICredentialType {
  name = 'tinkApi';
  displayName = 'Tink API';
  documentationUrl = 'https://docs.tink.com/api';
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
        {
          name: 'Custom',
          value: 'custom',
          description: 'Use a custom API endpoint',
        },
      ],
      description: 'The Tink environment to connect to',
    },
    {
      displayName: 'Custom API URL',
      name: 'customApiUrl',
      type: 'string',
      default: '',
      placeholder: 'https://api.custom-tink.com',
      description: 'Custom Tink API endpoint URL',
      displayOptions: {
        show: {
          environment: ['custom'],
        },
      },
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
      displayName: 'Actor Client ID',
      name: 'actorClientId',
      type: 'string',
      default: '',
      description:
        'Optional: The client ID of the TPP you are acting on behalf of (for platform providers)',
    },
    {
      displayName: 'Webhook Secret',
      name: 'webhookSecret',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'Optional: Secret for verifying webhook signatures',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.accessToken}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL:
        '={{$credentials.environment === "production" ? "https://api.tink.com" : $credentials.environment === "sandbox" ? "https://api.tink.com" : $credentials.customApiUrl}}',
      url: '/api/v1/oauth/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: {
        client_id: '={{$credentials.clientId}}',
        client_secret: '={{$credentials.clientSecret}}',
        grant_type: 'client_credentials',
        scope: 'user:read',
      },
    },
  };
}
