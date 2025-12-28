/**
 * Integration tests for Tink Node
 *
 * @license BSL-1.1
 * @copyright Velocity BPA
 */

import { Tink } from '../../nodes/Tink/Tink.node';
import { TinkTrigger } from '../../nodes/Tink/TinkTrigger.node';

describe('Tink Node', () => {
	let tinkNode: Tink;

	beforeEach(() => {
		tinkNode = new Tink();
	});

	describe('Node Description', () => {
		it('should have correct display name', () => {
			expect(tinkNode.description.displayName).toBe('Tink');
		});

		it('should have correct node name', () => {
			expect(tinkNode.description.name).toBe('tink');
		});

		it('should have correct group', () => {
			expect(tinkNode.description.group).toContain('transform');
		});

		it('should have correct inputs', () => {
			expect(tinkNode.description.inputs).toContain('main');
		});

		it('should have correct outputs', () => {
			expect(tinkNode.description.outputs).toContain('main');
		});

		it('should have icon defined', () => {
			expect(tinkNode.description.icon).toBe('file:tink.svg');
		});

		it('should have version 1', () => {
			expect(tinkNode.description.version).toBe(1);
		});
	});

	describe('Credentials', () => {
		it('should have API credentials option', () => {
			const credentials = tinkNode.description.credentials;
			const apiCred = credentials?.find(c => c.name === 'tinkApi');
			
			expect(apiCred).toBeDefined();
			expect(apiCred?.required).toBe(true);
		});

		it('should have OAuth credentials option', () => {
			const credentials = tinkNode.description.credentials;
			const oauthCred = credentials?.find(c => c.name === 'tinkOAuth');
			
			expect(oauthCred).toBeDefined();
			expect(oauthCred?.required).toBe(true);
		});
	});

	describe('Resources', () => {
		it('should have resource property', () => {
			const resourceProp = tinkNode.description.properties?.find(
				p => p.name === 'resource'
			);
			
			expect(resourceProp).toBeDefined();
			expect(resourceProp?.type).toBe('options');
		});

		it('should have all 21 resources defined', () => {
			const resourceProp = tinkNode.description.properties?.find(
				p => p.name === 'resource'
			);
			
			const options = resourceProp?.options as Array<{ value: string }>;
			const resourceValues = options?.map(o => o.value) || [];
			
			expect(resourceValues).toContain('user');
			expect(resourceValues).toContain('account');
			expect(resourceValues).toContain('transaction');
			expect(resourceValues).toContain('balance');
			expect(resourceValues).toContain('credentials');
			expect(resourceValues).toContain('provider');
			expect(resourceValues).toContain('identity');
			expect(resourceValues).toContain('payment');
			expect(resourceValues).toContain('transfer');
			expect(resourceValues).toContain('beneficiary');
			expect(resourceValues).toContain('consent');
			expect(resourceValues).toContain('insights');
			expect(resourceValues).toContain('enrichment');
			expect(resourceValues).toContain('connect');
			expect(resourceValues).toContain('report');
			expect(resourceValues).toContain('webhook');
			expect(resourceValues).toContain('accessToken');
			expect(resourceValues).toContain('market');
			expect(resourceValues).toContain('category');
			expect(resourceValues).toContain('statistics');
			expect(resourceValues).toContain('utility');
		});

		it('should have account as default resource', () => {
			const resourceProp = tinkNode.description.properties?.find(
				p => p.name === 'resource'
			);
			
			expect(resourceProp?.default).toBe('account');
		});
	});

	describe('Authentication', () => {
		it('should have authentication property', () => {
			const authProp = tinkNode.description.properties?.find(
				p => p.name === 'authentication'
			);
			
			expect(authProp).toBeDefined();
			expect(authProp?.type).toBe('options');
		});

		it('should have API Key and OAuth options', () => {
			const authProp = tinkNode.description.properties?.find(
				p => p.name === 'authentication'
			);
			
			const options = authProp?.options as Array<{ value: string }>;
			const authValues = options?.map(o => o.value) || [];
			
			expect(authValues).toContain('apiKey');
			expect(authValues).toContain('oauth');
		});
	});
});

describe('Tink Trigger Node', () => {
	let triggerNode: TinkTrigger;

	beforeEach(() => {
		triggerNode = new TinkTrigger();
	});

	describe('Node Description', () => {
		it('should have correct display name', () => {
			expect(triggerNode.description.displayName).toBe('Tink Trigger');
		});

		it('should have correct node name', () => {
			expect(triggerNode.description.name).toBe('tinkTrigger');
		});

		it('should have trigger group', () => {
			expect(triggerNode.description.group).toContain('trigger');
		});

		it('should have no inputs', () => {
			expect(triggerNode.description.inputs).toEqual([]);
		});

		it('should have main output', () => {
			expect(triggerNode.description.outputs).toContain('main');
		});

		it('should have icon defined', () => {
			expect(triggerNode.description.icon).toBe('file:tink.svg');
		});
	});

	describe('Webhooks', () => {
		it('should have webhook configuration', () => {
			const webhooks = triggerNode.description.webhooks;
			
			expect(webhooks).toBeDefined();
			expect(webhooks?.length).toBeGreaterThan(0);
		});

		it('should use POST method', () => {
			const webhook = triggerNode.description.webhooks?.[0];
			
			expect(webhook?.httpMethod).toBe('POST');
		});

		it('should have onReceived response mode', () => {
			const webhook = triggerNode.description.webhooks?.[0];
			
			expect(webhook?.responseMode).toBe('onReceived');
		});
	});

	describe('Event Categories', () => {
		it('should have event category property', () => {
			const categoryProp = triggerNode.description.properties?.find(
				p => p.name === 'eventCategory'
			);
			
			expect(categoryProp).toBeDefined();
			expect(categoryProp?.type).toBe('options');
		});

		it('should have all event categories', () => {
			const categoryProp = triggerNode.description.properties?.find(
				p => p.name === 'eventCategory'
			);
			
			const options = categoryProp?.options as Array<{ value: string }>;
			const categories = options?.map(o => o.value) || [];
			
			expect(categories).toContain('account');
			expect(categories).toContain('transaction');
			expect(categories).toContain('credentials');
			expect(categories).toContain('balance');
			expect(categories).toContain('payment');
			expect(categories).toContain('transfer');
			expect(categories).toContain('consent');
			expect(categories).toContain('report');
			expect(categories).toContain('user');
		});
	});

	describe('Webhook Methods', () => {
		it('should have checkExists method', () => {
			expect(triggerNode.webhookMethods.default.checkExists).toBeDefined();
		});

		it('should have create method', () => {
			expect(triggerNode.webhookMethods.default.create).toBeDefined();
		});

		it('should have delete method', () => {
			expect(triggerNode.webhookMethods.default.delete).toBeDefined();
		});
	});

	describe('Options', () => {
		it('should have verify signature option', () => {
			const verifyProp = triggerNode.description.properties?.find(
				p => p.name === 'verifySignature'
			);
			
			expect(verifyProp).toBeDefined();
			expect(verifyProp?.type).toBe('boolean');
			expect(verifyProp?.default).toBe(true);
		});

		it('should have options collection', () => {
			const optionsProp = triggerNode.description.properties?.find(
				p => p.name === 'options'
			);
			
			expect(optionsProp).toBeDefined();
			expect(optionsProp?.type).toBe('collection');
		});
	});
});
