/**
 * Category Operations Execute
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { tinkApiRequest } from '../../transport/tinkClient';
import { TINK_ENDPOINTS } from '../../constants/endpoints';
import {
	getCategoryByCode,
	getCategoriesByPrimary,
	getAllPrimaryCategories,
	getAllCategories,
	buildCategoryTree,
	getCategoriesByType,
} from '../../utils/categoryUtils';

export async function executeCategoryOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[] = {};

	if (operation === 'list') {
		const listOptions = this.getNodeParameter('listOptions', i, {}) as IDataObject;

		try {
			// Try to get from API first
			const qs: IDataObject = {};
			if (listOptions.locale) {
				qs.locale = listOptions.locale;
			}

			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.CATEGORIES.BASE,
				{},
				qs,
			);
			responseData = (responseData as IDataObject).categories as IDataObject[] || [];
		} catch {
			// Fallback to local categories
			let categories = getAllCategories();

			if (listOptions.typeFilter && listOptions.typeFilter !== 'ALL') {
				const typeMap: Record<string, string> = {
					EXPENSE: 'expense',
					INCOME: 'income',
					TRANSFER: 'transfer',
				};
				const categoryType = typeMap[listOptions.typeFilter as string];
				if (categoryType) {
					categories = getCategoriesByType(categoryType as 'income' | 'expense' | 'transfer');
				}
			}

			responseData = categories.map(cat => ({
				code: cat.code,
				name: cat.name,
				type: cat.type,
				primaryCategory: cat.primaryCategory,
				icon: cat.icon,
			}));
		}
	}

	if (operation === 'getByCode') {
		const categoryCode = this.getNodeParameter('categoryCode', i) as string;

		try {
			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.CATEGORIES.BY_CODE(categoryCode),
			);
		} catch {
			// Fallback to local category lookup
			const category = getCategoryByCode(categoryCode);
			if (category) {
				responseData = {
					code: category.code,
					name: category.name,
					type: category.type,
					primaryCategory: category.primaryCategory,
					icon: category.icon,
				};
			} else {
				throw new Error(`Category '${categoryCode}' not found`);
			}
		}
	}

	if (operation === 'getPrimary') {
		try {
			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.CATEGORIES.PRIMARY,
			);
			responseData = (responseData as IDataObject).categories as IDataObject[] || [];
		} catch {
			// Fallback to local primary categories
			const primaryCategories = getAllPrimaryCategories();
			responseData = primaryCategories.map(cat => ({
				code: cat.code,
				name: cat.name,
				type: cat.type,
			}));
		}
	}

	if (operation === 'getSecondary') {
		const primaryCategory = this.getNodeParameter('primaryCategory', i) as string;

		try {
			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.CATEGORIES.SECONDARY(primaryCategory),
			);
			responseData = (responseData as IDataObject).categories as IDataObject[] || [];
		} catch {
			// Fallback to local secondary categories
			const secondaryCategories = getCategoriesByPrimary(primaryCategory);
			responseData = secondaryCategories.map(cat => ({
				code: cat.code,
				name: cat.name,
				type: cat.type,
				primaryCategory: cat.primaryCategory,
				icon: cat.icon,
			}));
		}
	}

	if (operation === 'getTree') {
		const treeOptions = this.getNodeParameter('treeOptions', i, {}) as IDataObject;

		try {
			const qs: IDataObject = {};
			if (treeOptions.locale) {
				qs.locale = treeOptions.locale;
			}
			if (treeOptions.depth) {
				qs.depth = treeOptions.depth;
			}
			if (treeOptions.rootCategory) {
				qs.root = treeOptions.rootCategory;
			}

			responseData = await tinkApiRequest.call(
				this,
				'GET',
				TINK_ENDPOINTS.CATEGORIES.TREE,
				{},
				qs,
			);
		} catch {
			// Fallback to local category tree
			const tree = buildCategoryTree();

			if (treeOptions.rootCategory) {
				// Filter to specific root
				const rootKey = treeOptions.rootCategory as string;
				if ((tree as Record<string, unknown>)[rootKey]) {
					responseData = {
						[rootKey]: (tree as Record<string, unknown>)[rootKey],
					};
				} else {
					responseData = tree as IDataObject;
				}
			} else {
				responseData = tree as IDataObject;
			}
		}
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: i } },
	);

	return executionData;
}
