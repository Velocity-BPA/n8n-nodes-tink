/**
 * Enrichment Operations Execute
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { tinkApiRequest, tinkApiRequestAllItems } from '../../transport/tinkClient';
import { TINK_ENDPOINTS } from '../../constants/endpoints';

export async function executeEnrichmentOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[] = {};

	if (operation === 'enrichTransactions') {
		const userId = this.getNodeParameter('userId', i) as string;
		const transactionIds = this.getNodeParameter('transactionIds', i) as string;
		const enrichmentOptions = this.getNodeParameter('enrichmentOptions', i, {}) as IDataObject;

		const body: IDataObject = {
			transactionIds: transactionIds.split(',').map(id => id.trim()),
			options: {},
		};

		if (enrichmentOptions.includeCategories !== undefined) {
			(body.options as IDataObject).categories = enrichmentOptions.includeCategories;
		}
		if (enrichmentOptions.includeMerchant !== undefined) {
			(body.options as IDataObject).merchant = enrichmentOptions.includeMerchant;
		}
		if (enrichmentOptions.includePaymentType !== undefined) {
			(body.options as IDataObject).paymentType = enrichmentOptions.includePaymentType;
		}
		if (enrichmentOptions.includeRecurring !== undefined) {
			(body.options as IDataObject).recurring = enrichmentOptions.includeRecurring;
		}

		responseData = await tinkApiRequest.call(
			this,
			'POST',
			TINK_ENDPOINTS.ENRICHMENT.ENRICH,
			body,
			{},
			{ userId },
		);
	}

	if (operation === 'getEnrichment') {
		const enrichmentId = this.getNodeParameter('enrichmentId', i) as string;

		responseData = await tinkApiRequest.call(
			this,
			'GET',
			TINK_ENDPOINTS.ENRICHMENT.BY_ID(enrichmentId),
		);
	}

	if (operation === 'getMerchantInfo') {
		const merchantQuery = this.getNodeParameter('merchantQuery', i) as string;
		const merchantOptions = this.getNodeParameter('merchantOptions', i, {}) as IDataObject;

		const qs: IDataObject = {
			query: merchantQuery,
		};

		if (merchantOptions.market) {
			qs.market = merchantOptions.market;
		}
		if (merchantOptions.includeLogo !== undefined) {
			qs.includeLogo = merchantOptions.includeLogo;
		}

		responseData = await tinkApiRequest.call(
			this,
			'GET',
			TINK_ENDPOINTS.ENRICHMENT.MERCHANT,
			{},
			qs,
		);
	}

	if (operation === 'getCategorySuggestions') {
		const transactionDescription = this.getNodeParameter('transactionDescription', i) as string;
		const categoryOptions = this.getNodeParameter('categoryOptions', i, {}) as IDataObject;

		const body: IDataObject = {
			description: transactionDescription,
		};

		if (categoryOptions.amount) {
			body.amount = categoryOptions.amount;
		}
		if (categoryOptions.transactionType) {
			body.type = categoryOptions.transactionType;
		}
		if (categoryOptions.maxSuggestions) {
			body.maxSuggestions = categoryOptions.maxSuggestions;
		}

		responseData = await tinkApiRequest.call(
			this,
			'POST',
			TINK_ENDPOINTS.ENRICHMENT.CATEGORIES,
			body,
		);
	}

	if (operation === 'getEnrichedTransactions') {
		const userId = this.getNodeParameter('userId', i) as string;
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const transactionFilters = this.getNodeParameter('transactionFilters', i, {}) as IDataObject;

		const qs: IDataObject = {};

		if (transactionFilters.accountId) {
			qs.accountId = transactionFilters.accountId;
		}
		if (transactionFilters.categoryCode) {
			qs.categoryCode = transactionFilters.categoryCode;
		}
		if (transactionFilters.merchantName) {
			qs.merchantName = transactionFilters.merchantName;
		}
		if (transactionFilters.startDate) {
			qs.startDate = new Date(transactionFilters.startDate as string).toISOString().split('T')[0];
		}
		if (transactionFilters.endDate) {
			qs.endDate = new Date(transactionFilters.endDate as string).toISOString().split('T')[0];
		}

		if (returnAll) {
			responseData = await tinkApiRequestAllItems.call(
				this,
				'transactions',
				'GET',
				TINK_ENDPOINTS.ENRICHMENT.TRANSACTIONS,
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
				TINK_ENDPOINTS.ENRICHMENT.TRANSACTIONS,
				{},
				qs,
				{ userId },
			);
			responseData = (responseData as IDataObject).transactions as IDataObject[] || [];
		}
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: i } },
	);

	return executionData;
}
