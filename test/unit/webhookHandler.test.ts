/**
 * Unit tests for Tink webhook handler
 *
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import {
	verifyWebhookSignature,
	createWebhookSignature,
	parseWebhookPayload,
} from '../../nodes/Tink/transport/webhookHandler';

describe('Webhook Handler', () => {
	const testSecret = 'test-webhook-secret-12345';
	
	describe('createWebhookSignature', () => {
		it('should create a valid HMAC-SHA256 signature', () => {
			const payload = '{"event":"account:created","data":{}}';
			const signature = createWebhookSignature(payload, testSecret);
			
			expect(signature).toBeDefined();
			expect(typeof signature).toBe('string');
			expect(signature.length).toBe(64); // SHA256 produces 64 hex characters
		});

		it('should create consistent signatures for same payload', () => {
			const payload = '{"event":"account:created"}';
			const sig1 = createWebhookSignature(payload, testSecret);
			const sig2 = createWebhookSignature(payload, testSecret);
			
			expect(sig1).toBe(sig2);
		});

		it('should create different signatures for different payloads', () => {
			const payload1 = '{"event":"account:created"}';
			const payload2 = '{"event":"account:updated"}';
			
			const sig1 = createWebhookSignature(payload1, testSecret);
			const sig2 = createWebhookSignature(payload2, testSecret);
			
			expect(sig1).not.toBe(sig2);
		});

		it('should create different signatures for different secrets', () => {
			const payload = '{"event":"account:created"}';
			const sig1 = createWebhookSignature(payload, 'secret1');
			const sig2 = createWebhookSignature(payload, 'secret2');
			
			expect(sig1).not.toBe(sig2);
		});
	});

	describe('verifyWebhookSignature', () => {
		it('should verify valid signature', () => {
			const payload = '{"event":"transaction:created","data":{"id":"123"}}';
			const signature = createWebhookSignature(payload, testSecret);
			
			expect(verifyWebhookSignature(payload, signature, testSecret)).toBe(true);
		});

		it('should reject invalid signature', () => {
			const payload = '{"event":"transaction:created"}';
			const invalidSignature = 'invalid-signature-12345678901234567890123456789012345678901234';
			
			expect(verifyWebhookSignature(payload, invalidSignature, testSecret)).toBe(false);
		});

		it('should reject tampered payload', () => {
			const originalPayload = '{"event":"transaction:created","amount":100}';
			const tamperedPayload = '{"event":"transaction:created","amount":1000}';
			const signature = createWebhookSignature(originalPayload, testSecret);
			
			expect(verifyWebhookSignature(tamperedPayload, signature, testSecret)).toBe(false);
		});

		it('should handle signature with sha256= prefix', () => {
			const payload = '{"event":"payment:executed"}';
			const signature = createWebhookSignature(payload, testSecret);
			const prefixedSignature = `sha256=${signature}`;
			
			expect(verifyWebhookSignature(payload, prefixedSignature, testSecret)).toBe(true);
		});

		it('should reject empty signature', () => {
			const payload = '{"event":"test"}';
			expect(verifyWebhookSignature(payload, '', testSecret)).toBe(false);
		});

		it('should reject empty secret', () => {
			const payload = '{"event":"test"}';
			const signature = 'somesignature';
			expect(verifyWebhookSignature(payload, signature, '')).toBe(false);
		});
	});

	describe('parseWebhookPayload', () => {
		it('should parse valid JSON payload', () => {
			const rawPayload = '{"event":"account:created","data":{"id":"acc-123","name":"Test"}}';
			const parsed = parseWebhookPayload(rawPayload);
			
			expect(parsed).toEqual({
				event: 'account:created',
				data: {
					id: 'acc-123',
					name: 'Test',
				},
			});
		});

		it('should handle nested objects', () => {
			const rawPayload = JSON.stringify({
				event: 'transaction:created',
				data: {
					id: 'txn-123',
					amount: {
						value: 100.50,
						currency: 'EUR',
					},
					merchant: {
						name: 'Test Store',
						category: 'retail',
					},
				},
			});
			
			const parsed = parseWebhookPayload(rawPayload);
			
			expect(parsed.event).toBe('transaction:created');
			expect(parsed.data.amount.value).toBe(100.50);
			expect(parsed.data.merchant.name).toBe('Test Store');
		});

		it('should handle arrays in payload', () => {
			const rawPayload = JSON.stringify({
				event: 'transactions:available',
				data: {
					transactionIds: ['txn-1', 'txn-2', 'txn-3'],
				},
			});
			
			const parsed = parseWebhookPayload(rawPayload);
			
			expect(parsed.data.transactionIds).toHaveLength(3);
			expect(parsed.data.transactionIds).toContain('txn-2');
		});

		it('should throw on invalid JSON', () => {
			const invalidPayload = 'not valid json {{{';
			
			expect(() => parseWebhookPayload(invalidPayload)).toThrow();
		});

		it('should handle empty object', () => {
			const parsed = parseWebhookPayload('{}');
			expect(parsed).toEqual({});
		});
	});
});
