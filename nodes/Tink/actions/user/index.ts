/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';
import { MARKET_OPTIONS } from '../../constants';

export const userOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['user'],
      },
    },
    options: [
      {
        name: 'Authorize User',
        value: 'authorize',
        description: 'Generate authorization URL for a user',
        action: 'Authorize user',
      },
      {
        name: 'Create User',
        value: 'create',
        description: 'Create a new Tink user',
        action: 'Create user',
      },
      {
        name: 'Delete User',
        value: 'delete',
        description: 'Delete a Tink user',
        action: 'Delete user',
      },
      {
        name: 'Get Authorization Code',
        value: 'getAuthorizationCode',
        description: 'Get an authorization code for a user',
        action: 'Get authorization code',
      },
      {
        name: 'Get User',
        value: 'get',
        description: 'Get a Tink user by ID',
        action: 'Get user',
      },
      {
        name: 'Get User Profile',
        value: 'getProfile',
        description: 'Get user profile information',
        action: 'Get user profile',
      },
      {
        name: 'List Users',
        value: 'list',
        description: 'List all Tink users',
        action: 'List users',
      },
      {
        name: 'Update User Profile',
        value: 'updateProfile',
        description: 'Update user profile information',
        action: 'Update user profile',
      },
    ],
    default: 'create',
  },
];

export const userFields: INodeProperties[] = [
  // Create User
  {
    displayName: 'External User ID',
    name: 'externalUserId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create'],
      },
    },
    description: 'Your unique identifier for this user. Use this to link Tink users to your system.',
  },
  {
    displayName: 'Market',
    name: 'market',
    type: 'options',
    required: true,
    options: MARKET_OPTIONS,
    default: 'GB',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create'],
      },
    },
    description: 'The market (country) where the user is located',
  },
  {
    displayName: 'Locale',
    name: 'locale',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['create'],
      },
    },
    description: 'The locale for the user (e.g., en_US, sv_SE)',
  },

  // Get User
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['get', 'delete', 'getProfile', 'updateProfile', 'authorize', 'getAuthorizationCode'],
      },
    },
    description: 'The Tink user ID or external user ID',
  },

  // Authorization
  {
    displayName: 'Scope',
    name: 'scope',
    type: 'string',
    default: 'accounts:read,balances:read,transactions:read',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['authorize', 'getAuthorizationCode'],
      },
    },
    description: 'Comma-separated list of scopes to request',
  },

  // Update Profile
  {
    displayName: 'Profile Fields',
    name: 'profileFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['updateProfile'],
      },
    },
    options: [
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        description: 'User email address',
      },
      {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        default: '',
        description: 'User first name',
      },
      {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        default: '',
        description: 'User last name',
      },
      {
        displayName: 'Phone Number',
        name: 'phoneNumber',
        type: 'string',
        default: '',
        description: 'User phone number',
      },
    ],
  },

  // List Users Options
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['list'],
      },
    },
    options: [
      {
        displayName: 'Page Size',
        name: 'pageSize',
        type: 'number',
        typeOptions: {
          minValue: 1,
          maxValue: 100,
        },
        default: 20,
        description: 'Number of users to return per page',
      },
      {
        displayName: 'Page Token',
        name: 'pageToken',
        type: 'string',
        default: '',
        description: 'Token for pagination',
      },
    ],
  },
];

export * from './user.execute';
