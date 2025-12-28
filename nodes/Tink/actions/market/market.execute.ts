/**
 * Market Operations Execute
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { tinkApiRequest, tinkApiRequestAllItems } from '../../transport/tinkClient';
import { TINK_ENDPOINTS } from '../../constants/endpoints';
import { MARKETS, getMarketInfo } from '../../constants/markets';

export async function executeMarketOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[] = {};

	if (operation === 'list') {
		const listOptions = this.getNodeParameter('listOptions', i, {}) as IDataObject;

		// Get market data from API or use local constants
		try {
			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.MARKETS.BASE,
			);
			responseData = (responseData as IDataObject).markets as IDataObject[] || [];
		} catch {
			// Fallback to local market data
			const markets = Object.entries(MARKETS).map(([code, info]) => ({
				code,
				name: info.name,
				currency: info.currency,
				locale: info.locale,
				psd2Enabled: info.psd2,
				capabilities: {
					payments: info.payments,
					accounts: info.accounts,
				},
			}));

			if (listOptions.onlyPsd2) {
				responseData = markets.filter(m => m.psd2Enabled);
			} else {
				responseData = markets;
			}
		}
	}

	if (operation === 'get') {
		const market = this.getNodeParameter('market', i) as string;

		try {
			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.MARKETS.BY_CODE(market),
			);
		} catch {
			// Fallback to local market data
			const marketInfo = getMarketInfo(market);
			if (marketInfo) {
				responseData = {
					code: market,
					name: marketInfo.name,
					currency: marketInfo.currency,
					locale: marketInfo.locale,
					psd2Enabled: marketInfo.psd2,
					capabilities: {
						payments: marketInfo.payments,
						accounts: marketInfo.accounts,
					},
				};
			} else {
				throw new Error(`Market '${market}' not found`);
			}
		}
	}

	if (operation === 'getCurrencies') {
		const market = this.getNodeParameter('market', i) as string;

		try {
			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.MARKETS.CURRENCIES(market),
			);
		} catch {
			// Fallback to local market data
			const marketInfo = getMarketInfo(market);
			if (marketInfo) {
				responseData = {
					market,
					primaryCurrency: marketInfo.currency,
					supportedCurrencies: [marketInfo.currency, 'EUR'],
				};
			} else {
				throw new Error(`Market '${market}' not found`);
			}
		}
	}

	if (operation === 'getProviders') {
		const market = this.getNodeParameter('market', i) as string;
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const providerOptions = this.getNodeParameter('providerOptions', i, {}) as IDataObject;

		const qs: IDataObject = {
			market,
		};

		if (providerOptions.capability && (providerOptions.capability as string[]).length > 0) {
			qs.capability = (providerOptions.capability as string[]).join(',');
		}
		if (providerOptions.providerType && providerOptions.providerType !== 'ALL') {
			qs.type = providerOptions.providerType;
		}
		if (providerOptions.includeTestProviders !== undefined) {
			qs.includeTestProviders = providerOptions.includeTestProviders;
		}

		if (returnAll) {
			responseData = await tinkApiRequestAllItems.call(
				this,
				'providers',
				'GET',
				TINK_ENDPOINTS.PROVIDERS.BASE,
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			qs.pageSize = limit;
			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.PROVIDERS.BASE,
				{},
				qs,
			);
			responseData = (responseData as IDataObject).providers as IDataObject[] || [];
		}
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: i } },
	);

	return executionData;
}
