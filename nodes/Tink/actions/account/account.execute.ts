/**
 * Account Resource Execute
 * 
 * Implementation of account operations for Tink API.
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { tinkApiRequest, getUserAccessToken } from '../../transport/tinkClient';
import { TINK_ENDPOINTS } from '../../constants/endpoints';

/**
 * Execute account operations
 */
export async function executeAccountOperations(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	const userId = this.getNodeParameter('userId', i) as string;
	const credentials = await this.getCredentials('tinkApi');
	
	// Get user access token for account operations
	const userToken = await getUserAccessToken.call(this, credentials, userId);
	
	let responseData: IDataObject | IDataObject[] = {};

	switch (operation) {
		case 'getAccounts': {
			const options = this.getNodeParameter('options', i, {}) as IDataObject;
			const queryParams: IDataObject = {};
			
			if (options.pageSize) {
				queryParams.pageSize = options.pageSize;
			}
			if (options.pageToken) {
				queryParams.pageToken = options.pageToken;
			}

			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.ACCOUNTS.LIST,
				{},
				queryParams,
				userToken,
			);

			// If includeBalances is true, fetch balances for each account
			if (options.includeBalances && Array.isArray((responseData as IDataObject).accounts)) {
				const accounts = (responseData as IDataObject).accounts as IDataObject[];
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
						account.balances = balanceData;
					} catch {
						account.balances = null;
					}
				}
			}
			break;
		}

		case 'getAccount': {
			const accountId = this.getNodeParameter('accountId', i) as string;
			
			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.ACCOUNTS.GET.replace('{accountId}', accountId),
				{},
				{},
				userToken,
			);
			break;
		}

		case 'getAccountBalances': {
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

		case 'getAccountsByType': {
			const accountType = this.getNodeParameter('accountType', i) as string;
			const options = this.getNodeParameter('options', i, {}) as IDataObject;
			
			// First get all accounts
			const allAccounts = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.ACCOUNTS.LIST,
				{},
				{},
				userToken,
			);

			// Filter by type
			const accounts = ((allAccounts as IDataObject).accounts as IDataObject[] || [])
				.filter((account: IDataObject) => account.type === accountType);

			// If includeBalances, fetch balances
			if (options.includeBalances) {
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
						account.balances = balanceData;
					} catch {
						account.balances = null;
					}
				}
			}

			responseData = { accounts, type: accountType, count: accounts.length };
			break;
		}

		case 'getCheckingAccounts': {
			const options = this.getNodeParameter('options', i, {}) as IDataObject;
			
			const allAccounts = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.ACCOUNTS.LIST,
				{},
				{},
				userToken,
			);

			const accounts = ((allAccounts as IDataObject).accounts as IDataObject[] || [])
				.filter((account: IDataObject) => account.type === 'CHECKING');

			if (options.includeBalances) {
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
						account.balances = balanceData;
					} catch {
						account.balances = null;
					}
				}
			}

			responseData = { accounts, type: 'CHECKING', count: accounts.length };
			break;
		}

		case 'getSavingsAccounts': {
			const options = this.getNodeParameter('options', i, {}) as IDataObject;
			
			const allAccounts = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.ACCOUNTS.LIST,
				{},
				{},
				userToken,
			);

			const accounts = ((allAccounts as IDataObject).accounts as IDataObject[] || [])
				.filter((account: IDataObject) => account.type === 'SAVINGS');

			if (options.includeBalances) {
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
						account.balances = balanceData;
					} catch {
						account.balances = null;
					}
				}
			}

			responseData = { accounts, type: 'SAVINGS', count: accounts.length };
			break;
		}

		case 'getCreditCards': {
			const options = this.getNodeParameter('options', i, {}) as IDataObject;
			
			const allAccounts = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.ACCOUNTS.LIST,
				{},
				{},
				userToken,
			);

			const accounts = ((allAccounts as IDataObject).accounts as IDataObject[] || [])
				.filter((account: IDataObject) => account.type === 'CREDIT_CARD');

			if (options.includeBalances) {
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
						account.balances = balanceData;
					} catch {
						account.balances = null;
					}
				}
			}

			responseData = { accounts, type: 'CREDIT_CARD', count: accounts.length };
			break;
		}

		case 'getInvestmentAccounts': {
			const options = this.getNodeParameter('options', i, {}) as IDataObject;
			
			const allAccounts = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.ACCOUNTS.LIST,
				{},
				{},
				userToken,
			);

			const accounts = ((allAccounts as IDataObject).accounts as IDataObject[] || [])
				.filter((account: IDataObject) => account.type === 'INVESTMENT');

			if (options.includeBalances) {
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
						account.balances = balanceData;
					} catch {
						account.balances = null;
					}
				}
			}

			responseData = { accounts, type: 'INVESTMENT', count: accounts.length };
			break;
		}

		case 'getLoanAccounts': {
			const options = this.getNodeParameter('options', i, {}) as IDataObject;
			
			const allAccounts = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.ACCOUNTS.LIST,
				{},
				{},
				userToken,
			);

			const accounts = ((allAccounts as IDataObject).accounts as IDataObject[] || [])
				.filter((account: IDataObject) => 
					account.type === 'LOAN' || account.type === 'MORTGAGE'
				);

			if (options.includeBalances) {
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
						account.balances = balanceData;
					} catch {
						account.balances = null;
					}
				}
			}

			responseData = { accounts, type: 'LOAN', count: accounts.length };
			break;
		}
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: i } },
	);

	return executionData;
}
