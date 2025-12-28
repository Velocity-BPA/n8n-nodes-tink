/**
 * Statistics Resource - Execute Functions
 * Handles aggregated financial statistics and analytics
 *
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { tinkApiRequest } from '../../transport/tinkClient';

/**
 * Get general statistics for user
 */
export async function getStatistics(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const period = this.getNodeParameter('period', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const qs: IDataObject = {
		period,
	};

	if (period === 'CUSTOM') {
		if (additionalFields.startDate) {
			qs.startDate = additionalFields.startDate;
		}
		if (additionalFields.endDate) {
			qs.endDate = additionalFields.endDate;
		}
	}

	if (additionalFields.includeCategories !== undefined) {
		qs.includeCategories = additionalFields.includeCategories;
	}

	if (additionalFields.includeTrends !== undefined) {
		qs.includeTrends = additionalFields.includeTrends;
	}

	return tinkApiRequest.call(this, 'GET', '/api/v1/statistics', undefined, qs);
}

/**
 * Get account-level statistics
 */
export async function getAccountStatistics(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const period = this.getNodeParameter('period', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const qs: IDataObject = {
		period,
	};

	if (period === 'CUSTOM') {
		if (additionalFields.startDate) {
			qs.startDate = additionalFields.startDate;
		}
		if (additionalFields.endDate) {
			qs.endDate = additionalFields.endDate;
		}
	}

	if (additionalFields.accountId) {
		qs.accountId = additionalFields.accountId;
	}

	if (additionalFields.accountTypes) {
		qs.accountTypes = (additionalFields.accountTypes as string[]).join(',');
	}

	if (additionalFields.includeBalanceHistory !== undefined) {
		qs.includeBalanceHistory = additionalFields.includeBalanceHistory;
	}

	const response = await tinkApiRequest.call(this, 'GET', '/api/v1/statistics/accounts', undefined, qs);

	return {
		accounts: response.accounts || [],
		summary: response.summary || {},
		period: {
			type: period,
			startDate: qs.startDate,
			endDate: qs.endDate,
		},
	};
}

/**
 * Get transaction statistics with grouping options
 */
export async function getTransactionStatistics(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const period = this.getNodeParameter('period', index) as string;
	const groupBy = this.getNodeParameter('groupBy', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const qs: IDataObject = {
		period,
		groupBy,
	};

	if (period === 'CUSTOM') {
		if (additionalFields.startDate) {
			qs.startDate = additionalFields.startDate;
		}
		if (additionalFields.endDate) {
			qs.endDate = additionalFields.endDate;
		}
	}

	if (additionalFields.accountId) {
		qs.accountId = additionalFields.accountId;
	}

	if (additionalFields.categoryCode) {
		qs.categoryCode = additionalFields.categoryCode;
	}

	if (additionalFields.transactionType) {
		qs.transactionType = additionalFields.transactionType;
	}

	if (additionalFields.excludeTransfers !== undefined) {
		qs.excludeTransfers = additionalFields.excludeTransfers;
	}

	const response = await tinkApiRequest.call(this, 'GET', '/api/v1/statistics/transactions', undefined, qs);

	return {
		statistics: response.statistics || [],
		summary: response.summary || {},
		groupBy,
		period: {
			type: period,
			startDate: qs.startDate,
			endDate: qs.endDate,
		},
	};
}

/**
 * Get monthly statistics over time
 */
export async function getMonthlyStatistics(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const months = this.getNodeParameter('months', index) as number;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const qs: IDataObject = {
		months,
	};

	if (additionalFields.accountId) {
		qs.accountId = additionalFields.accountId;
	}

	if (additionalFields.includeCategoryBreakdown !== undefined) {
		qs.includeCategoryBreakdown = additionalFields.includeCategoryBreakdown;
	}

	if (additionalFields.includeComparison !== undefined) {
		qs.includeComparison = additionalFields.includeComparison;
	}

	if (additionalFields.transactionType) {
		qs.transactionType = additionalFields.transactionType;
	}

	const response = await tinkApiRequest.call(this, 'GET', '/api/v1/statistics/monthly', undefined, qs);

	return {
		monthlyData: response.monthlyData || [],
		trends: response.trends || {},
		months,
	};
}

/**
 * Get category statistics with top categories
 */
export async function getCategoryStatistics(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const period = this.getNodeParameter('period', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	const qs: IDataObject = {
		period,
	};

	if (period === 'CUSTOM') {
		if (additionalFields.startDate) {
			qs.startDate = additionalFields.startDate;
		}
		if (additionalFields.endDate) {
			qs.endDate = additionalFields.endDate;
		}
	}

	if (additionalFields.accountId) {
		qs.accountId = additionalFields.accountId;
	}

	if (additionalFields.topN) {
		qs.topN = additionalFields.topN;
	}

	if (additionalFields.transactionType) {
		qs.transactionType = additionalFields.transactionType;
	}

	if (additionalFields.includeSubcategories !== undefined) {
		qs.includeSubcategories = additionalFields.includeSubcategories;
	}

	if (additionalFields.categoryLevel) {
		qs.categoryLevel = additionalFields.categoryLevel;
	}

	const response = await tinkApiRequest.call(this, 'GET', '/api/v1/statistics/categories', undefined, qs);

	return {
		categories: response.categories || [],
		totals: response.totals || {},
		period: {
			type: period,
			startDate: qs.startDate,
			endDate: qs.endDate,
		},
	};
}
