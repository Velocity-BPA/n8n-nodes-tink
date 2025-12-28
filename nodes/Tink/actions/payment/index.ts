/**
 * Payment Resource Actions
 * 
 * Provides payment initiation service (PIS) functionality.
 * Supports PSD2-compliant payment initiation.
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { INodeProperties } from 'n8n-workflow';

export const paymentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['payment'],
			},
		},
		options: [
			{
				name: 'Create Payment',
				value: 'createPayment',
				description: 'Create a new payment',
				action: 'Create a payment',
			},
			{
				name: 'Get Payment',
				value: 'getPayment',
				description: 'Get a payment by ID',
				action: 'Get a payment',
			},
			{
				name: 'Get Payment Status',
				value: 'getPaymentStatus',
				description: 'Get the status of a payment',
				action: 'Get payment status',
			},
			{
				name: 'List Payments',
				value: 'listPayments',
				description: 'List all payments for a user',
				action: 'List payments',
			},
			{
				name: 'Cancel Payment',
				value: 'cancelPayment',
				description: 'Cancel a pending payment',
				action: 'Cancel a payment',
			},
			{
				name: 'Sign Payment',
				value: 'signPayment',
				description: 'Sign/authorize a payment',
				action: 'Sign a payment',
			},
		],
		default: 'createPayment',
	},
];

export const paymentFields: INodeProperties[] = [
	// User ID field
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		default: '',
		description: 'The Tink user ID',
		displayOptions: {
			show: {
				resource: ['payment'],
			},
		},
	},
	// Payment ID
	{
		displayName: 'Payment ID',
		name: 'paymentId',
		type: 'string',
		required: true,
		default: '',
		description: 'The payment ID',
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['getPayment', 'getPaymentStatus', 'cancelPayment', 'signPayment'],
			},
		},
	},
	// Payment details for creation
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		required: true,
		default: 0,
		description: 'Payment amount',
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['createPayment'],
			},
		},
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'options',
		options: [
			{ name: 'EUR', value: 'EUR' },
			{ name: 'GBP', value: 'GBP' },
			{ name: 'SEK', value: 'SEK' },
			{ name: 'NOK', value: 'NOK' },
			{ name: 'DKK', value: 'DKK' },
			{ name: 'PLN', value: 'PLN' },
		],
		required: true,
		default: 'EUR',
		description: 'Payment currency',
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['createPayment'],
			},
		},
	},
	{
		displayName: 'Source Account',
		name: 'sourceAccount',
		type: 'string',
		required: true,
		default: '',
		description: 'Source account ID or IBAN',
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['createPayment'],
			},
		},
	},
	{
		displayName: 'Destination IBAN',
		name: 'destinationIban',
		type: 'string',
		required: true,
		default: '',
		description: 'Destination account IBAN',
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['createPayment'],
			},
		},
	},
	{
		displayName: 'Beneficiary Name',
		name: 'beneficiaryName',
		type: 'string',
		required: true,
		default: '',
		description: 'Name of the payment beneficiary',
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['createPayment'],
			},
		},
	},
	{
		displayName: 'Reference',
		name: 'reference',
		type: 'string',
		default: '',
		description: 'Payment reference or message',
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['createPayment'],
			},
		},
	},
	// Options
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['payment'],
				operation: ['createPayment', 'listPayments'],
			},
		},
		options: [
			{
				displayName: 'BIC/SWIFT',
				name: 'bic',
				type: 'string',
				default: '',
				description: 'BIC/SWIFT code of the destination bank',
			},
			{
				displayName: 'Execution Date',
				name: 'executionDate',
				type: 'dateTime',
				default: '',
				description: 'Scheduled execution date for the payment',
			},
			{
				displayName: 'Provider ID',
				name: 'providerId',
				type: 'string',
				default: '',
				description: 'Specific provider to use for the payment',
			},
			{
				displayName: 'Payment Type',
				name: 'paymentType',
				type: 'options',
				options: [
					{ name: 'Domestic', value: 'DOMESTIC' },
					{ name: 'SEPA', value: 'SEPA' },
					{ name: 'International', value: 'INTERNATIONAL' },
				],
				default: 'SEPA',
				description: 'Type of payment',
			},
			{
				displayName: 'Status Filter',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: 'ALL' },
					{ name: 'Created', value: 'CREATED' },
					{ name: 'Pending', value: 'PENDING' },
					{ name: 'Signed', value: 'SIGNED' },
					{ name: 'Executed', value: 'EXECUTED' },
					{ name: 'Failed', value: 'FAILED' },
					{ name: 'Cancelled', value: 'CANCELLED' },
				],
				default: 'ALL',
				description: 'Filter payments by status',
			},
		],
	},
];
