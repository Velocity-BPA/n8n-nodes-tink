/**
 * Consent Operations Execute
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { tinkApiRequest, tinkApiRequestAllItems } from '../../transport/tinkClient';
import { TINK_ENDPOINTS } from '../../constants/endpoints';

export async function executeConsentOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[] = {};

	if (operation === 'list') {
		const userId = this.getNodeParameter('userId', i) as string;
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i) as IDataObject;

		const qs: IDataObject = { ...filters };

		if (returnAll) {
			responseData = await tinkApiRequestAllItems.call(
				this,
				'consents',
				'GET',
				TINK_ENDPOINTS.CONSENTS.BASE,
				{},
				qs,
				{ userId },
			);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			qs.pageSize = limit;
			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.CONSENTS.BASE,
				{},
				qs,
				{ userId },
			);
			responseData = (responseData as IDataObject).consents as IDataObject[] || [];
		}
	}

	if (operation === 'get') {
		const consentId = this.getNodeParameter('consentId', i) as string;

		responseData = await tinkApiRequest.call(
			this,
			'GET',
			TINK_ENDPOINTS.CONSENTS.BY_ID(consentId),
		);
	}

	if (operation === 'getStatus') {
		const consentId = this.getNodeParameter('consentId', i) as string;

		const consent = await tinkApiRequest.call(
			this,
			'GET',
			TINK_ENDPOINTS.CONSENTS.BY_ID(consentId),
		) as IDataObject;

		responseData = {
			consentId,
			status: consent.status,
			expiresAt: consent.expiresAt,
			validUntil: consent.validUntil,
			scopes: consent.scopes,
		};
	}

	if (operation === 'revoke') {
		const consentId = this.getNodeParameter('consentId', i) as string;
		const revokeOptions = this.getNodeParameter('revokeOptions', i) as IDataObject;

		const body: IDataObject = {};
		if (revokeOptions.deleteData) {
			body.deleteAssociatedData = revokeOptions.deleteData;
		}
		if (revokeOptions.reason) {
			body.reason = revokeOptions.reason;
		}

		await tinkApiRequest.call(
			this,
			'POST',
			`${TINK_ENDPOINTS.CONSENTS.BY_ID(consentId)}/revoke`,
			body,
		);

		responseData = { success: true, revoked: consentId };
	}

	if (operation === 'extend') {
		const consentId = this.getNodeParameter('consentId', i) as string;
		const extensionDays = this.getNodeParameter('extensionDays', i) as number;

		responseData = await tinkApiRequest.call(
			this,
			'POST',
			`${TINK_ENDPOINTS.CONSENTS.BY_ID(consentId)}/extend`,
			{ extensionDays },
		);
	}

	if (operation === 'getSessions') {
		const userId = this.getNodeParameter('userId', i) as string;
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;

		if (returnAll) {
			responseData = await tinkApiRequestAllItems.call(
				this,
				'sessions',
				'GET',
				TINK_ENDPOINTS.CONSENTS.SESSIONS,
				{},
				{},
				{ userId },
			);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.CONSENTS.SESSIONS,
				{},
				{ pageSize: limit },
				{ userId },
			);
			responseData = (responseData as IDataObject).sessions as IDataObject[] || [];
		}
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: i } },
	);

	return executionData;
}
