/**
 * Provider Resource Execute
 * 
 * Implementation of provider operations for Tink API.
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { tinkApiRequest, getClientAccessToken } from '../../transport/tinkClient';
import { TINK_ENDPOINTS } from '../../constants/endpoints';

/**
 * Execute provider operations
 */
export async function executeProviderOperations(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	const credentials = await this.getCredentials('tinkApi');
	// Provider operations use client-level tokens
	const clientToken = await getClientAccessToken.call(this, credentials);
	
	let responseData: IDataObject | IDataObject[] = {};

	switch (operation) {
		case 'getProviders': {
			const options = this.getNodeParameter('options', i, {}) as IDataObject;

			const queryParams: IDataObject = {};
			if (options.pageSize) queryParams.pageSize = options.pageSize;
			if (!options.includeDisabled) queryParams.excludeNonTestProviders = false;

			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.PROVIDERS.LIST,
				{},
				queryParams,
				clientToken,
			);

			// Filter by capabilities if specified
			if (options.capability && (options.capability as string[]).length > 0) {
				const providers = (responseData as IDataObject).providers as IDataObject[] || [];
				(responseData as IDataObject).providers = providers.filter((provider: IDataObject) => {
					const providerCapabilities = provider.capabilities as string[] || [];
					return (options.capability as string[]).some(cap => providerCapabilities.includes(cap));
				});
			}

			// Filter by access type if specified
			if (options.accessType && options.accessType !== 'ALL') {
				const providers = (responseData as IDataObject).providers as IDataObject[] || [];
				(responseData as IDataObject).providers = providers.filter((provider: IDataObject) => {
					if (options.accessType === 'OPEN_BANKING') {
						return provider.accessType === 'OPEN_BANKING' || provider.accessType === 'PSD2';
					}
					return provider.accessType !== 'OPEN_BANKING' && provider.accessType !== 'PSD2';
				});
			}
			break;
		}

		case 'getProvider': {
			const providerId = this.getNodeParameter('providerId', i) as string;

			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.PROVIDERS.GET.replace('{providerId}', providerId),
				{},
				{},
				clientToken,
			);
			break;
		}

		case 'getProvidersByMarket': {
			const market = this.getNodeParameter('market', i) as string;
			const options = this.getNodeParameter('options', i, {}) as IDataObject;

			const queryParams: IDataObject = {
				market,
			};
			if (options.pageSize) queryParams.pageSize = options.pageSize;

			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.PROVIDERS.LIST,
				{},
				queryParams,
				clientToken,
			);

			// Filter by capabilities if specified
			if (options.capability && (options.capability as string[]).length > 0) {
				const providers = (responseData as IDataObject).providers as IDataObject[] || [];
				(responseData as IDataObject).providers = providers.filter((provider: IDataObject) => {
					const providerCapabilities = provider.capabilities as string[] || [];
					return (options.capability as string[]).some(cap => providerCapabilities.includes(cap));
				});
			}

			(responseData as IDataObject).market = market;
			break;
		}

		case 'getProviderCapabilities': {
			const providerId = this.getNodeParameter('providerId', i) as string;

			const provider = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.PROVIDERS.GET.replace('{providerId}', providerId),
				{},
				{},
				clientToken,
			);

			responseData = {
				providerId,
				providerName: (provider as IDataObject).displayName || (provider as IDataObject).name,
				capabilities: (provider as IDataObject).capabilities || [],
				accessType: (provider as IDataObject).accessType,
				financialInstitutionId: (provider as IDataObject).financialInstitutionId,
				market: (provider as IDataObject).market,
				status: (provider as IDataObject).status,
				releaseStatus: (provider as IDataObject).releaseStatus,
				credentialsType: (provider as IDataObject).credentialsType,
				passwordHelpText: (provider as IDataObject).passwordHelpText,
				popular: (provider as IDataObject).popular,
			};
			break;
		}

		case 'searchProviders': {
			const searchQuery = this.getNodeParameter('searchQuery', i) as string;
			const options = this.getNodeParameter('options', i, {}) as IDataObject;

			const allProviders = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.PROVIDERS.LIST,
				{},
				{ pageSize: options.pageSize || 1000 },
				clientToken,
			);

			const providers = ((allProviders as IDataObject).providers as IDataObject[] || [])
				.filter((provider: IDataObject) => {
					const name = ((provider.displayName || provider.name) as string || '').toLowerCase();
					const financialInstitutionName = (provider.financialInstitutionName as string || '').toLowerCase();
					const query = searchQuery.toLowerCase();
					return name.includes(query) || financialInstitutionName.includes(query);
				});

			responseData = { providers, searchQuery, count: providers.length };
			break;
		}

		case 'getFinancialInstitutions': {
			const options = this.getNodeParameter('options', i, {}) as IDataObject;

			const queryParams: IDataObject = {};
			if (options.pageSize) queryParams.pageSize = options.pageSize;

			// Get providers and extract unique financial institutions
			const allProviders = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.PROVIDERS.LIST,
				{},
				queryParams,
				clientToken,
			);

			const providers = (allProviders as IDataObject).providers as IDataObject[] || [];
			const institutionsMap = new Map<string, IDataObject>();

			for (const provider of providers) {
				const fiId = provider.financialInstitutionId as string;
				if (fiId && !institutionsMap.has(fiId)) {
					institutionsMap.set(fiId, {
						id: fiId,
						name: provider.financialInstitutionName || provider.displayName,
						market: provider.market,
						providers: [],
					});
				}
				if (fiId) {
					(institutionsMap.get(fiId)!.providers as IDataObject[]).push({
						id: provider.name,
						displayName: provider.displayName,
						accessType: provider.accessType,
					});
				}
			}

			responseData = { 
				financialInstitutions: Array.from(institutionsMap.values()),
				count: institutionsMap.size,
			};
			break;
		}

		case 'getProviderFields': {
			const providerId = this.getNodeParameter('providerId', i) as string;

			const provider = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.PROVIDERS.GET.replace('{providerId}', providerId),
				{},
				{},
				clientToken,
			);

			responseData = {
				providerId,
				providerName: (provider as IDataObject).displayName || (provider as IDataObject).name,
				fields: (provider as IDataObject).fields || [],
				credentialsType: (provider as IDataObject).credentialsType,
				passwordHelpText: (provider as IDataObject).passwordHelpText,
				helpText: (provider as IDataObject).helpText,
				loginHeaderText: (provider as IDataObject).loginHeaderText,
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
