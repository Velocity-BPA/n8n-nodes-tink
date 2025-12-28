/**
 * Transfer Resource - Execute Functions
 * Handles bank-to-bank transfers and transfer management
 *
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { tinkApiRequest } from '../../transport/tinkClient';

/**
 * Create a new transfer
 */
export async function createTransfer(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const sourceAccountId = this.getNodeParameter('sourceAccountId', index) as string;
	const destinationAccountNumber = this.getNodeParameter('destinationAccountNumber', index) as string;
	const amount = this.getNodeParameter('amount', index) as number;
	const currency = this.getNodeParameter('currency', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body: IDataObject = {
		sourceAccountId,
		amount: {
			value: {
				unscaledValue: Math.round(amount * 100).toString(),
				scale: '2',
			},
			currencyCode: currency,
		},
		destinations: [
			{
				accountNumber: destinationAccountNumber,
				accountNumberType: additionalFields.accountNumberType || 'IBAN',
			},
		],
	};

	if (additionalFields.destinationBic) {
		(body.destinations as IDataObject[])[0].bic = additionalFields.destinationBic;
	}

	if (additionalFields.beneficiaryName) {
		body.beneficiary = {
			name: additionalFields.beneficiaryName,
		};
	}

	if (additionalFields.message) {
		body.messageToRecipient = additionalFields.message;
	}

	if (additionalFields.reference) {
		body.reference = additionalFields.reference;
	}

	if (additionalFields.executionDate) {
		body.executionDate = additionalFields.executionDate;
	}

	return tinkApiRequest.call(this, 'POST', '/api/v1/transfers', body);
}

/**
 * Get a specific transfer by ID
 */
export async function getTransfer(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const transferId = this.getNodeParameter('transferId', index) as string;

	return tinkApiRequest.call(this, 'GET', `/api/v1/transfers/${transferId}`);
}

/**
 * List all transfers
 */
export async function listTransfers(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const returnAll = this.getNodeParameter('returnAll', index) as boolean;
	const filters = this.getNodeParameter('filters', index) as IDataObject;

	const qs: IDataObject = {};

	if (filters.accountId) {
		qs.accountId = filters.accountId;
	}

	if (filters.status) {
		qs.status = filters.status;
	}

	if (filters.fromDate) {
		qs.fromDate = filters.fromDate;
	}

	if (filters.toDate) {
		qs.toDate = filters.toDate;
	}

	if (!returnAll) {
		const limit = this.getNodeParameter('limit', index) as number;
		qs.pageSize = limit;
	}

	const response = await tinkApiRequest.call(this, 'GET', '/api/v1/transfers', undefined, qs);

	return {
		transfers: response.transfers || [],
		nextPageToken: response.nextPageToken,
	};
}

/**
 * Get transfer status
 */
export async function getTransferStatus(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const transferId = this.getNodeParameter('transferId', index) as string;

	const transfer = await tinkApiRequest.call(this, 'GET', `/api/v1/transfers/${transferId}`);

	return {
		transferId,
		status: transfer.status,
		statusMessage: transfer.statusMessage,
		created: transfer.created,
		updated: transfer.updated,
	};
}

/**
 * Get accounts available for transfers
 */
export async function getTransferAccounts(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const filters = this.getNodeParameter('filters', index) as IDataObject;

	const qs: IDataObject = {};

	if (filters.capability) {
		qs.capability = filters.capability;
	}

	const response = await tinkApiRequest.call(this, 'GET', '/api/v1/transfer/accounts', undefined, qs);

	return {
		accounts: response.accounts || [],
	};
}

/**
 * Initiate a transfer (start signing process)
 */
export async function initiateTransfer(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const transferId = this.getNodeParameter('transferId', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body: IDataObject = {};

	if (additionalFields.redirectUrl) {
		body.redirectUrl = additionalFields.redirectUrl;
	}

	if (additionalFields.idHint) {
		body.idHint = additionalFields.idHint;
	}

	return tinkApiRequest.call(this, 'POST', `/api/v1/transfers/${transferId}/initiate`, body);
}

/**
 * Sign a transfer (complete authorization)
 */
export async function signTransfer(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const transferId = this.getNodeParameter('transferId', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const body: IDataObject = {};

	if (additionalFields.authenticationMethod) {
		body.authenticationMethod = additionalFields.authenticationMethod;
	}

	if (additionalFields.code) {
		body.code = additionalFields.code;
	}

	return tinkApiRequest.call(this, 'POST', `/api/v1/transfers/${transferId}/sign`, body);
}
