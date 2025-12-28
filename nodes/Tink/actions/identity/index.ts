/**
 * Identity Resource Actions
 * 
 * Provides access to identity data from connected financial institutions.
 * Supports KYC (Know Your Customer) and identity verification.
 * 
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { INodeProperties } from 'n8n-workflow';

export const identityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['identity'],
			},
		},
		options: [
			{
				name: 'Get Identity Data',
				value: 'getIdentityData',
				description: 'Get all available identity data for a user',
				action: 'Get identity data',
			},
			{
				name: 'Verify Identity',
				value: 'verifyIdentity',
				description: 'Verify user identity against provided data',
				action: 'Verify identity',
			},
			{
				name: 'Get Identity Verification',
				value: 'getIdentityVerification',
				description: 'Get status of identity verification',
				action: 'Get identity verification',
			},
			{
				name: 'Get Personal Info',
				value: 'getPersonalInfo',
				description: 'Get personal information (name, DOB, etc.)',
				action: 'Get personal info',
			},
			{
				name: 'Get Name',
				value: 'getName',
				description: 'Get the user\'s name from bank records',
				action: 'Get name',
			},
			{
				name: 'Get Date of Birth',
				value: 'getDateOfBirth',
				description: 'Get the user\'s date of birth',
				action: 'Get date of birth',
			},
			{
				name: 'Get Address',
				value: 'getAddress',
				description: 'Get the user\'s registered address',
				action: 'Get address',
			},
			{
				name: 'Get SSN/National ID',
				value: 'getNationalId',
				description: 'Get SSN or national identification number',
				action: 'Get national ID',
			},
		],
		default: 'getIdentityData',
	},
];

export const identityFields: INodeProperties[] = [
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
				resource: ['identity'],
			},
		},
	},
	// Verification ID
	{
		displayName: 'Verification ID',
		name: 'verificationId',
		type: 'string',
		required: true,
		default: '',
		description: 'The verification request ID',
		displayOptions: {
			show: {
				resource: ['identity'],
				operation: ['getIdentityVerification'],
			},
		},
	},
	// Verification data
	{
		displayName: 'Verification Data',
		name: 'verificationData',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		description: 'Data to verify against bank records',
		displayOptions: {
			show: {
				resource: ['identity'],
				operation: ['verifyIdentity'],
			},
		},
		options: [
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'First name to verify',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'Last name to verify',
			},
			{
				displayName: 'Date of Birth',
				name: 'dateOfBirth',
				type: 'dateTime',
				default: '',
				description: 'Date of birth to verify (YYYY-MM-DD)',
			},
			{
				displayName: 'National ID',
				name: 'nationalId',
				type: 'string',
				default: '',
				description: 'SSN or national ID to verify',
			},
			{
				displayName: 'Street Address',
				name: 'streetAddress',
				type: 'string',
				default: '',
				description: 'Street address to verify',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City to verify',
			},
			{
				displayName: 'Postal Code',
				name: 'postalCode',
				type: 'string',
				default: '',
				description: 'Postal/ZIP code to verify',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'Country code (ISO 3166-1 alpha-2)',
			},
		],
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
				resource: ['identity'],
				operation: ['getIdentityData', 'getPersonalInfo'],
			},
		},
		options: [
			{
				displayName: 'Include All Credentials',
				name: 'includeAllCredentials',
				type: 'boolean',
				default: false,
				description: 'Whether to include data from all connected credentials',
			},
			{
				displayName: 'Credentials ID',
				name: 'credentialsId',
				type: 'string',
				default: '',
				description: 'Specific credentials to get identity from',
			},
		],
	},
];
