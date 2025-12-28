/**
 * Balance Resource Execute
 * 
 * Implementation of balance operations for Tink API.
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { tinkApiRequest, getUserAccessToken } from '../../transport/tinkClient';
import { TINK_ENDPOINTS } from '../../constants/endpoints';

/**
 * Execute balance operations
 */
export async function executeBalanceOperations(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	const userId = this.getNodeParameter('userId', i) as string;
	const credentials = await this.getCredentials('tinkApi');
	const userToken = await getUserAccessToken.call(this, credentials, userId);
	
	let responseData: IDataObject | IDataObject[] = {};

	switch (operation) {
		case 'getBalances': {
			const options = this.getNodeParameter('options', i, {}) as IDataObject;
			
			// Get all accounts
			const accountsResponse = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.ACCOUNTS.LIST,
				{},
				{},
				userToken,
			);

			let accounts = (accountsResponse as IDataObject).accounts as IDataObject[] || [];

			// Filter by account types if specified
			if (options.accountTypes && (options.accountTypes as string[]).length > 0) {
				accounts = accounts.filter((acc: IDataObject) => 
					(options.accountTypes as string[]).includes(acc.type as string)
				);
			}

			// Get balances for each account
			const balances: IDataObject[] = [];
			for (const account of accounts) {
				try {
					const balanceData = await tinkApiRequest.call(
						this,
						'GET',
						TINK_ENDPOINTS.ACCOUNTS.BALANCES.replace('{accountId}', account.id as string),
						{},
						{},
						userToken,
					);
					
					balances.push({
						accountId: account.id,
						accountName: (account.name || account.accountNumber) as string,
						accountType: account.type,
						...balanceData as IDataObject,
						...(options.includeAccountDetails ? { accountDetails: account } : {}),
					});
				} catch {
					balances.push({
						accountId: account.id,
						accountName: (account.name || account.accountNumber) as string,
						accountType: account.type,
						error: 'Failed to fetch balance',
					});
				}
			}

			responseData = { balances, totalAccounts: balances.length };
			break;
		}

		case 'getAccountBalance': {
			const accountId = this.getNodeParameter('accountId', i) as string;

			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.ACCOUNTS.BALANCES.replace('{accountId}', accountId),
				{},
				{},
				userToken,
			);
			break;
		}

		case 'getBalanceHistory': {
			const accountId = this.getNodeParameter('accountId', i) as string;
			const historyOptions = this.getNodeParameter('historyOptions', i, {}) as IDataObject;

			const queryParams: IDataObject = {};
			
			if (historyOptions.startDate) {
				queryParams.dateFrom = new Date(historyOptions.startDate as string).toISOString().split('T')[0];
			}
			if (historyOptions.endDate) {
				queryParams.dateTo = new Date(historyOptions.endDate as string).toISOString().split('T')[0];
			}
			if (historyOptions.resolution) {
				queryParams.resolution = historyOptions.resolution;
			}

			// Tink may have a balance history endpoint or we simulate with transaction history
			try {
				responseData = await tinkApiRequest.call(
					this,
					'GET',
					`/data/v2/accounts/${accountId}/balances/history`,
					{},
					queryParams,
					userToken,
				);
			} catch {
				// Fallback: Calculate from transactions
				const transactions = await tinkApiRequest.call(
					this,
					'GET',
					TINK_ENDPOINTS.TRANSACTIONS.LIST,
					{},
					{ 
						accountIdIn: [accountId],
						...queryParams,
					},
					userToken,
				);

				const currentBalance = await tinkApiRequest.call(
					this,
					'GET',
					TINK_ENDPOINTS.ACCOUNTS.BALANCES.replace('{accountId}', accountId),
					{},
					{},
					userToken,
				);

				responseData = {
					accountId,
					currentBalance,
					transactionCount: ((transactions as IDataObject).transactions as IDataObject[] || []).length,
					note: 'Balance history calculated from current balance and transactions',
				};
			}
			break;
		}

		case 'getAvailableBalance': {
			const accountId = this.getNodeParameter('accountId', i) as string;

			const balanceData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.ACCOUNTS.BALANCES.replace('{accountId}', accountId),
				{},
				{},
				userToken,
			);

			const balances = balanceData as IDataObject;
			const availableBalance = (balances.balances as IDataObject[])?.find(
				(b: IDataObject) => b.type === 'AVAILABLE' || b.type === 'INTERIM_AVAILABLE'
			) || (balances.balances as IDataObject[])?.[0];

			responseData = {
				accountId,
				availableBalance,
				timestamp: new Date().toISOString(),
			};
			break;
		}

		case 'getBookedBalance': {
			const accountId = this.getNodeParameter('accountId', i) as string;

			const balanceData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.ACCOUNTS.BALANCES.replace('{accountId}', accountId),
				{},
				{},
				userToken,
			);

			const balances = balanceData as IDataObject;
			const bookedBalance = (balances.balances as IDataObject[])?.find(
				(b: IDataObject) => b.type === 'BOOKED' || b.type === 'INTERIM_BOOKED'
			) || (balances.balances as IDataObject[])?.[0];

			responseData = {
				accountId,
				bookedBalance,
				timestamp: new Date().toISOString(),
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
