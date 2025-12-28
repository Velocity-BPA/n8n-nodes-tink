/**
 * Insights Operations Execute
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { tinkApiRequest } from '../../transport/tinkClient';
import { TINK_ENDPOINTS } from '../../constants/endpoints';

export async function executeInsightsOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[] = {};
	const userId = this.getNodeParameter('userId', i) as string;

	// Helper to build date range query params
	const buildDateRangeParams = (dateRange: IDataObject): IDataObject => {
		const params: IDataObject = {};
		if (dateRange.period && dateRange.period !== 'CUSTOM') {
			params.period = dateRange.period;
		} else {
			if (dateRange.startDate) {
				params.startDate = new Date(dateRange.startDate as string).toISOString().split('T')[0];
			}
			if (dateRange.endDate) {
				params.endDate = new Date(dateRange.endDate as string).toISOString().split('T')[0];
			}
		}
		return params;
	};

	if (operation === 'getSpendingInsights') {
		const dateRange = this.getNodeParameter('dateRange', i, {}) as IDataObject;
		const spendingOptions = this.getNodeParameter('spendingOptions', i, {}) as IDataObject;

		const qs: IDataObject = {
			...buildDateRangeParams(dateRange),
		};

		if (spendingOptions.groupBy) {
			qs.groupBy = spendingOptions.groupBy;
		}
		if (spendingOptions.categories && (spendingOptions.categories as string[]).length > 0) {
			qs.categories = (spendingOptions.categories as string[]).join(',');
		}
		if (spendingOptions.includeComparison !== undefined) {
			qs.includeComparison = spendingOptions.includeComparison;
		}

		responseData = await tinkApiRequest.call(
			this,
			'GET',
			TINK_ENDPOINTS.INSIGHTS.SPENDING,
			{},
			qs,
			{ userId },
		);
	}

	if (operation === 'getIncomeInsights') {
		const dateRange = this.getNodeParameter('dateRange', i, {}) as IDataObject;

		const qs: IDataObject = buildDateRangeParams(dateRange);

		responseData = await tinkApiRequest.call(
			this,
			'GET',
			TINK_ENDPOINTS.INSIGHTS.INCOME,
			{},
			qs,
			{ userId },
		);
	}

	if (operation === 'getCashFlow') {
		const dateRange = this.getNodeParameter('dateRange', i, {}) as IDataObject;
		const cashFlowOptions = this.getNodeParameter('cashFlowOptions', i, {}) as IDataObject;

		const qs: IDataObject = {
			...buildDateRangeParams(dateRange),
		};

		if (cashFlowOptions.granularity) {
			qs.granularity = cashFlowOptions.granularity;
		}
		if (cashFlowOptions.excludeTransfers !== undefined) {
			qs.excludeTransfers = cashFlowOptions.excludeTransfers;
		}
		if (cashFlowOptions.includeForecast !== undefined) {
			qs.includeForecast = cashFlowOptions.includeForecast;
		}

		responseData = await tinkApiRequest.call(
			this,
			'GET',
			TINK_ENDPOINTS.INSIGHTS.CASH_FLOW,
			{},
			qs,
			{ userId },
		);
	}

	if (operation === 'getBudgetAnalysis') {
		const dateRange = this.getNodeParameter('dateRange', i, {}) as IDataObject;

		const qs: IDataObject = buildDateRangeParams(dateRange);

		responseData = await tinkApiRequest.call(
			this,
			'GET',
			TINK_ENDPOINTS.INSIGHTS.BUDGET,
			{},
			qs,
			{ userId },
		);
	}

	if (operation === 'getSavingPotential') {
		responseData = await tinkApiRequest.call(
			this,
			'GET',
			TINK_ENDPOINTS.INSIGHTS.SAVING_POTENTIAL,
			{},
			{},
			{ userId },
		);
	}

	if (operation === 'getRiskAssessment') {
		const riskOptions = this.getNodeParameter('riskOptions', i, {}) as IDataObject;

		const qs: IDataObject = {};
		if (riskOptions.assessmentTypes && (riskOptions.assessmentTypes as string[]).length > 0) {
			qs.assessmentTypes = (riskOptions.assessmentTypes as string[]).join(',');
		}
		if (riskOptions.includeDetails !== undefined) {
			qs.includeDetails = riskOptions.includeDetails;
		}

		responseData = await tinkApiRequest.call(
			this,
			'GET',
			TINK_ENDPOINTS.INSIGHTS.RISK,
			{},
			qs,
			{ userId },
		);
	}

	if (operation === 'getAccountInsights') {
		const accountOptions = this.getNodeParameter('accountOptions', i, {}) as IDataObject;

		const qs: IDataObject = {};
		if (accountOptions.accountIds) {
			qs.accountIds = accountOptions.accountIds;
		}
		if (accountOptions.includeBalanceHistory !== undefined) {
			qs.includeBalanceHistory = accountOptions.includeBalanceHistory;
		}
		if (accountOptions.includePredictions !== undefined) {
			qs.includePredictions = accountOptions.includePredictions;
		}

		responseData = await tinkApiRequest.call(
			this,
			'GET',
			TINK_ENDPOINTS.INSIGHTS.ACCOUNTS,
			{},
			qs,
			{ userId },
		);
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: i } },
	);

	return executionData;
}
