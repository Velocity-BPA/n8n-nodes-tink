/**
 * Unit tests for Tink validation utilities
 *
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import {
	validateIban,
	validateBic,
	validateAccountNumber,
	formatIban,
	extractCountryFromIban,
} from '../../nodes/Tink/utils/validationUtils';

describe('Validation Utils', () => {
	describe('validateIban', () => {
		it('should validate correct German IBAN', () => {
			expect(validateIban('DE89370400440532013000')).toBe(true);
		});

		it('should validate correct UK IBAN', () => {
			expect(validateIban('GB29NWBK60161331926819')).toBe(true);
		});

		it('should validate correct French IBAN', () => {
			expect(validateIban('FR7630006000011234567890189')).toBe(true);
		});

		it('should validate correct Swedish IBAN', () => {
			expect(validateIban('SE4550000000058398257466')).toBe(true);
		});

		it('should handle IBANs with spaces', () => {
			expect(validateIban('DE89 3704 0044 0532 0130 00')).toBe(true);
		});

		it('should handle lowercase IBANs', () => {
			expect(validateIban('de89370400440532013000')).toBe(true);
		});

		it('should reject invalid IBAN (wrong checksum)', () => {
			expect(validateIban('DE89370400440532013001')).toBe(false);
		});

		it('should reject IBAN that is too short', () => {
			expect(validateIban('DE8937040044')).toBe(false);
		});

		it('should reject empty string', () => {
			expect(validateIban('')).toBe(false);
		});

		it('should reject null-like values', () => {
			expect(validateIban(undefined as unknown as string)).toBe(false);
		});
	});

	describe('validateBic', () => {
		it('should validate 8-character BIC', () => {
			expect(validateBic('DEUTDEFF')).toBe(true);
		});

		it('should validate 11-character BIC', () => {
			expect(validateBic('DEUTDEFF500')).toBe(true);
		});

		it('should handle lowercase BIC', () => {
			expect(validateBic('deutdeff')).toBe(true);
		});

		it('should reject BIC that is too short', () => {
			expect(validateBic('DEUT')).toBe(false);
		});

		it('should reject BIC with invalid characters', () => {
			expect(validateBic('DEUT!EFF')).toBe(false);
		});

		it('should reject empty string', () => {
			expect(validateBic('')).toBe(false);
		});
	});

	describe('validateAccountNumber', () => {
		it('should validate numeric account number', () => {
			expect(validateAccountNumber('12345678', 'SE')).toBe(true);
		});

		it('should validate UK sort code format', () => {
			expect(validateAccountNumber('12-34-56', 'GB')).toBe(true);
		});

		it('should validate alphanumeric account number', () => {
			expect(validateAccountNumber('ABC123', 'DE')).toBe(true);
		});

		it('should reject account number that is too short', () => {
			expect(validateAccountNumber('12', 'SE')).toBe(false);
		});

		it('should reject account number that is too long', () => {
			const longNumber = '1'.repeat(40);
			expect(validateAccountNumber(longNumber, 'SE')).toBe(false);
		});

		it('should reject empty string', () => {
			expect(validateAccountNumber('', 'SE')).toBe(false);
		});
	});

	describe('formatIban', () => {
		it('should format IBAN with spaces', () => {
			expect(formatIban('DE89370400440532013000')).toBe('DE89 3704 0044 0532 0130 00');
		});

		it('should convert to uppercase', () => {
			expect(formatIban('de89370400440532013000')).toBe('DE89 3704 0044 0532 0130 00');
		});

		it('should handle already formatted IBAN', () => {
			expect(formatIban('DE89 3704 0044 0532 0130 00')).toBe('DE89 3704 0044 0532 0130 00');
		});

		it('should return empty string for invalid input', () => {
			expect(formatIban('')).toBe('');
		});
	});

	describe('extractCountryFromIban', () => {
		it('should extract country code from IBAN', () => {
			expect(extractCountryFromIban('DE89370400440532013000')).toBe('DE');
		});

		it('should extract country code from lowercase IBAN', () => {
			expect(extractCountryFromIban('de89370400440532013000')).toBe('DE');
		});

		it('should extract country code from formatted IBAN', () => {
			expect(extractCountryFromIban('GB29 NWBK 6016 1331 9268 19')).toBe('GB');
		});

		it('should return empty string for invalid IBAN', () => {
			expect(extractCountryFromIban('')).toBe('');
		});
	});
});
