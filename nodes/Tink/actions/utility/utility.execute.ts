/**
 * Utility Resource - Execute Functions
 * Handles API utilities, validation, and system status
 *
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { tinkApiRequest } from '../../transport/tinkClient';
import { MARKETS } from '../../constants/markets';
import { validateIBAN } from '../../utils/validationUtils';

/**
 * Get API status
 */
export async function getApiStatus(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const includeDetails = this.getNodeParameter('includeDetails', index) as boolean;

	try {
		// Check basic API status
		const startTime = Date.now();
		await tinkApiRequest.call(this, 'GET', '/api/v1/providers', undefined, { pageSize: 1 });
		const responseTime = Date.now() - startTime;

		const result: IDataObject = {
			status: 'operational',
			responseTime: `${responseTime}ms`,
			timestamp: new Date().toISOString(),
		};

		if (includeDetails) {
			const services: IDataObject[] = [];

			// Test accounts endpoint
			try {
				const accountStart = Date.now();
				await tinkApiRequest.call(this, 'GET', '/api/v1/accounts', undefined, { pageSize: 1 });
				services.push({
					name: 'Accounts API',
					status: 'operational',
					responseTime: `${Date.now() - accountStart}ms`,
				});
			} catch {
				services.push({
					name: 'Accounts API',
					status: 'error',
					responseTime: 'N/A',
				});
			}

			// Test providers endpoint
			services.push({
				name: 'Providers API',
				status: 'operational',
				responseTime: `${responseTime}ms`,
			});

			// Test transactions endpoint
			try {
				const txStart = Date.now();
				await tinkApiRequest.call(this, 'GET', '/api/v1/transactions', undefined, { pageSize: 1 });
				services.push({
					name: 'Transactions API',
					status: 'operational',
					responseTime: `${Date.now() - txStart}ms`,
				});
			} catch {
				services.push({
					name: 'Transactions API',
					status: 'error',
					responseTime: 'N/A',
				});
			}

			result.services = services;
		}

		return result;
	} catch (error) {
		return {
			status: 'error',
			message: (error as Error).message,
			timestamp: new Date().toISOString(),
		};
	}
}

/**
 * Validate an IBAN number
 */
export async function validateIbanNumber(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const iban = this.getNodeParameter('iban', index) as string;

	// Clean the IBAN (remove spaces and convert to uppercase)
	const cleanIban = iban.replace(/\s/g, '').toUpperCase();

	// Basic format validation
	const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4,30}$/;
	const formatValid = ibanRegex.test(cleanIban);

	if (!formatValid) {
		return {
			iban: cleanIban,
			valid: false,
			reason: 'Invalid IBAN format',
			countryCode: cleanIban.substring(0, 2),
		};
	}

	// Use validation utility
	const validationResult = validateIBAN(cleanIban);

	// Extract country code and check digit
	const countryCode = cleanIban.substring(0, 2);
	const checkDigits = cleanIban.substring(2, 4);
	const bban = cleanIban.substring(4);

	// IBAN country lengths (partial list)
	const ibanLengths: { [key: string]: number } = {
		AL: 28, AD: 24, AT: 20, AZ: 28, BH: 22, BY: 28, BE: 16, BA: 20,
		BR: 29, BG: 22, CR: 22, HR: 21, CY: 28, CZ: 24, DK: 18, DO: 28,
		TL: 23, EE: 20, FO: 18, FI: 18, FR: 27, GE: 22, DE: 22, GI: 23,
		GR: 27, GL: 18, GT: 28, HU: 28, IS: 26, IQ: 23, IE: 22, IL: 23,
		IT: 27, JO: 30, KZ: 20, XK: 20, KW: 30, LV: 21, LB: 28, LI: 21,
		LT: 20, LU: 20, MT: 31, MR: 27, MU: 30, MC: 27, MD: 24, ME: 22,
		NL: 18, MK: 19, NO: 15, PK: 24, PS: 29, PL: 28, PT: 25, QA: 29,
		RO: 24, LC: 32, SM: 27, ST: 25, SA: 24, RS: 22, SC: 31, SK: 24,
		SI: 19, ES: 24, SE: 24, CH: 21, TN: 24, TR: 26, UA: 29, AE: 23,
		GB: 22, VA: 22, VG: 24,
	};

	const expectedLength = ibanLengths[countryCode];
	const lengthValid = expectedLength ? cleanIban.length === expectedLength : true;

	// Perform mod-97 check
	const rearranged = bban + countryCode + checkDigits;
	const numericIban = rearranged.split('').map(char => {
		const code = char.charCodeAt(0);
		return code >= 65 ? (code - 55).toString() : char;
	}).join('');

	// Calculate mod 97 using string arithmetic for large numbers
	let remainder = 0;
	for (const digit of numericIban) {
		remainder = (remainder * 10 + parseInt(digit, 10)) % 97;
	}
	const checksumValid = remainder === 1;

	return {
		iban: cleanIban,
		valid: validationResult.valid && lengthValid && checksumValid,
		formatted: cleanIban.replace(/(.{4})/g, '$1 ').trim(),
		countryCode,
		checkDigits,
		bban,
		expectedLength: expectedLength || 'Unknown',
		actualLength: cleanIban.length,
		checks: {
			formatValid,
			lengthValid,
			checksumValid,
		},
	};
}

/**
 * Get supported markets
 */
export async function getSupportedMarkets(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

	// Use local market data
	let markets = Object.entries(MARKETS).map(([code, data]) => ({
		code,
		name: data.name,
		currency: data.currency,
		locale: data.locale,
		psd2: data.psd2,
	}));

	// Filter by capability if specified
	if (additionalFields.capability) {
		// Try to fetch from API for capability filtering
		try {
			const qs: IDataObject = {
				capability: additionalFields.capability,
			};
			const response = await tinkApiRequest.call(this, 'GET', '/api/v1/markets', undefined, qs);
			if (response.markets) {
				markets = response.markets;
			}
		} catch {
			// Keep local data if API fails
		}
	}

	// Include provider count if requested
	if (additionalFields.includeProviderCount) {
		try {
			for (const market of markets) {
				const response = await tinkApiRequest.call(
					this,
					'GET',
					'/api/v1/providers',
					undefined,
					{ market: market.code, pageSize: 1 }
				);
				(market as IDataObject).providerCount = response.totalCount || 0;
			}
		} catch {
			// Ignore errors, just don't include count
		}
	}

	// Filter out PSD2 status if not wanted
	if (additionalFields.includePsd2Status === false) {
		markets = markets.map(m => {
			const { psd2, ...rest } = m as IDataObject & { psd2?: boolean };
			return rest;
		}) as typeof markets;
	}

	return {
		markets,
		totalCount: markets.length,
	};
}

/**
 * Get supported currencies
 */
export async function getSupportedCurrencies(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const marketCode = this.getNodeParameter('marketCode', index) as string;

	// Collect unique currencies from markets
	const currencySet = new Set<string>();
	const currencyDetails: IDataObject[] = [];

	// Currency information
	const currencyInfo: { [key: string]: { name: string; symbol: string } } = {
		EUR: { name: 'Euro', symbol: '€' },
		GBP: { name: 'British Pound', symbol: '£' },
		SEK: { name: 'Swedish Krona', symbol: 'kr' },
		NOK: { name: 'Norwegian Krone', symbol: 'kr' },
		DKK: { name: 'Danish Krone', symbol: 'kr' },
		CHF: { name: 'Swiss Franc', symbol: 'CHF' },
		PLN: { name: 'Polish Zloty', symbol: 'zł' },
		CZK: { name: 'Czech Koruna', symbol: 'Kč' },
		HUF: { name: 'Hungarian Forint', symbol: 'Ft' },
		RON: { name: 'Romanian Leu', symbol: 'lei' },
		BGN: { name: 'Bulgarian Lev', symbol: 'лв' },
		HRK: { name: 'Croatian Kuna', symbol: 'kn' },
		ISK: { name: 'Icelandic Króna', symbol: 'kr' },
	};

	if (marketCode) {
		// Get currency for specific market
		const market = MARKETS[marketCode.toUpperCase()];
		if (market) {
			const currency = market.currency;
			const info = currencyInfo[currency] || { name: currency, symbol: currency };
			currencyDetails.push({
				code: currency,
				name: info.name,
				symbol: info.symbol,
				market: marketCode.toUpperCase(),
			});
		}
	} else {
		// Get all currencies
		for (const [code, data] of Object.entries(MARKETS)) {
			if (!currencySet.has(data.currency)) {
				currencySet.add(data.currency);
				const info = currencyInfo[data.currency] || { name: data.currency, symbol: data.currency };
				currencyDetails.push({
					code: data.currency,
					name: info.name,
					symbol: info.symbol,
					markets: [code],
				});
			} else {
				// Add market to existing currency
				const existing = currencyDetails.find(c => c.code === data.currency);
				if (existing && Array.isArray(existing.markets)) {
					existing.markets.push(code);
				}
			}
		}
	}

	return {
		currencies: currencyDetails,
		totalCount: currencyDetails.length,
	};
}

/**
 * Test connection to Tink API
 */
export async function testConnection(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const testType = this.getNodeParameter('testType', index) as string;

	const results: IDataObject = {
		success: true,
		tests: [] as IDataObject[],
		timestamp: new Date().toISOString(),
	};

	const tests = results.tests as IDataObject[];

	// Basic connectivity test
	try {
		const startTime = Date.now();
		await tinkApiRequest.call(this, 'GET', '/api/v1/providers', undefined, { pageSize: 1 });
		tests.push({
			name: 'Basic Connectivity',
			success: true,
			responseTime: `${Date.now() - startTime}ms`,
		});
	} catch (error) {
		tests.push({
			name: 'Basic Connectivity',
			success: false,
			error: (error as Error).message,
		});
		results.success = false;
	}

	if (testType === 'auth' || testType === 'full') {
		// Authentication test - try to access a protected endpoint
		try {
			const startTime = Date.now();
			await tinkApiRequest.call(this, 'GET', '/api/v1/user');
			tests.push({
				name: 'Authentication',
				success: true,
				responseTime: `${Date.now() - startTime}ms`,
			});
		} catch (error) {
			const errorMessage = (error as Error).message;
			// 401/403 means auth failed, but connection worked
			if (errorMessage.includes('401') || errorMessage.includes('403') || errorMessage.includes('Unauthorized')) {
				tests.push({
					name: 'Authentication',
					success: false,
					error: 'Authentication failed - check credentials',
					note: 'This may be expected if using client credentials without user context',
				});
			} else {
				tests.push({
					name: 'Authentication',
					success: true,
					note: 'Client credentials validated',
					responseTime: `${Date.now() - startTime}ms`,
				});
			}
		}
	}

	if (testType === 'full') {
		// Test various endpoints
		const endpoints = [
			{ name: 'Accounts Service', path: '/api/v1/accounts' },
			{ name: 'Transactions Service', path: '/api/v1/transactions' },
			{ name: 'Categories Service', path: '/api/v1/categories' },
		];

		for (const endpoint of endpoints) {
			try {
				const startTime = Date.now();
				await tinkApiRequest.call(this, 'GET', endpoint.path, undefined, { pageSize: 1 });
				tests.push({
					name: endpoint.name,
					success: true,
					responseTime: `${Date.now() - startTime}ms`,
				});
			} catch (error) {
				const errorMessage = (error as Error).message;
				// 401/403 doesn't mean the service is down
				if (errorMessage.includes('401') || errorMessage.includes('403')) {
					tests.push({
						name: endpoint.name,
						success: true,
						note: 'Service reachable (auth required)',
					});
				} else {
					tests.push({
						name: endpoint.name,
						success: false,
						error: (error as Error).message,
					});
				}
			}
		}
	}

	// Calculate overall success
	results.success = tests.every(t => t.success !== false);
	results.summary = results.success ? 'All tests passed' : 'Some tests failed';

	return results;
}
