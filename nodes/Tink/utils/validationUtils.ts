/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { NodeOperationError, INode } from 'n8n-workflow';
import { TINK_MARKETS } from '../constants/markets';

/**
 * Validation Utilities for Tink
 *
 * Input validation functions specific to Tink API requirements,
 * including IBAN validation, market codes, and amount formatting.
 */

/**
 * Validate IBAN format
 *
 * IBAN (International Bank Account Number) validation using
 * the ISO 13616 standard with mod-97 check.
 */
export function validateIban(iban: string): { valid: boolean; error?: string } {
  // Remove spaces and convert to uppercase
  const cleanIban = iban.replace(/\s+/g, '').toUpperCase();

  // Check basic format: 2 letters + 2 digits + up to 30 alphanumeric
  const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/;
  if (!ibanRegex.test(cleanIban)) {
    return { valid: false, error: 'Invalid IBAN format' };
  }

  // Validate country code
  const countryCode = cleanIban.substring(0, 2);
  const validCountries = ['AT', 'BE', 'BG', 'CH', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI',
    'FR', 'GB', 'GR', 'HR', 'HU', 'IE', 'IS', 'IT', 'LI', 'LT', 'LU', 'LV', 'MC', 'MT',
    'NL', 'NO', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK', 'SM'];

  if (!validCountries.includes(countryCode)) {
    return { valid: false, error: `Unsupported country code: ${countryCode}` };
  }

  // Validate check digits using mod-97
  const rearranged = cleanIban.substring(4) + cleanIban.substring(0, 4);
  const numericIban = rearranged
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      return code >= 65 && code <= 90 ? (code - 55).toString() : char;
    })
    .join('');

  // Calculate mod-97 (handling large numbers)
  let remainder = 0;
  for (const digit of numericIban) {
    remainder = (remainder * 10 + parseInt(digit, 10)) % 97;
  }

  if (remainder !== 1) {
    return { valid: false, error: 'Invalid IBAN check digits' };
  }

  return { valid: true };
}

/**
 * Validate Tink market code
 */
export function validateMarket(market: string): { valid: boolean; error?: string } {
  if (!market || typeof market !== 'string') {
    return { valid: false, error: 'Market code is required' };
  }

  const upperMarket = market.toUpperCase();
  if (!TINK_MARKETS[upperMarket]) {
    const validMarkets = Object.keys(TINK_MARKETS).join(', ');
    return { valid: false, error: `Invalid market code. Valid markets: ${validMarkets}` };
  }

  return { valid: true };
}

/**
 * Validate currency code (ISO 4217)
 */
export function validateCurrency(currency: string): { valid: boolean; error?: string } {
  const validCurrencies = ['EUR', 'GBP', 'SEK', 'NOK', 'DKK', 'PLN', 'CHF', 'CZK', 'HUF', 'RON'];

  if (!currency || typeof currency !== 'string') {
    return { valid: false, error: 'Currency code is required' };
  }

  const upperCurrency = currency.toUpperCase();
  if (!validCurrencies.includes(upperCurrency)) {
    return { valid: false, error: `Invalid currency code. Valid currencies: ${validCurrencies.join(', ')}` };
  }

  return { valid: true };
}

/**
 * Validate amount format
 *
 * Tink expects amounts as strings with up to 2 decimal places
 */
export function validateAmount(amount: number | string): { valid: boolean; error?: string; formatted?: string } {
  let numAmount: number;

  if (typeof amount === 'string') {
    numAmount = parseFloat(amount);
  } else {
    numAmount = amount;
  }

  if (isNaN(numAmount)) {
    return { valid: false, error: 'Invalid amount format' };
  }

  if (numAmount < 0) {
    return { valid: false, error: 'Amount cannot be negative' };
  }

  // Format to 2 decimal places
  const formatted = numAmount.toFixed(2);

  return { valid: true, formatted };
}

/**
 * Validate UUID format
 */
export function validateUuid(uuid: string): { valid: boolean; error?: string } {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuid || !uuidRegex.test(uuid)) {
    return { valid: false, error: 'Invalid UUID format' };
  }

  return { valid: true };
}

/**
 * Validate date format (ISO 8601)
 */
export function validateDate(dateString: string): { valid: boolean; error?: string; date?: Date } {
  if (!dateString) {
    return { valid: false, error: 'Date is required' };
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Invalid date format. Use ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ)' };
  }

  return { valid: true, date };
}

/**
 * Validate date range
 */
export function validateDateRange(
  startDate: string,
  endDate: string,
): { valid: boolean; error?: string } {
  const startValidation = validateDate(startDate);
  if (!startValidation.valid) {
    return { valid: false, error: `Start date: ${startValidation.error}` };
  }

  const endValidation = validateDate(endDate);
  if (!endValidation.valid) {
    return { valid: false, error: `End date: ${endValidation.error}` };
  }

  if (startValidation.date! > endValidation.date!) {
    return { valid: false, error: 'Start date must be before end date' };
  }

  return { valid: true };
}

/**
 * Validate external user ID format
 *
 * Tink allows alphanumeric external user IDs with some special characters
 */
export function validateExternalUserId(userId: string): { valid: boolean; error?: string } {
  if (!userId || typeof userId !== 'string') {
    return { valid: false, error: 'External user ID is required' };
  }

  if (userId.length < 1 || userId.length > 128) {
    return { valid: false, error: 'External user ID must be between 1 and 128 characters' };
  }

  // Allow alphanumeric, dashes, underscores, and periods
  const validRegex = /^[a-zA-Z0-9._-]+$/;
  if (!validRegex.test(userId)) {
    return { valid: false, error: 'External user ID contains invalid characters. Only alphanumeric, dash, underscore, and period are allowed.' };
  }

  return { valid: true };
}

/**
 * Validate webhook URL
 */
export function validateWebhookUrl(url: string): { valid: boolean; error?: string } {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'Webhook URL is required' };
  }

  try {
    const urlObj = new URL(url);
    if (urlObj.protocol !== 'https:') {
      return { valid: false, error: 'Webhook URL must use HTTPS' };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

/**
 * Validate and throw error if invalid
 */
export function assertValid(
  node: INode,
  validation: { valid: boolean; error?: string },
  fieldName: string,
): void {
  if (!validation.valid) {
    throw new NodeOperationError(node, validation.error || `Invalid ${fieldName}`, {
      description: `Validation failed for field: ${fieldName}`,
    });
  }
}

/**
 * Validate pagination parameters
 */
export function validatePagination(
  pageSize?: number,
  pageToken?: string,
): { valid: boolean; error?: string; params: { pageSize?: number; pageToken?: string } } {
  const params: { pageSize?: number; pageToken?: string } = {};

  if (pageSize !== undefined) {
    if (pageSize < 1 || pageSize > 1000) {
      return { valid: false, error: 'Page size must be between 1 and 1000', params };
    }
    params.pageSize = pageSize;
  }

  if (pageToken) {
    params.pageToken = pageToken;
  }

  return { valid: true, params };
}

/**
 * Clean and normalize input string
 */
export function normalizeString(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

/**
 * Validate BIC/SWIFT code
 */
export function validateBic(bic: string): { valid: boolean; error?: string } {
  // BIC format: 4 letters (bank) + 2 letters (country) + 2 alphanumeric (location) + optional 3 alphanumeric (branch)
  const bicRegex = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

  if (!bic || typeof bic !== 'string') {
    return { valid: false, error: 'BIC/SWIFT code is required' };
  }

  const cleanBic = bic.replace(/\s+/g, '').toUpperCase();
  if (!bicRegex.test(cleanBic)) {
    return { valid: false, error: 'Invalid BIC/SWIFT code format' };
  }

  return { valid: true };
}
