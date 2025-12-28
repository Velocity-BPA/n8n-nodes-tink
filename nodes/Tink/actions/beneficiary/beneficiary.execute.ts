/**
 * Beneficiary Operations Execute
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { tinkApiRequest, tinkApiRequestAllItems } from '../../transport/tinkClient';
import { TINK_ENDPOINTS } from '../../constants/endpoints';

export async function executeBeneficiaryOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[] = {};

	if (operation === 'create') {
		const userId = this.getNodeParameter('userId', i) as string;
		const accountNumber = this.getNodeParameter('accountNumber', i) as string;
		const name = this.getNodeParameter('name', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = {
			accountNumber,
			name,
			...additionalFields,
		};

		responseData = await tinkApiRequest.call(
			this,
			'POST',
			TINK_ENDPOINTS.BENEFICIARIES.BASE,
			body,
			{},
			{ userId },
		);
	}

	if (operation === 'get') {
		const beneficiaryId = this.getNodeParameter('beneficiaryId', i) as string;

		responseData = await tinkApiRequest.call(
			this,
			'GET',
			TINK_ENDPOINTS.BENEFICIARIES.BY_ID(beneficiaryId),
		);
	}

	if (operation === 'update') {
		const beneficiaryId = this.getNodeParameter('beneficiaryId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

		responseData = await tinkApiRequest.call(
			this,
			'PUT',
			TINK_ENDPOINTS.BENEFICIARIES.BY_ID(beneficiaryId),
			updateFields,
		);
	}

	if (operation === 'delete') {
		const beneficiaryId = this.getNodeParameter('beneficiaryId', i) as string;

		await tinkApiRequest.call(
			this,
			'DELETE',
			TINK_ENDPOINTS.BENEFICIARIES.BY_ID(beneficiaryId),
		);

		responseData = { success: true, deleted: beneficiaryId };
	}

	if (operation === 'list') {
		const userId = this.getNodeParameter('userId', i) as string;
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;

		if (returnAll) {
			responseData = await tinkApiRequestAllItems.call(
				this,
				'beneficiaries',
				'GET',
				TINK_ENDPOINTS.BENEFICIARIES.BASE,
				{},
				{},
				{ userId },
			);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.BENEFICIARIES.BASE,
				{},
				{ pageSize: limit },
				{ userId },
			);
			responseData = (responseData as IDataObject).beneficiaries as IDataObject[] || [];
		}
	}

	if (operation === 'getAccounts') {
		const userId = this.getNodeParameter('userId', i) as string;

		responseData = await tinkApiRequest.call(
			this,
			'GET',
			TINK_ENDPOINTS.BENEFICIARIES.ACCOUNTS,
			{},
			{},
			{ userId },
		);
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: i } },
	);

	return executionData;
}
