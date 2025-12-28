/**
 * Connect Operations Execute (Tink Link)
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { tinkApiRequest } from '../../transport/tinkClient';
import { generateTinkLinkUrl, createAuthorizationGrant, exchangeCodeForToken } from '../../transport/oauthHandler';
import { TINK_ENDPOINTS } from '../../constants/endpoints';

export async function executeConnectOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[] = {};

	if (operation === 'createSession') {
		const externalUserId = this.getNodeParameter('externalUserId', i) as string;
		const market = this.getNodeParameter('market', i) as string;
		const locale = this.getNodeParameter('locale', i) as string;
		const sessionOptions = this.getNodeParameter('sessionOptions', i, {}) as IDataObject;

		const body: IDataObject = {
			externalUserId,
			market,
			locale,
		};

		if (sessionOptions.redirectUri) {
			body.redirectUri = sessionOptions.redirectUri;
		}
		if (sessionOptions.scopes && (sessionOptions.scopes as string[]).length > 0) {
			body.scope = (sessionOptions.scopes as string[]).join(',');
		}
		if (sessionOptions.inputProvider) {
			body.inputProvider = sessionOptions.inputProvider;
		}
		if (sessionOptions.sessionExpiry) {
			body.sessionExpiry = sessionOptions.sessionExpiry;
		}
		if (sessionOptions.test !== undefined) {
			body.test = sessionOptions.test;
		}

		// Create the session
		const session = await tinkApiRequest.call(
			this,
			'POST',
			TINK_ENDPOINTS.CONNECT.SESSION,
			body,
		) as IDataObject;

		// Generate the Tink Link URL
		const tinkLinkUrl = await generateTinkLinkUrl.call(this, {
			clientId: session.clientId as string || '',
			redirectUri: sessionOptions.redirectUri as string || '',
			market,
			locale,
			scope: sessionOptions.scopes as string[] || ['accounts:read', 'transactions:read'],
			sessionId: session.id as string,
			test: sessionOptions.test as boolean,
		});

		responseData = {
			...session,
			tinkLinkUrl,
		};
	}

	if (operation === 'getConnectUrl') {
		const sessionId = this.getNodeParameter('sessionId', i) as string;

		// Get session details
		const session = await tinkApiRequest.call(
			this,
			'GET',
			TINK_ENDPOINTS.CONNECT.SESSION_BY_ID(sessionId),
		) as IDataObject;

		// Generate URL
		const tinkLinkUrl = await generateTinkLinkUrl.call(this, {
			clientId: session.clientId as string || '',
			redirectUri: session.redirectUri as string || '',
			market: session.market as string || 'SE',
			locale: session.locale as string || 'en_US',
			scope: (session.scope as string || '').split(','),
			sessionId,
		});

		responseData = {
			sessionId,
			url: tinkLinkUrl,
			expiresAt: session.expiresAt,
		};
	}

	if (operation === 'getSessionStatus') {
		const sessionId = this.getNodeParameter('sessionId', i) as string;

		const session = await tinkApiRequest.call(
			this,
			'GET',
			TINK_ENDPOINTS.CONNECT.SESSION_BY_ID(sessionId),
		) as IDataObject;

		responseData = {
			sessionId,
			status: session.status,
			externalUserId: session.externalUserId,
			credentialsId: session.credentialsId,
			providerId: session.providerId,
			createdAt: session.createdAt,
			expiresAt: session.expiresAt,
			completedAt: session.completedAt,
		};
	}

	if (operation === 'getAuthorizationGrant') {
		const externalUserId = this.getNodeParameter('externalUserId', i) as string;
		const scopes = this.getNodeParameter('scopes', i) as string[];

		const grant = await createAuthorizationGrant.call(this, externalUserId, scopes);

		responseData = {
			code: grant.code,
			externalUserId,
			scopes,
			expiresIn: grant.expiresIn || 300,
		};
	}

	if (operation === 'exchangeGrant') {
		const code = this.getNodeParameter('code', i) as string;

		const tokens = await exchangeCodeForToken.call(this, code);

		responseData = {
			accessToken: tokens.access_token,
			tokenType: tokens.token_type,
			expiresIn: tokens.expires_in,
			refreshToken: tokens.refresh_token,
			scope: tokens.scope,
		};
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: i } },
	);

	return executionData;
}
