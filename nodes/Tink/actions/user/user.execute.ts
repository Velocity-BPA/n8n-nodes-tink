/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IExecuteFunctions,
  IDataObject,
  INodeExecutionData,
  NodeOperationError,
} from 'n8n-workflow';
import { tinkApiRequest, tinkApiRequestForm } from '../../transport';
import { ENDPOINTS } from '../../constants';
import { createAuthorizationGrant, generateTinkLinkUrl } from '../../transport/oauthHandler';
import { validateExternalUserId, assertValid } from '../../utils/validationUtils';
import { TinkCredentials, getBaseUrl } from '../../transport/tinkClient';

/**
 * Execute User operations
 *
 * User management in Tink:
 * - Users represent end-users who connect their bank accounts
 * - Each user has a unique Tink ID and can have an external ID for your reference
 * - Users can have multiple credentials (bank connections)
 */
export async function executeUserOperation(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', index) as string;
  let responseData: IDataObject = {};

  switch (operation) {
    case 'create': {
      const externalUserId = this.getNodeParameter('externalUserId', index) as string;
      const market = this.getNodeParameter('market', index) as string;
      const locale = this.getNodeParameter('locale', index, '') as string;

      // Validate external user ID
      assertValid(this.getNode(), validateExternalUserId(externalUserId), 'externalUserId');

      const body: IDataObject = {
        external_user_id: externalUserId,
        market,
      };

      if (locale) {
        body.locale = locale;
      }

      responseData = await tinkApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.user.create,
        body,
        scope: 'user:create',
      });
      break;
    }

    case 'get': {
      const userId = this.getNodeParameter('userId', index) as string;

      responseData = await tinkApiRequest.call(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.user.base}/${userId}`,
        scope: 'user:read',
      });
      break;
    }

    case 'delete': {
      const userId = this.getNodeParameter('userId', index) as string;

      await tinkApiRequest.call(this, {
        method: 'POST',
        endpoint: ENDPOINTS.user.delete,
        body: { user_id: userId },
        scope: 'user:delete',
      });

      responseData = { success: true, userId, message: 'User deleted successfully' };
      break;
    }

    case 'list': {
      const options = this.getNodeParameter('options', index, {}) as IDataObject;

      const query: IDataObject = {};
      if (options.pageSize) {
        query.pageSize = options.pageSize;
      }
      if (options.pageToken) {
        query.pageToken = options.pageToken;
      }

      responseData = await tinkApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.user.list,
        query,
        scope: 'user:read',
      });
      break;
    }

    case 'authorize': {
      const userId = this.getNodeParameter('userId', index) as string;
      const scope = this.getNodeParameter('scope', index) as string;
      const credentials = (await this.getCredentials('tinkApi')) as unknown as TinkCredentials;

      // Generate authorization URL for Tink Link
      const webhookUrl = this.getNodeParameter('webhookUrl', index, '') as string;

      const authUrl = generateTinkLinkUrl({
        clientId: credentials.clientId,
        redirectUri: webhookUrl || 'https://console.tink.com/callback',
        market: 'GB', // Default market, could be made dynamic
        scope,
        state: userId,
        test: credentials.environment === 'sandbox',
      });

      responseData = {
        authorizationUrl: authUrl,
        userId,
        scope,
      };
      break;
    }

    case 'getProfile': {
      const userId = this.getNodeParameter('userId', index) as string;

      // First get authorization grant for the user
      const grant = await createAuthorizationGrant.call(this, userId, 'user:read');

      // Exchange for user token
      const credentials = (await this.getCredentials('tinkApi')) as unknown as TinkCredentials;
      const baseUrl = getBaseUrl(credentials);

      const tokenResponse = await this.helpers.request({
        method: 'POST',
        url: `${baseUrl}${ENDPOINTS.oauth.token}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: {
          client_id: credentials.clientId,
          client_secret: credentials.clientSecret,
          grant_type: 'authorization_code',
          code: grant.code,
        },
        json: true,
      });

      const userToken = (tokenResponse as { access_token: string }).access_token;

      // Get user profile with user token
      responseData = await tinkApiRequest.call(this, {
        method: 'GET',
        endpoint: ENDPOINTS.user.profile,
        userToken,
      });
      break;
    }

    case 'updateProfile': {
      const userId = this.getNodeParameter('userId', index) as string;
      const profileFields = this.getNodeParameter('profileFields', index, {}) as IDataObject;

      if (Object.keys(profileFields).length === 0) {
        throw new NodeOperationError(this.getNode(), 'At least one profile field must be provided');
      }

      // Get user token
      const grant = await createAuthorizationGrant.call(this, userId, 'user:write');
      const credentials = (await this.getCredentials('tinkApi')) as unknown as TinkCredentials;
      const baseUrl = getBaseUrl(credentials);

      const tokenResponse = await this.helpers.request({
        method: 'POST',
        url: `${baseUrl}${ENDPOINTS.oauth.token}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: {
          client_id: credentials.clientId,
          client_secret: credentials.clientSecret,
          grant_type: 'authorization_code',
          code: grant.code,
        },
        json: true,
      });

      const userToken = (tokenResponse as { access_token: string }).access_token;

      // Build profile update body
      const body: IDataObject = {};
      if (profileFields.email) body.email = profileFields.email;
      if (profileFields.firstName) body.firstName = profileFields.firstName;
      if (profileFields.lastName) body.lastName = profileFields.lastName;
      if (profileFields.phoneNumber) body.phoneNumber = profileFields.phoneNumber;

      responseData = await tinkApiRequest.call(this, {
        method: 'PUT',
        endpoint: ENDPOINTS.user.profile,
        body,
        userToken,
      });
      break;
    }

    case 'getAuthorizationCode': {
      const userId = this.getNodeParameter('userId', index) as string;
      const scope = this.getNodeParameter('scope', index) as string;

      const grant = await createAuthorizationGrant.call(this, userId, scope);

      responseData = {
        code: grant.code,
        userId: grant.userId,
        expiresIn: grant.expiresIn,
      };
      break;
    }

    default:
      throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
  }

  return [{ json: responseData }];
}
