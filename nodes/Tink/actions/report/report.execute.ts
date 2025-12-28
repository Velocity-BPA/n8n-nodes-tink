/**
 * Report Operations Execute
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { tinkApiRequest } from '../../transport/tinkClient';
import { TINK_ENDPOINTS } from '../../constants/endpoints';

export async function executeReportOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[] = {};

	if (operation === 'create') {
		const userId = this.getNodeParameter('userId', i) as string;
		const reportType = this.getNodeParameter('reportType', i) as string;
		const reportOptions = this.getNodeParameter('reportOptions', i, {}) as IDataObject;

		const body: IDataObject = {
			type: reportType,
		};

		if (reportOptions.accountIds) {
			body.accountIds = (reportOptions.accountIds as string).split(',').map(id => id.trim());
		}
		if (reportOptions.startDate) {
			body.startDate = new Date(reportOptions.startDate as string).toISOString().split('T')[0];
		}
		if (reportOptions.endDate) {
			body.endDate = new Date(reportOptions.endDate as string).toISOString().split('T')[0];
		}
		if (reportOptions.format) {
			body.format = reportOptions.format;
		}
		if (reportOptions.locale) {
			body.locale = reportOptions.locale;
		}
		if (reportOptions.includeRawData !== undefined) {
			body.includeRawData = reportOptions.includeRawData;
		}

		responseData = await tinkApiRequest.call(
			this,
			'POST',
			TINK_ENDPOINTS.REPORTS.BASE,
			body,
			{},
			{ userId },
		);
	}

	if (operation === 'get') {
		const reportId = this.getNodeParameter('reportId', i) as string;

		responseData = await tinkApiRequest.call(
			this,
			'GET',
			TINK_ENDPOINTS.REPORTS.BY_ID(reportId),
		);
	}

	if (operation === 'getData') {
		const reportId = this.getNodeParameter('reportId', i) as string;

		responseData = await tinkApiRequest.call(
			this,
			'GET',
			TINK_ENDPOINTS.REPORTS.DATA(reportId),
		);
	}

	if (operation === 'getAccountVerification') {
		const userId = this.getNodeParameter('userId', i) as string;
		const verificationOptions = this.getNodeParameter('verificationOptions', i, {}) as IDataObject;

		const body: IDataObject = {
			type: 'ACCOUNT_VERIFICATION',
		};

		if (verificationOptions.accountId) {
			body.accountId = verificationOptions.accountId;
		}
		if (verificationOptions.includeDetails !== undefined) {
			body.includeDetails = verificationOptions.includeDetails;
		}
		if (verificationOptions.refreshData !== undefined) {
			body.refreshData = verificationOptions.refreshData;
		}

		responseData = await tinkApiRequest.call(
			this,
			'POST',
			TINK_ENDPOINTS.REPORTS.ACCOUNT_VERIFICATION,
			body,
			{},
			{ userId },
		);
	}

	if (operation === 'getIncomeVerification') {
		const userId = this.getNodeParameter('userId', i) as string;
		const verificationOptions = this.getNodeParameter('verificationOptions', i, {}) as IDataObject;

		const body: IDataObject = {
			type: 'INCOME_VERIFICATION',
		};

		if (verificationOptions.accountId) {
			body.accountId = verificationOptions.accountId;
		}
		if (verificationOptions.includeDetails !== undefined) {
			body.includeDetails = verificationOptions.includeDetails;
		}
		if (verificationOptions.refreshData !== undefined) {
			body.refreshData = verificationOptions.refreshData;
		}

		responseData = await tinkApiRequest.call(
			this,
			'POST',
			TINK_ENDPOINTS.REPORTS.INCOME_VERIFICATION,
			body,
			{},
			{ userId },
		);
	}

	if (operation === 'getRisk') {
		const userId = this.getNodeParameter('userId', i) as string;
		const riskOptions = this.getNodeParameter('riskOptions', i, {}) as IDataObject;

		const body: IDataObject = {
			type: 'RISK_ASSESSMENT',
		};

		if (riskOptions.riskTypes && (riskOptions.riskTypes as string[]).length > 0) {
			body.riskTypes = riskOptions.riskTypes;
		}
		if (riskOptions.monthsToAnalyze) {
			body.monthsToAnalyze = riskOptions.monthsToAnalyze;
		}

		responseData = await tinkApiRequest.call(
			this,
			'POST',
			TINK_ENDPOINTS.REPORTS.RISK,
			body,
			{},
			{ userId },
		);
	}

	if (operation === 'getAffordability') {
		const userId = this.getNodeParameter('userId', i) as string;
		const affordabilityOptions = this.getNodeParameter('affordabilityOptions', i, {}) as IDataObject;

		const body: IDataObject = {
			type: 'AFFORDABILITY',
		};

		if (affordabilityOptions.loanAmount) {
			body.loanAmount = affordabilityOptions.loanAmount;
		}
		if (affordabilityOptions.loanTermMonths) {
			body.loanTermMonths = affordabilityOptions.loanTermMonths;
		}
		if (affordabilityOptions.includeRecommendations !== undefined) {
			body.includeRecommendations = affordabilityOptions.includeRecommendations;
		}

		responseData = await tinkApiRequest.call(
			this,
			'POST',
			TINK_ENDPOINTS.REPORTS.AFFORDABILITY,
			body,
			{},
			{ userId },
		);
	}

	if (operation === 'getTransaction') {
		const userId = this.getNodeParameter('userId', i) as string;
		const transactionOptions = this.getNodeParameter('transactionOptions', i, {}) as IDataObject;

		const body: IDataObject = {
			type: 'TRANSACTION',
		};

		if (transactionOptions.accountIds) {
			body.accountIds = (transactionOptions.accountIds as string).split(',').map(id => id.trim());
		}
		if (transactionOptions.startDate) {
			body.startDate = new Date(transactionOptions.startDate as string).toISOString().split('T')[0];
		}
		if (transactionOptions.endDate) {
			body.endDate = new Date(transactionOptions.endDate as string).toISOString().split('T')[0];
		}
		if (transactionOptions.includeCategories !== undefined) {
			body.includeCategories = transactionOptions.includeCategories;
		}

		responseData = await tinkApiRequest.call(
			this,
			'POST',
			TINK_ENDPOINTS.REPORTS.TRANSACTION,
			body,
			{},
			{ userId },
		);
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: i } },
	);

	return executionData;
}
