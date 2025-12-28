/**
 * Access Token Operations Execute
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { getClientAccessToken, getUserAccessToken } from '../../transport/tinkClient';
import { exchangeCodeForToken, refreshUserToken, revokeToken } from '../../transport/oauthHandler';
import { decodeJwt, getTokenScopes, getTokenExpiration, getUserIdFromToken } from '../../utils/tokenUtils';

export async function executeAccessTokenOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[] = {};

	if (operation === 'getAccessToken') {
		const grantType = this.getNodeParameter('grantType', i) as string;
		const scopes = this.getNodeParameter('scopes', i, []) as string[];

		if (grantType === 'client_credentials') {
			const token = await getClientAccessToken.call(
				this,
				scopes.length > 0 ? scopes.join(' ') : undefined,
			);
			responseData = {
				accessToken: token,
				tokenType: 'Bearer',
				grantType: 'client_credentials',
				scopes,
			};
		} else if (grantType === 'authorization_code') {
			const authorizationCode = this.getNodeParameter('authorizationCode', i) as string;
			const tokens = await exchangeCodeForToken.call(this, authorizationCode);
			responseData = {
				accessToken: tokens.access_token,
				refreshToken: tokens.refresh_token,
				tokenType: tokens.token_type,
				expiresIn: tokens.expires_in,
				scope: tokens.scope,
			};
		} else if (grantType === 'refresh_token') {
			const refreshTokenValue = this.getNodeParameter('refreshTokenValue', i) as string;
			const tokens = await refreshUserToken.call(this, refreshTokenValue);
			responseData = {
				accessToken: tokens.access_token,
				refreshToken: tokens.refresh_token,
				tokenType: tokens.token_type,
				expiresIn: tokens.expires_in,
				scope: tokens.scope,
			};
		}
	}

	if (operation === 'getClientAccessToken') {
		const scopes = this.getNodeParameter('scopes', i, []) as string[];

		const token = await getClientAccessToken.call(
			this,
			scopes.length > 0 ? scopes.join(' ') : undefined,
		);

		responseData = {
			accessToken: token,
			tokenType: 'Bearer',
			scopes,
		};
	}

	if (operation === 'getUserAccessToken') {
		const externalUserId = this.getNodeParameter('externalUserId', i) as string;
		const userScopes = this.getNodeParameter('userScopes', i) as string[];

		const token = await getUserAccessToken.call(
			this,
			externalUserId,
			userScopes.join(' '),
		);

		responseData = {
			accessToken: token,
			tokenType: 'Bearer',
			externalUserId,
			scopes: userScopes,
		};
	}

	if (operation === 'refreshToken') {
		const refreshToken = this.getNodeParameter('refreshToken', i) as string;

		const tokens = await refreshUserToken.call(this, refreshToken);

		responseData = {
			accessToken: tokens.access_token,
			refreshToken: tokens.refresh_token,
			tokenType: tokens.token_type,
			expiresIn: tokens.expires_in,
			scope: tokens.scope,
		};
	}

	if (operation === 'revokeToken') {
		const token = this.getNodeParameter('token', i) as string;
		const tokenTypeHint = this.getNodeParameter('tokenTypeHint', i) as string;

		await revokeToken.call(this, token, tokenTypeHint);

		responseData = {
			success: true,
			message: 'Token revoked successfully',
		};
	}

	if (operation === 'getTokenInfo') {
		const token = this.getNodeParameter('token', i) as string;

		try {
			const decoded = decodeJwt(token);
			const scopes = getTokenScopes(token);
			const expiration = getTokenExpiration(token);
			const userId = getUserIdFromToken(token);

			responseData = {
				valid: true,
				scopes,
				expiresAt: expiration ? new Date(expiration * 1000).toISOString() : null,
				isExpired: expiration ? Date.now() / 1000 > expiration : false,
				userId,
				claims: decoded,
			};
		} catch {
			responseData = {
				valid: false,
				error: 'Invalid or malformed token',
			};
		}
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: i } },
	);

	return executionData;
}
