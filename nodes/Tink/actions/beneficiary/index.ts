/**
 * Beneficiary Resource
 * 
 * Manage payment beneficiaries for recurring transfers
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { INodeProperties } from 'n8n-workflow';

export const beneficiaryOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['beneficiary'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new beneficiary',
				action: 'Create a beneficiary',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a beneficiary',
				action: 'Delete a beneficiary',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a beneficiary by ID',
				action: 'Get a beneficiary',
			},
			{
				name: 'Get Accounts',
				value: 'getAccounts',
				description: 'Get beneficiary accounts',
				action: 'Get beneficiary accounts',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all beneficiaries',
				action: 'List all beneficiaries',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a beneficiary',
				action: 'Update a beneficiary',
			},
		],
		default: 'list',
	},
];

export const beneficiaryFields: INodeProperties[] = [
	// ----------------------------------
	//         beneficiary:create
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['beneficiary'],
				operation: ['create', 'list', 'getAccounts'],
			},
		},
		default: '',
		description: 'The ID of the user',
	},
	{
		displayName: 'Account Number',
		name: 'accountNumber',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['beneficiary'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The beneficiary account number (IBAN or local format)',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['beneficiary'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The beneficiary name',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['beneficiary'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Account Number Type',
				name: 'accountNumberType',
				type: 'options',
				options: [
					{ name: 'IBAN', value: 'IBAN' },
					{ name: 'BBAN', value: 'BBAN' },
					{ name: 'Sort Code', value: 'SORT_CODE' },
				],
				default: 'IBAN',
				description: 'The type of account number',
			},
			{
				displayName: 'BIC',
				name: 'bic',
				type: 'string',
				default: '',
				description: 'Bank Identifier Code (SWIFT code)',
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: 'EUR',
				description: 'The currency code (ISO 4217)',
			},
			{
				displayName: 'Reference',
				name: 'reference',
				type: 'string',
				default: '',
				description: 'Optional reference for payments to this beneficiary',
			},
		],
	},

	// ----------------------------------
	//         beneficiary:get
	// ----------------------------------
	{
		displayName: 'Beneficiary ID',
		name: 'beneficiaryId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['beneficiary'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the beneficiary',
	},

	// ----------------------------------
	//         beneficiary:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['beneficiary'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Account Number',
				name: 'accountNumber',
				type: 'string',
				default: '',
				description: 'The beneficiary account number',
			},
			{
				displayName: 'BIC',
				name: 'bic',
				type: 'string',
				default: '',
				description: 'Bank Identifier Code',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The beneficiary name',
			},
			{
				displayName: 'Reference',
				name: 'reference',
				type: 'string',
				default: '',
				description: 'Payment reference',
			},
		],
	},

	// ----------------------------------
	//         beneficiary:list
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['beneficiary'],
				operation: ['list'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['beneficiary'],
				operation: ['list'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Max number of results to return',
	},
];
