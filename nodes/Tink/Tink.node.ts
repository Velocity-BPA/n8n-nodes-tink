/**
 * Tink Node - Main Action Node
 * Comprehensive n8n community node for Tink Open Banking Platform
 *
 * @license BSL-1.1
 * @copyright Velocity BPA
 *
 * [Velocity BPA Licensing Notice]
 *
 * This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
 *
 * Use of this node by for-profit organizations in production environments
 * requires a commercial license from Velocity BPA.
 *
 * For licensing information, visit https://velobpa.com/licensing
 * or contact licensing@velobpa.com.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

// Resource definitions (operations and fields)
import * as user from './actions/user';
import * as account from './actions/account';
import * as transaction from './actions/transaction';
import * as balance from './actions/balance';
import * as credentials from './actions/credentials';
import * as provider from './actions/provider';
import * as identity from './actions/identity';
import * as payment from './actions/payment';
import * as transfer from './actions/transfer';
import * as beneficiary from './actions/beneficiary';
import * as consent from './actions/consent';
import * as insights from './actions/insights';
import * as enrichment from './actions/enrichment';
import * as connect from './actions/connect';
import * as report from './actions/report';
import * as webhook from './actions/webhook';
import * as accessToken from './actions/accessToken';
import * as market from './actions/market';
import * as category from './actions/category';
import * as statistics from './actions/statistics';
import * as utility from './actions/utility';

// Execute functions
import * as userExecute from './actions/user/user.execute';
import * as accountExecute from './actions/account/account.execute';
import * as transactionExecute from './actions/transaction/transaction.execute';
import * as balanceExecute from './actions/balance/balance.execute';
import * as credentialsExecute from './actions/credentials/credentials.execute';
import * as providerExecute from './actions/provider/provider.execute';
import * as identityExecute from './actions/identity/identity.execute';
import * as paymentExecute from './actions/payment/payment.execute';
import * as transferExecute from './actions/transfer/transfer.execute';
import * as beneficiaryExecute from './actions/beneficiary/beneficiary.execute';
import * as consentExecute from './actions/consent/consent.execute';
import * as insightsExecute from './actions/insights/insights.execute';
import * as enrichmentExecute from './actions/enrichment/enrichment.execute';
import * as connectExecute from './actions/connect/connect.execute';
import * as reportExecute from './actions/report/report.execute';
import * as webhookExecute from './actions/webhook/webhook.execute';
import * as accessTokenExecute from './actions/accessToken/accessToken.execute';
import * as marketExecute from './actions/market/market.execute';
import * as categoryExecute from './actions/category/category.execute';
import * as statisticsExecute from './actions/statistics/statistics.execute';
import * as utilityExecute from './actions/utility/utility.execute';

// Log licensing notice once on module load
const LICENSING_LOGGED = Symbol.for('n8n-nodes-tink.licensing.logged');
if (!(globalThis as Record<symbol, boolean>)[LICENSING_LOGGED]) {
	console.warn(`
[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments
requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing
or contact licensing@velobpa.com.
`);
	(globalThis as Record<symbol, boolean>)[LICENSING_LOGGED] = true;
}

export class Tink implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Tink',
		name: 'tink',
		icon: 'file:tink.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Tink Open Banking API',
		defaults: {
			name: 'Tink',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'tinkApi',
				required: true,
				displayOptions: {
					show: {
						authentication: ['apiKey'],
					},
				},
			},
			{
				name: 'tinkOAuth',
				required: true,
				displayOptions: {
					show: {
						authentication: ['oauth'],
					},
				},
			},
		],
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{
						name: 'API Key',
						value: 'apiKey',
					},
					{
						name: 'OAuth2',
						value: 'oauth',
					},
				],
				default: 'apiKey',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Access Token',
						value: 'accessToken',
						description: 'Manage OAuth access tokens',
					},
					{
						name: 'Account',
						value: 'account',
						description: 'Manage bank accounts',
					},
					{
						name: 'Balance',
						value: 'balance',
						description: 'Get account balances',
					},
					{
						name: 'Beneficiary',
						value: 'beneficiary',
						description: 'Manage payment beneficiaries',
					},
					{
						name: 'Category',
						value: 'category',
						description: 'Transaction categories',
					},
					{
						name: 'Connect',
						value: 'connect',
						description: 'Tink Link integration',
					},
					{
						name: 'Consent',
						value: 'consent',
						description: 'Manage PSD2 consents',
					},
					{
						name: 'Credentials',
						value: 'credentials',
						description: 'Manage bank credentials',
					},
					{
						name: 'Enrichment',
						value: 'enrichment',
						description: 'Transaction enrichment',
					},
					{
						name: 'Identity',
						value: 'identity',
						description: 'Identity verification',
					},
					{
						name: 'Insights',
						value: 'insights',
						description: 'Financial insights',
					},
					{
						name: 'Market',
						value: 'market',
						description: 'Market information',
					},
					{
						name: 'Payment',
						value: 'payment',
						description: 'Payment initiation',
					},
					{
						name: 'Provider',
						value: 'provider',
						description: 'Bank providers',
					},
					{
						name: 'Report',
						value: 'report',
						description: 'Financial reports',
					},
					{
						name: 'Statistics',
						value: 'statistics',
						description: 'Financial statistics',
					},
					{
						name: 'Transaction',
						value: 'transaction',
						description: 'Bank transactions',
					},
					{
						name: 'Transfer',
						value: 'transfer',
						description: 'Bank transfers',
					},
					{
						name: 'User',
						value: 'user',
						description: 'Manage Tink users',
					},
					{
						name: 'Utility',
						value: 'utility',
						description: 'Utility functions',
					},
					{
						name: 'Webhook',
						value: 'webhook',
						description: 'Webhook subscriptions',
					},
				],
				default: 'account',
			},
			// User operations and fields
			...user.operations,
			...user.fields,
			// Account operations and fields
			...account.operations,
			...account.fields,
			// Transaction operations and fields
			...transaction.operations,
			...transaction.fields,
			// Balance operations and fields
			...balance.operations,
			...balance.fields,
			// Credentials operations and fields
			...credentials.operations,
			...credentials.fields,
			// Provider operations and fields
			...provider.operations,
			...provider.fields,
			// Identity operations and fields
			...identity.operations,
			...identity.fields,
			// Payment operations and fields
			...payment.operations,
			...payment.fields,
			// Transfer operations and fields
			...transfer.operations,
			...transfer.fields,
			// Beneficiary operations and fields
			...beneficiary.operations,
			...beneficiary.fields,
			// Consent operations and fields
			...consent.operations,
			...consent.fields,
			// Insights operations and fields
			...insights.operations,
			...insights.fields,
			// Enrichment operations and fields
			...enrichment.operations,
			...enrichment.fields,
			// Connect operations and fields
			...connect.operations,
			...connect.fields,
			// Report operations and fields
			...report.operations,
			...report.fields,
			// Webhook operations and fields
			...webhook.operations,
			...webhook.fields,
			// Access Token operations and fields
			...accessToken.operations,
			...accessToken.fields,
			// Market operations and fields
			...market.operations,
			...market.fields,
			// Category operations and fields
			...category.operations,
			...category.fields,
			// Statistics operations and fields
			...statistics.operations,
			...statistics.fields,
			// Utility operations and fields
			...utility.operations,
			...utility.fields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[];

				switch (resource) {
					case 'user':
						responseData = await executeUserOperation.call(this, operation, i);
						break;
					case 'account':
						responseData = await executeAccountOperation.call(this, operation, i);
						break;
					case 'transaction':
						responseData = await executeTransactionOperation.call(this, operation, i);
						break;
					case 'balance':
						responseData = await executeBalanceOperation.call(this, operation, i);
						break;
					case 'credentials':
						responseData = await executeCredentialsOperation.call(this, operation, i);
						break;
					case 'provider':
						responseData = await executeProviderOperation.call(this, operation, i);
						break;
					case 'identity':
						responseData = await executeIdentityOperation.call(this, operation, i);
						break;
					case 'payment':
						responseData = await executePaymentOperation.call(this, operation, i);
						break;
					case 'transfer':
						responseData = await executeTransferOperation.call(this, operation, i);
						break;
					case 'beneficiary':
						responseData = await executeBeneficiaryOperation.call(this, operation, i);
						break;
					case 'consent':
						responseData = await executeConsentOperation.call(this, operation, i);
						break;
					case 'insights':
						responseData = await executeInsightsOperation.call(this, operation, i);
						break;
					case 'enrichment':
						responseData = await executeEnrichmentOperation.call(this, operation, i);
						break;
					case 'connect':
						responseData = await executeConnectOperation.call(this, operation, i);
						break;
					case 'report':
						responseData = await executeReportOperation.call(this, operation, i);
						break;
					case 'webhook':
						responseData = await executeWebhookOperation.call(this, operation, i);
						break;
					case 'accessToken':
						responseData = await executeAccessTokenOperation.call(this, operation, i);
						break;
					case 'market':
						responseData = await executeMarketOperation.call(this, operation, i);
						break;
					case 'category':
						responseData = await executeCategoryOperation.call(this, operation, i);
						break;
					case 'statistics':
						responseData = await executeStatisticsOperation.call(this, operation, i);
						break;
					case 'utility':
						responseData = await executeUtilityOperation.call(this, operation, i);
						break;
					default:
						throw new NodeOperationError(
							this.getNode(),
							`Unknown resource: ${resource}`,
							{ itemIndex: i }
						);
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } }
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

// Operation execution functions
async function executeUserOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject> {
	switch (operation) {
		case 'create':
			return userExecute.createUser.call(this, index);
		case 'get':
			return userExecute.getUser.call(this, index);
		case 'delete':
			return userExecute.deleteUser.call(this, index);
		case 'list':
			return userExecute.listUsers.call(this, index);
		case 'authorize':
			return userExecute.authorizeUser.call(this, index);
		case 'getProfile':
			return userExecute.getUserProfile.call(this, index);
		case 'updateProfile':
			return userExecute.updateUserProfile.call(this, index);
		case 'getAuthorizationCode':
			return userExecute.getAuthorizationCode.call(this, index);
		default:
			throw new Error(`Unknown user operation: ${operation}`);
	}
}

async function executeAccountOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject> {
	switch (operation) {
		case 'list':
			return accountExecute.listAccounts.call(this, index);
		case 'get':
			return accountExecute.getAccount.call(this, index);
		case 'getBalances':
			return accountExecute.getAccountBalances.call(this, index);
		case 'getByType':
			return accountExecute.getAccountsByType.call(this, index);
		case 'getChecking':
			return accountExecute.getCheckingAccounts.call(this, index);
		case 'getSavings':
			return accountExecute.getSavingsAccounts.call(this, index);
		case 'getCreditCards':
			return accountExecute.getCreditCards.call(this, index);
		case 'getInvestment':
			return accountExecute.getInvestmentAccounts.call(this, index);
		case 'getLoans':
			return accountExecute.getLoanAccounts.call(this, index);
		default:
			throw new Error(`Unknown account operation: ${operation}`);
	}
}

async function executeTransactionOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject> {
	switch (operation) {
		case 'list':
			return transactionExecute.listTransactions.call(this, index);
		case 'get':
			return transactionExecute.getTransaction.call(this, index);
		case 'search':
			return transactionExecute.searchTransactions.call(this, index);
		case 'getByAccount':
			return transactionExecute.getTransactionsByAccount.call(this, index);
		case 'getByDate':
			return transactionExecute.getTransactionsByDate.call(this, index);
		case 'getPending':
			return transactionExecute.getPendingTransactions.call(this, index);
		case 'getCategories':
			return transactionExecute.getTransactionCategories.call(this, index);
		case 'categorize':
			return transactionExecute.categorizeTransaction.call(this, index);
		case 'getSimilar':
			return transactionExecute.getSimilarTransactions.call(this, index);
		default:
			throw new Error(`Unknown transaction operation: ${operation}`);
	}
}

async function executeBalanceOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject> {
	switch (operation) {
		case 'list':
			return balanceExecute.listBalances.call(this, index);
		case 'get':
			return balanceExecute.getAccountBalance.call(this, index);
		case 'getHistory':
			return balanceExecute.getBalanceHistory.call(this, index);
		case 'getAvailable':
			return balanceExecute.getAvailableBalance.call(this, index);
		case 'getBooked':
			return balanceExecute.getBookedBalance.call(this, index);
		default:
			throw new Error(`Unknown balance operation: ${operation}`);
	}
}

async function executeCredentialsOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject> {
	switch (operation) {
		case 'create':
			return credentialsExecute.createCredentials.call(this, index);
		case 'get':
			return credentialsExecute.getCredentials.call(this, index);
		case 'update':
			return credentialsExecute.updateCredentials.call(this, index);
		case 'delete':
			return credentialsExecute.deleteCredentials.call(this, index);
		case 'list':
			return credentialsExecute.listCredentials.call(this, index);
		case 'refresh':
			return credentialsExecute.refreshCredentials.call(this, index);
		case 'getByProvider':
			return credentialsExecute.getCredentialsByProvider.call(this, index);
		case 'authenticate':
			return credentialsExecute.authenticateCredentials.call(this, index);
		case 'getThirdPartyCallback':
			return credentialsExecute.getThirdPartyCallback.call(this, index);
		case 'supplementalInfo':
			return credentialsExecute.supplementalInfo.call(this, index);
		default:
			throw new Error(`Unknown credentials operation: ${operation}`);
	}
}

async function executeProviderOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject> {
	switch (operation) {
		case 'list':
			return providerExecute.listProviders.call(this, index);
		case 'get':
			return providerExecute.getProvider.call(this, index);
		case 'getByMarket':
			return providerExecute.getProvidersByMarket.call(this, index);
		case 'getCapabilities':
			return providerExecute.getProviderCapabilities.call(this, index);
		case 'search':
			return providerExecute.searchProviders.call(this, index);
		case 'getFinancialInstitutions':
			return providerExecute.getFinancialInstitutions.call(this, index);
		case 'getFields':
			return providerExecute.getProviderFields.call(this, index);
		default:
			throw new Error(`Unknown provider operation: ${operation}`);
	}
}

async function executeIdentityOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject> {
	switch (operation) {
		case 'getData':
			return identityExecute.getIdentityData.call(this, index);
		case 'verify':
			return identityExecute.verifyIdentity.call(this, index);
		case 'getVerification':
			return identityExecute.getIdentityVerification.call(this, index);
		case 'getPersonalInfo':
			return identityExecute.getPersonalInfo.call(this, index);
		case 'getName':
			return identityExecute.getName.call(this, index);
		case 'getDateOfBirth':
			return identityExecute.getDateOfBirth.call(this, index);
		case 'getAddress':
			return identityExecute.getAddress.call(this, index);
		case 'getNationalId':
			return identityExecute.getNationalId.call(this, index);
		default:
			throw new Error(`Unknown identity operation: ${operation}`);
	}
}

async function executePaymentOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject> {
	switch (operation) {
		case 'create':
			return paymentExecute.createPayment.call(this, index);
		case 'get':
			return paymentExecute.getPayment.call(this, index);
		case 'getStatus':
			return paymentExecute.getPaymentStatus.call(this, index);
		case 'list':
			return paymentExecute.listPayments.call(this, index);
		case 'cancel':
			return paymentExecute.cancelPayment.call(this, index);
		case 'sign':
			return paymentExecute.signPayment.call(this, index);
		case 'getSignedStatus':
			return paymentExecute.getSignedPaymentStatus.call(this, index);
		default:
			throw new Error(`Unknown payment operation: ${operation}`);
	}
}

async function executeTransferOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject> {
	switch (operation) {
		case 'create':
			return transferExecute.createTransfer.call(this, index);
		case 'get':
			return transferExecute.getTransfer.call(this, index);
		case 'list':
			return transferExecute.listTransfers.call(this, index);
		case 'getStatus':
			return transferExecute.getTransferStatus.call(this, index);
		case 'getAccounts':
			return transferExecute.getTransferAccounts.call(this, index);
		case 'initiate':
			return transferExecute.initiateTransfer.call(this, index);
		case 'sign':
			return transferExecute.signTransfer.call(this, index);
		default:
			throw new Error(`Unknown transfer operation: ${operation}`);
	}
}

async function executeBeneficiaryOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject> {
	switch (operation) {
		case 'create':
			return beneficiaryExecute.createBeneficiary.call(this, index);
		case 'get':
			return beneficiaryExecute.getBeneficiary.call(this, index);
		case 'update':
			return beneficiaryExecute.updateBeneficiary.call(this, index);
		case 'delete':
			return beneficiaryExecute.deleteBeneficiary.call(this, index);
		case 'list':
			return beneficiaryExecute.listBeneficiaries.call(this, index);
		case 'getAccounts':
			return beneficiaryExecute.getBeneficiaryAccounts.call(this, index);
		default:
			throw new Error(`Unknown beneficiary operation: ${operation}`);
	}
}

async function executeConsentOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject> {
	switch (operation) {
		case 'list':
			return consentExecute.listConsents.call(this, index);
		case 'get':
			return consentExecute.getConsent.call(this, index);
		case 'getStatus':
			return consentExecute.getConsentStatus.call(this, index);
		case 'revoke':
			return consentExecute.revokeConsent.call(this, index);
		case 'extend':
			return consentExecute.extendConsent.call(this, index);
		case 'getSessions':
			return consentExecute.getConsentSessions.call(this, index);
		default:
			throw new Error(`Unknown consent operation: ${operation}`);
	}
}

async function executeInsightsOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject> {
	switch (operation) {
		case 'getSpendingInsights':
			return insightsExecute.getSpendingInsights.call(this, index);
		case 'getIncomeInsights':
			return insightsExecute.getIncomeInsights.call(this, index);
		case 'getCashFlow':
			return insightsExecute.getCashFlow.call(this, index);
		case 'getBudgetAnalysis':
			return insightsExecute.getBudgetAnalysis.call(this, index);
		case 'getSavingPotential':
			return insightsExecute.getSavingPotential.call(this, index);
		case 'getRiskAssessment':
			return insightsExecute.getRiskAssessment.call(this, index);
		case 'getAccountInsights':
			return insightsExecute.getAccountInsights.call(this, index);
		default:
			throw new Error(`Unknown insights operation: ${operation}`);
	}
}

async function executeEnrichmentOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject> {
	switch (operation) {
		case 'enrichTransactions':
			return enrichmentExecute.enrichTransactions.call(this, index);
		case 'getEnrichment':
			return enrichmentExecute.getEnrichment.call(this, index);
		case 'getMerchantInfo':
			return enrichmentExecute.getMerchantInfo.call(this, index);
		case 'getCategorySuggestions':
			return enrichmentExecute.getCategorySuggestions.call(this, index);
		case 'getEnrichedTransactions':
			return enrichmentExecute.getEnrichedTransactions.call(this, index);
		default:
			throw new Error(`Unknown enrichment operation: ${operation}`);
	}
}

async function executeConnectOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject> {
	switch (operation) {
		case 'createSession':
			return connectExecute.createSession.call(this, index);
		case 'getConnectUrl':
			return connectExecute.getConnectUrl.call(this, index);
		case 'getSessionStatus':
			return connectExecute.getSessionStatus.call(this, index);
		case 'getAuthorizationGrant':
			return connectExecute.getAuthorizationGrant.call(this, index);
		case 'exchangeGrant':
			return connectExecute.exchangeGrant.call(this, index);
		default:
			throw new Error(`Unknown connect operation: ${operation}`);
	}
}

async function executeReportOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject> {
	switch (operation) {
		case 'create':
			return reportExecute.createReport.call(this, index);
		case 'get':
			return reportExecute.getReport.call(this, index);
		case 'getData':
			return reportExecute.getReportData.call(this, index);
		case 'getAccountVerification':
			return reportExecute.getAccountVerificationReport.call(this, index);
		case 'getIncomeVerification':
			return reportExecute.getIncomeVerificationReport.call(this, index);
		case 'getRisk':
			return reportExecute.getRiskReport.call(this, index);
		case 'getAffordability':
			return reportExecute.getAffordabilityReport.call(this, index);
		case 'getTransaction':
			return reportExecute.getTransactionReport.call(this, index);
		default:
			throw new Error(`Unknown report operation: ${operation}`);
	}
}

async function executeWebhookOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject> {
	switch (operation) {
		case 'create':
			return webhookExecute.createWebhook.call(this, index);
		case 'get':
			return webhookExecute.getWebhook.call(this, index);
		case 'update':
			return webhookExecute.updateWebhook.call(this, index);
		case 'delete':
			return webhookExecute.deleteWebhook.call(this, index);
		case 'list':
			return webhookExecute.listWebhooks.call(this, index);
		case 'test':
			return webhookExecute.testWebhook.call(this, index);
		case 'getEvents':
			return webhookExecute.getWebhookEvents.call(this, index);
		default:
			throw new Error(`Unknown webhook operation: ${operation}`);
	}
}

async function executeAccessTokenOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject> {
	switch (operation) {
		case 'getAccessToken':
			return accessTokenExecute.getAccessToken.call(this, index);
		case 'getClientAccessToken':
			return accessTokenExecute.getClientAccessToken.call(this, index);
		case 'getUserAccessToken':
			return accessTokenExecute.getUserAccessToken.call(this, index);
		case 'refreshToken':
			return accessTokenExecute.refreshToken.call(this, index);
		case 'revokeToken':
			return accessTokenExecute.revokeToken.call(this, index);
		case 'getTokenInfo':
			return accessTokenExecute.getTokenInfo.call(this, index);
		default:
			throw new Error(`Unknown accessToken operation: ${operation}`);
	}
}

async function executeMarketOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject> {
	switch (operation) {
		case 'list':
			return marketExecute.listMarkets.call(this, index);
		case 'get':
			return marketExecute.getMarket.call(this, index);
		case 'getCurrencies':
			return marketExecute.getMarketCurrencies.call(this, index);
		case 'getProviders':
			return marketExecute.getMarketProviders.call(this, index);
		default:
			throw new Error(`Unknown market operation: ${operation}`);
	}
}

async function executeCategoryOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject> {
	switch (operation) {
		case 'list':
			return categoryExecute.listCategories.call(this, index);
		case 'getByCode':
			return categoryExecute.getCategoryByCode.call(this, index);
		case 'getPrimary':
			return categoryExecute.getPrimaryCategories.call(this, index);
		case 'getSecondary':
			return categoryExecute.getSecondaryCategories.call(this, index);
		case 'getTree':
			return categoryExecute.getCategoryTree.call(this, index);
		default:
			throw new Error(`Unknown category operation: ${operation}`);
	}
}

async function executeStatisticsOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject> {
	switch (operation) {
		case 'getStatistics':
			return statisticsExecute.getStatistics.call(this, index);
		case 'getAccountStatistics':
			return statisticsExecute.getAccountStatistics.call(this, index);
		case 'getTransactionStatistics':
			return statisticsExecute.getTransactionStatistics.call(this, index);
		case 'getMonthlyStatistics':
			return statisticsExecute.getMonthlyStatistics.call(this, index);
		case 'getCategoryStatistics':
			return statisticsExecute.getCategoryStatistics.call(this, index);
		default:
			throw new Error(`Unknown statistics operation: ${operation}`);
	}
}

async function executeUtilityOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject> {
	switch (operation) {
		case 'getApiStatus':
			return utilityExecute.getApiStatus.call(this, index);
		case 'validateIban':
			return utilityExecute.validateIbanNumber.call(this, index);
		case 'getSupportedMarkets':
			return utilityExecute.getSupportedMarkets.call(this, index);
		case 'getSupportedCurrencies':
			return utilityExecute.getSupportedCurrencies.call(this, index);
		case 'testConnection':
			return utilityExecute.testConnection.call(this, index);
		default:
			throw new Error(`Unknown utility operation: ${operation}`);
	}
}
