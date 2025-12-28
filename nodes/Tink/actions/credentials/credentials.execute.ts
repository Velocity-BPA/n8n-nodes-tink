/**
 * Credentials Resource Execute
 * 
 * Implementation of credentials (bank connection) operations for Tink API.
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { tinkApiRequest, getUserAccessToken } from '../../transport/tinkClient';
import { TINK_ENDPOINTS } from '../../constants/endpoints';

/**
 * Execute credentials operations
 */
export async function executeCredentialsOperations(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	const userId = this.getNodeParameter('userId', i) as string;
	const credentials = await this.getCredentials('tinkApi');
	const userToken = await getUserAccessToken.call(this, credentials, userId);
	
	let responseData: IDataObject | IDataObject[] = {};

	switch (operation) {
		case 'createCredentials': {
			const providerId = this.getNodeParameter('providerId', i) as string;

			responseData = await tinkApiRequest.call(
				this,
				'POST',
				TINK_ENDPOINTS.CREDENTIALS.CREATE,
				{
					providerId,
				},
				{},
				userToken,
			);
			break;
		}

		case 'getCredentials': {
			const credentialsId = this.getNodeParameter('credentialsId', i) as string;

			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.CREDENTIALS.GET.replace('{credentialsId}', credentialsId),
				{},
				{},
				userToken,
			);
			break;
		}

		case 'updateCredentials': {
			const credentialsId = this.getNodeParameter('credentialsId', i) as string;

			// Trigger an update/refresh of the credentials
			responseData = await tinkApiRequest.call(
				this,
				'POST',
				TINK_ENDPOINTS.CREDENTIALS.REFRESH.replace('{credentialsId}', credentialsId),
				{},
				{},
				userToken,
			);
			break;
		}

		case 'deleteCredentials': {
			const credentialsId = this.getNodeParameter('credentialsId', i) as string;

			await tinkApiRequest.call(
				this,
				'DELETE',
				TINK_ENDPOINTS.CREDENTIALS.DELETE.replace('{credentialsId}', credentialsId),
				{},
				{},
				userToken,
			);

			responseData = {
				success: true,
				message: 'Credentials deleted successfully',
				credentialsId,
			};
			break;
		}

		case 'listCredentials': {
			const options = this.getNodeParameter('options', i, {}) as IDataObject;

			const result = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.CREDENTIALS.LIST,
				{},
				{},
				userToken,
			);

			let credentialsList = (result as IDataObject).credentials as IDataObject[] || [];

			// Filter by status if specified
			if (options.status && options.status !== 'ALL') {
				credentialsList = credentialsList.filter(
					(cred: IDataObject) => cred.status === options.status
				);
			}

			// Include accounts if requested
			if (options.includeAccounts) {
				for (const cred of credentialsList) {
					try {
						const accounts = await tinkApiRequest.call(
							this,
							'GET',
							TINK_ENDPOINTS.ACCOUNTS.LIST,
							{},
							{ credentialsId: cred.id },
							userToken,
						);
						cred.accounts = (accounts as IDataObject).accounts;
					} catch {
						cred.accounts = [];
					}
				}
			}

			responseData = { credentials: credentialsList, count: credentialsList.length };
			break;
		}

		case 'refreshCredentials': {
			const credentialsId = this.getNodeParameter('credentialsId', i) as string;

			responseData = await tinkApiRequest.call(
				this,
				'POST',
				TINK_ENDPOINTS.CREDENTIALS.REFRESH.replace('{credentialsId}', credentialsId),
				{},
				{},
				userToken,
			);
			break;
		}

		case 'getProviderCredentials': {
			const providerId = this.getNodeParameter('providerId', i) as string;

			// Get all credentials and filter by provider
			const result = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.CREDENTIALS.LIST,
				{},
				{},
				userToken,
			);

			const credentialsList = ((result as IDataObject).credentials as IDataObject[] || [])
				.filter((cred: IDataObject) => cred.providerName === providerId);

			responseData = { credentials: credentialsList, providerId, count: credentialsList.length };
			break;
		}

		case 'authenticateCredentials': {
			const credentialsId = this.getNodeParameter('credentialsId', i) as string;

			responseData = await tinkApiRequest.call(
				this,
				'POST',
				TINK_ENDPOINTS.CREDENTIALS.AUTHENTICATE?.replace('{credentialsId}', credentialsId) || 
					`/api/v1/credentials/${credentialsId}/authenticate`,
				{},
				{},
				userToken,
			);
			break;
		}

		case 'getThirdPartyCallback': {
			const credentialsId = this.getNodeParameter('credentialsId', i) as string;

			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.CREDENTIALS.THIRD_PARTY_CALLBACK?.replace('{credentialsId}', credentialsId) ||
					`/api/v1/credentials/${credentialsId}/third-party-callback`,
				{},
				{},
				userToken,
			);
			break;
		}

		case 'supplementalInformation': {
			const credentialsId = this.getNodeParameter('credentialsId', i) as string;
			const supplementalFields = this.getNodeParameter('supplementalFields', i, {}) as IDataObject;
			
			const fields: IDataObject = {};
			if (supplementalFields.fields) {
				for (const field of supplementalFields.fields as IDataObject[]) {
					fields[field.name as string] = field.value;
				}
			}

			responseData = await tinkApiRequest.call(
				this,
				'POST',
				TINK_ENDPOINTS.CREDENTIALS.SUPPLEMENTAL?.replace('{credentialsId}', credentialsId) ||
					`/api/v1/credentials/${credentialsId}/supplemental-information`,
				{ fields },
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
