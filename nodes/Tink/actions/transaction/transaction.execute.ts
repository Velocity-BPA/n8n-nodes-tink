/**
 * Transaction Resource Execute
 * 
 * Implementation of transaction operations for Tink API.
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { tinkApiRequest, getUserAccessToken } from '../../transport/tinkClient';
import { TINK_ENDPOINTS } from '../../constants/endpoints';

/**
 * Execute transaction operations
 */
export async function executeTransactionOperations(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	const userId = this.getNodeParameter('userId', i) as string;
	const credentials = await this.getCredentials('tinkApi');
	const userToken = await getUserAccessToken.call(this, credentials, userId);
	
	let responseData: IDataObject | IDataObject[] = {};

	switch (operation) {
		case 'getTransactions': {
			const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
			const options = this.getNodeParameter('options', i, {}) as IDataObject;
			
			const queryParams: IDataObject = {};
			
			if (options.pageSize) queryParams.pageSize = options.pageSize;
			if (options.pageToken) queryParams.pageToken = options.pageToken;
			if (filters.accountIds) queryParams.accountIdIn = (filters.accountIds as string).split(',').map(s => s.trim());
			if (filters.startDate) queryParams.bookedDateGte = new Date(filters.startDate as string).toISOString().split('T')[0];
			if (filters.endDate) queryParams.bookedDateLte = new Date(filters.endDate as string).toISOString().split('T')[0];
			if (filters.status && filters.status !== 'ALL') queryParams.statusIn = [filters.status];

			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.TRANSACTIONS.LIST,
				{},
				queryParams,
				userToken,
			);
			break;
		}

		case 'getTransaction': {
			const transactionId = this.getNodeParameter('transactionId', i) as string;
			
			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.TRANSACTIONS.GET.replace('{transactionId}', transactionId),
				{},
				{},
				userToken,
			);
			break;
		}

		case 'searchTransactions': {
			const searchQuery = this.getNodeParameter('searchQuery', i, '') as string;
			const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
			const options = this.getNodeParameter('options', i, {}) as IDataObject;
			
			const queryParams: IDataObject = {};
			
			if (searchQuery) queryParams.queryString = searchQuery;
			if (options.pageSize) queryParams.pageSize = options.pageSize;
			if (options.pageToken) queryParams.pageToken = options.pageToken;
			if (filters.accountIds) queryParams.accountIdIn = (filters.accountIds as string).split(',').map(s => s.trim());
			if (filters.categories) queryParams.categoryIdIn = (filters.categories as string).split(',').map(s => s.trim());
			if (filters.minAmount) queryParams.amountGte = { value: { unscaledValue: Math.round((filters.minAmount as number) * 100), scale: 2 } };
			if (filters.maxAmount) queryParams.amountLte = { value: { unscaledValue: Math.round((filters.maxAmount as number) * 100), scale: 2 } };
			if (filters.startDate) queryParams.bookedDateGte = new Date(filters.startDate as string).toISOString().split('T')[0];
			if (filters.endDate) queryParams.bookedDateLte = new Date(filters.endDate as string).toISOString().split('T')[0];

			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.TRANSACTIONS.SEARCH || TINK_ENDPOINTS.TRANSACTIONS.LIST,
				{},
				queryParams,
				userToken,
			);
			break;
		}

		case 'getTransactionsByAccount': {
			const accountId = this.getNodeParameter('accountId', i) as string;
			const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
			const options = this.getNodeParameter('options', i, {}) as IDataObject;
			
			const queryParams: IDataObject = {
				accountIdIn: [accountId],
			};
			
			if (options.pageSize) queryParams.pageSize = options.pageSize;
			if (options.pageToken) queryParams.pageToken = options.pageToken;
			if (filters.startDate) queryParams.bookedDateGte = new Date(filters.startDate as string).toISOString().split('T')[0];
			if (filters.endDate) queryParams.bookedDateLte = new Date(filters.endDate as string).toISOString().split('T')[0];

			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.TRANSACTIONS.LIST,
				{},
				queryParams,
				userToken,
			);
			break;
		}

		case 'getTransactionsByDate': {
			const startDate = this.getNodeParameter('startDate', i) as string;
			const endDate = this.getNodeParameter('endDate', i) as string;
			const options = this.getNodeParameter('options', i, {}) as IDataObject;
			
			const queryParams: IDataObject = {
				bookedDateGte: new Date(startDate).toISOString().split('T')[0],
				bookedDateLte: new Date(endDate).toISOString().split('T')[0],
			};
			
			if (options.pageSize) queryParams.pageSize = options.pageSize;
			if (options.pageToken) queryParams.pageToken = options.pageToken;

			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.TRANSACTIONS.LIST,
				{},
				queryParams,
				userToken,
			);
			break;
		}

		case 'getPendingTransactions': {
			const options = this.getNodeParameter('options', i, {}) as IDataObject;
			
			const queryParams: IDataObject = {
				statusIn: ['PENDING'],
			};
			
			if (options.pageSize) queryParams.pageSize = options.pageSize;
			if (options.pageToken) queryParams.pageToken = options.pageToken;

			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.TRANSACTIONS.LIST,
				{},
				queryParams,
				userToken,
			);
			break;
		}

		case 'getTransactionCategories': {
			const options = this.getNodeParameter('options', i, {}) as IDataObject;
			
			// Get all transactions and aggregate by category
			const allTransactions = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.TRANSACTIONS.LIST,
				{},
				{ pageSize: options.pageSize || 1000 },
				userToken,
			);

			const transactions = (allTransactions as IDataObject).transactions as IDataObject[] || [];
			const categoryStats: { [key: string]: { count: number; totalAmount: number; transactions: string[] } } = {};

			for (const tx of transactions) {
				const categoryId = (tx.categories as IDataObject)?.pfm?.id as string || 'uncategorized';
				if (!categoryStats[categoryId]) {
					categoryStats[categoryId] = { count: 0, totalAmount: 0, transactions: [] };
				}
				categoryStats[categoryId].count++;
				const amount = (tx.amount as IDataObject)?.value?.unscaledValue as number || 0;
				const scale = (tx.amount as IDataObject)?.value?.scale as number || 2;
				categoryStats[categoryId].totalAmount += amount / Math.pow(10, scale);
				categoryStats[categoryId].transactions.push(tx.id as string);
			}

			responseData = { categories: categoryStats, totalTransactions: transactions.length };
			break;
		}

		case 'categorizeTransaction': {
			const transactionId = this.getNodeParameter('transactionId', i) as string;
			const categoryCode = this.getNodeParameter('categoryCode', i) as string;

			responseData = await tinkApiRequest.call(
				this,
				'PATCH',
				TINK_ENDPOINTS.TRANSACTIONS.GET.replace('{transactionId}', transactionId),
				{
					categories: {
						pfm: {
							id: categoryCode,
						},
					},
				},
				{},
				userToken,
			);
			break;
		}

		case 'getSimilarTransactions': {
			const transactionId = this.getNodeParameter('transactionId', i) as string;
			const options = this.getNodeParameter('options', i, {}) as IDataObject;

			// Get the reference transaction
			const refTransaction = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.TRANSACTIONS.GET.replace('{transactionId}', transactionId),
				{},
				{},
				userToken,
			);

			// Get transactions from the same account with similar description/merchant
			const queryParams: IDataObject = {
				accountIdIn: [(refTransaction as IDataObject).accountId],
				pageSize: options.pageSize || 50,
			};

			const allTransactions = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.TRANSACTIONS.LIST,
				{},
				queryParams,
				userToken,
			);

			const refDesc = ((refTransaction as IDataObject).descriptions as IDataObject)?.display as string || '';
			const transactions = ((allTransactions as IDataObject).transactions as IDataObject[] || [])
				.filter((tx: IDataObject) => {
					const desc = (tx.descriptions as IDataObject)?.display as string || '';
					// Simple similarity check - same merchant or similar description
					return tx.id !== transactionId && (
						desc.toLowerCase().includes(refDesc.toLowerCase().substring(0, 10)) ||
						(tx.merchantInformation as IDataObject)?.merchantName === (refTransaction as IDataObject).merchantInformation?.merchantName
					);
				});

			responseData = { 
				referenceTransaction: refTransaction,
				similarTransactions: transactions,
				count: transactions.length,
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
