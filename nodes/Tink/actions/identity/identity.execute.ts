/**
 * Identity Resource Execute
 * 
 * Implementation of identity operations for Tink API.
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { tinkApiRequest, getUserAccessToken } from '../../transport/tinkClient';
import { TINK_ENDPOINTS } from '../../constants/endpoints';

/**
 * Execute identity operations
 */
export async function executeIdentityOperations(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	const userId = this.getNodeParameter('userId', i) as string;
	const credentials = await this.getCredentials('tinkApi');
	const userToken = await getUserAccessToken.call(this, credentials, userId);
	
	let responseData: IDataObject | IDataObject[] = {};

	switch (operation) {
		case 'getIdentityData': {
			const options = this.getNodeParameter('options', i, {}) as IDataObject;
			
			const queryParams: IDataObject = {};
			if (options.credentialsId) {
				queryParams.credentialsId = options.credentialsId;
			}

			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.IDENTITY.DATA,
				{},
				queryParams,
				userToken,
			);
			break;
		}

		case 'verifyIdentity': {
			const verificationData = this.getNodeParameter('verificationData', i, {}) as IDataObject;

			const requestBody: IDataObject = {};
			
			if (verificationData.firstName || verificationData.lastName) {
				requestBody.name = {};
				if (verificationData.firstName) (requestBody.name as IDataObject).firstName = verificationData.firstName;
				if (verificationData.lastName) (requestBody.name as IDataObject).lastName = verificationData.lastName;
			}

			if (verificationData.dateOfBirth) {
				requestBody.dateOfBirth = new Date(verificationData.dateOfBirth as string).toISOString().split('T')[0];
			}

			if (verificationData.nationalId) {
				requestBody.nationalId = verificationData.nationalId;
			}

			if (verificationData.streetAddress || verificationData.city || verificationData.postalCode) {
				requestBody.address = {
					streetAddress: verificationData.streetAddress,
					city: verificationData.city,
					postalCode: verificationData.postalCode,
					country: verificationData.country,
				};
			}

			responseData = await tinkApiRequest.call(
				this,
				'POST',
				TINK_ENDPOINTS.IDENTITY.VERIFY,
				requestBody,
				{},
				userToken,
			);
			break;
		}

		case 'getIdentityVerification': {
			const verificationId = this.getNodeParameter('verificationId', i) as string;

			responseData = await tinkApiRequest.call(
				this,
				'GET',
				`${TINK_ENDPOINTS.IDENTITY.VERIFICATION}/${verificationId}`,
				{},
				{},
				userToken,
			);
			break;
		}

		case 'getPersonalInfo': {
			const options = this.getNodeParameter('options', i, {}) as IDataObject;

			const identityData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.IDENTITY.DATA,
				{},
				options.credentialsId ? { credentialsId: options.credentialsId } : {},
				userToken,
			);

			// Extract personal info from identity data
			const identity = identityData as IDataObject;
			responseData = {
				name: identity.name,
				dateOfBirth: identity.dateOfBirth,
				addresses: identity.addresses,
				nationalIds: identity.nationalIds,
				emails: identity.emails,
				phones: identity.phones,
			};
			break;
		}

		case 'getName': {
			const identityData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.IDENTITY.DATA,
				{},
				{},
				userToken,
			);

			const identity = identityData as IDataObject;
			responseData = {
				name: identity.name,
				fullName: identity.name ? 
					`${(identity.name as IDataObject).firstName || ''} ${(identity.name as IDataObject).lastName || ''}`.trim() : 
					null,
			};
			break;
		}

		case 'getDateOfBirth': {
			const identityData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.IDENTITY.DATA,
				{},
				{},
				userToken,
			);

			const identity = identityData as IDataObject;
			const dob = identity.dateOfBirth as string;
			
			responseData = {
				dateOfBirth: dob,
				age: dob ? Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null,
			};
			break;
		}

		case 'getAddress': {
			const identityData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.IDENTITY.DATA,
				{},
				{},
				userToken,
			);

			const identity = identityData as IDataObject;
			const addresses = identity.addresses as IDataObject[] || [];
			
			responseData = {
				addresses,
				primaryAddress: addresses.length > 0 ? addresses[0] : null,
			};
			break;
		}

		case 'getNationalId': {
			const identityData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.IDENTITY.DATA,
				{},
				{},
				userToken,
			);

			const identity = identityData as IDataObject;
			const nationalIds = identity.nationalIds as IDataObject[] || [];
			
			// Only return masked/partial data for security
			responseData = {
				hasNationalId: nationalIds.length > 0,
				nationalIdCount: nationalIds.length,
				// Return type information but mask actual values
				nationalIdTypes: nationalIds.map((id: IDataObject) => ({
					type: id.type,
					country: id.country,
					lastFourDigits: id.value ? (id.value as string).slice(-4) : null,
				})),
			};
			break;
		}
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: i } },
	);

	return executionData;
}
