/**
 * Payment Resource Execute
 * 
 * Implementation of payment operations for Tink API.
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { tinkApiRequest, getUserAccessToken } from '../../transport/tinkClient';
import { TINK_ENDPOINTS } from '../../constants/endpoints';

/**
 * Execute payment operations
 */
export async function executePaymentOperations(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	const userId = this.getNodeParameter('userId', i) as string;
	const credentials = await this.getCredentials('tinkApi');
	const userToken = await getUserAccessToken.call(this, credentials, userId);
	
	let responseData: IDataObject | IDataObject[] = {};

	switch (operation) {
		case 'createPayment': {
			const amount = this.getNodeParameter('amount', i) as number;
			const currency = this.getNodeParameter('currency', i) as string;
			const sourceAccount = this.getNodeParameter('sourceAccount', i) as string;
			const destinationIban = this.getNodeParameter('destinationIban', i) as string;
			const beneficiaryName = this.getNodeParameter('beneficiaryName', i) as string;
			const reference = this.getNodeParameter('reference', i, '') as string;
			const options = this.getNodeParameter('options', i, {}) as IDataObject;

			const requestBody: IDataObject = {
				amount: {
					value: {
						unscaledValue: Math.round(amount * 100).toString(),
						scale: '2',
					},
					currencyCode: currency,
				},
				creditor: {
					accountIdentifier: {
						type: 'IBAN',
						iban: destinationIban,
					},
					name: beneficiaryName,
				},
				debtor: {
					accountIdentifier: sourceAccount.length > 20 ? {
						type: 'IBAN',
						iban: sourceAccount,
					} : {
						type: 'TINK_ACCOUNT_ID',
						accountId: sourceAccount,
					},
				},
			};

			if (reference) {
				requestBody.remittanceInformation = {
					value: reference,
					type: 'UNSTRUCTURED',
				};
			}

			if (options.bic) {
				(requestBody.creditor as IDataObject).agent = {
					bic: options.bic,
				};
			}

			if (options.executionDate) {
				requestBody.requestedExecutionDate = new Date(options.executionDate as string).toISOString().split('T')[0];
			}

			responseData = await tinkApiRequest.call(
				this,
				'POST',
				TINK_ENDPOINTS.PAYMENTS.CREATE,
				requestBody,
				{},
				userToken,
			);
			break;
		}

		case 'getPayment': {
			const paymentId = this.getNodeParameter('paymentId', i) as string;

			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.PAYMENTS.GET.replace('{paymentId}', paymentId),
				{},
				{},
				userToken,
			);
			break;
		}

		case 'getPaymentStatus': {
			const paymentId = this.getNodeParameter('paymentId', i) as string;

			const payment = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.PAYMENTS.GET.replace('{paymentId}', paymentId),
				{},
				{},
				userToken,
			);

			responseData = {
				paymentId,
				status: (payment as IDataObject).status,
				statusMessage: (payment as IDataObject).statusMessage,
				created: (payment as IDataObject).created,
				updated: (payment as IDataObject).updated,
			};
			break;
		}

		case 'listPayments': {
			const options = this.getNodeParameter('options', i, {}) as IDataObject;

			const result = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.PAYMENTS.LIST,
				{},
				{},
				userToken,
			);

			let payments = (result as IDataObject).payments as IDataObject[] || [];

			// Filter by status if specified
			if (options.status && options.status !== 'ALL') {
				payments = payments.filter(
					(payment: IDataObject) => payment.status === options.status
				);
			}

			responseData = { payments, count: payments.length };
			break;
		}

		case 'cancelPayment': {
			const paymentId = this.getNodeParameter('paymentId', i) as string;

			await tinkApiRequest.call(
				this,
				'DELETE',
				TINK_ENDPOINTS.PAYMENTS.CANCEL?.replace('{paymentId}', paymentId) ||
					`/payment-initiation/v1/payments/${paymentId}`,
				{},
				{},
				userToken,
			);

			responseData = {
				success: true,
				message: 'Payment cancelled successfully',
				paymentId,
			};
			break;
		}

		case 'signPayment': {
			const paymentId = this.getNodeParameter('paymentId', i) as string;

			responseData = await tinkApiRequest.call(
				this,
				'POST',
				TINK_ENDPOINTS.PAYMENTS.SIGN?.replace('{paymentId}', paymentId) ||
					`/payment-initiation/v1/payments/${paymentId}/sign`,
				{},
				{},
				userToken,
			);
			break;
		}
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: i } },
	);

	return executionData;
}
