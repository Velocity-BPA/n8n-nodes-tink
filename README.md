# n8n-nodes-tink

> [Velocity BPA Licensing Notice]
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for **Tink Open Banking Platform**, providing 21 resource categories and 140+ operations for complete open banking integration. Features account aggregation, transaction enrichment, payment initiation, identity verification, financial insights, and PSD2 compliance support.

![n8n](https://img.shields.io/badge/n8n-community%20node-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Open Banking](https://img.shields.io/badge/Open%20Banking-PSD2-orange)

## Features

- **Account Aggregation**: Connect to 3,400+ banks across Europe via a single API
- **Transaction Enrichment**: Automatic categorization, merchant identification, and payment type detection
- **Payment Initiation**: PSD2-compliant payment initiation services (PIS)
- **Identity Verification**: Verify user identity through bank data
- **Financial Insights**: Spending analysis, income verification, cash flow analytics
- **Tink Link Integration**: Hosted UI for secure bank authentication
- **Multi-Market Support**: 18 European markets with local provider support
- **Real-Time Webhooks**: Event-driven architecture for instant notifications
- **Report Generation**: Account verification, income verification, risk assessment reports

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-tink`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation
cd ~/.n8n

# Install the node
npm install n8n-nodes-tink
```

### Development Installation

```bash
# Clone or extract the package
git clone https://github.com/Velocity-BPA/n8n-nodes-tink.git
cd n8n-nodes-tink

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-tink

# Restart n8n
n8n start
```

## Credentials Setup

### Tink API Credentials

| Field | Description |
|-------|-------------|
| **Environment** | Select Production, Sandbox, or Custom endpoint |
| **Client ID** | Your Tink client ID from the Tink Console |
| **Client Secret** | Your Tink client secret |
| **Webhook Secret** | (Optional) Secret for webhook signature verification |
| **Actor Client ID** | (Optional) For acting on behalf of another client |

### Tink OAuth Credentials

| Field | Description |
|-------|-------------|
| **Client ID** | Your Tink OAuth client ID |
| **Client Secret** | Your Tink OAuth client secret |
| **Redirect URI** | OAuth callback URL (e.g., `https://your-domain.com/callback`) |
| **Scope** | OAuth scopes (e.g., `accounts:read,transactions:read`) |
| **Market** | Default market for OAuth flow |

**Getting Credentials:**
1. Sign up at [Tink Console](https://console.tink.com)
2. Create a new app in the Tink Console
3. Copy your Client ID and Client Secret
4. Configure your redirect URI for OAuth flows

## Resources & Operations

### User Resource
Manage Tink end-users who connect their bank accounts.

| Operation | Description |
|-----------|-------------|
| Create User | Create a new Tink user |
| Get User | Retrieve user details |
| Delete User | Remove a user and their data |
| List Users | List all users |
| Authorize User | Generate authorization code |
| Get User Profile | Get profile information |
| Update User Profile | Update profile details |
| Get Authorization Code | Get code for user delegation |

### Account Resource
Access aggregated bank account information.

| Operation | Description |
|-----------|-------------|
| Get Accounts | List all accounts for a user |
| Get Account | Get specific account details |
| Get Account Balances | Get balance for an account |
| Get Account by Type | Filter accounts by type |
| Get Checking Accounts | List checking accounts |
| Get Savings Accounts | List savings accounts |
| Get Credit Cards | List credit card accounts |
| Get Investment Accounts | List investment accounts |
| Get Loan Accounts | List loan accounts |

### Transaction Resource
Access and manage transaction data.

| Operation | Description |
|-----------|-------------|
| Get Transactions | List transactions |
| Get Transaction | Get transaction details |
| Search Transactions | Search with filters |
| Get by Account | Transactions for specific account |
| Get by Date | Transactions in date range |
| Get Pending | Pending transactions only |
| Get Categories | Available categories |
| Categorize Transaction | Assign category |
| Get Similar | Find similar transactions |

### Balance Resource
Real-time and historical balance information.

| Operation | Description |
|-----------|-------------|
| Get Balances | All account balances |
| Get Account Balance | Single account balance |
| Get Balance History | Historical balance data |
| Get Available Balance | Available balance only |
| Get Booked Balance | Booked balance only |

### Credentials Resource
Manage bank connection credentials.

| Operation | Description |
|-----------|-------------|
| Create Credentials | Add new bank connection |
| Get Credentials | Retrieve credential details |
| Update Credentials | Update credential settings |
| Delete Credentials | Remove bank connection |
| List Credentials | All user credentials |
| Refresh Credentials | Refresh bank data |
| Get Provider Credentials | Credentials for provider |
| Authenticate Credentials | Re-authenticate |
| Get Third Party Callback | OAuth callback data |
| Supplemental Information | Provide additional auth info |

### Provider Resource
Bank and financial institution information.

| Operation | Description |
|-----------|-------------|
| Get Providers | List available providers |
| Get Provider | Single provider details |
| Get by Market | Providers for a market |
| Get Capabilities | Provider capabilities |
| Search Providers | Search by criteria |
| Get Financial Institutions | Institution details |
| Get Provider Fields | Required auth fields |

### Identity Resource
Identity verification through bank data.

| Operation | Description |
|-----------|-------------|
| Get Identity Data | Retrieve identity info |
| Verify Identity | Verify user identity |
| Get Identity Verification | Verification status |
| Get Personal Info | Personal details |
| Get Name | Verified name |
| Get Date of Birth | Verified DOB |
| Get Address | Verified address |
| Get SSN/National ID | National ID info |

### Payment Resource
PSD2-compliant payment initiation.

| Operation | Description |
|-----------|-------------|
| Create Payment | Initiate a payment |
| Get Payment | Payment details |
| Get Payment Status | Check payment status |
| List Payments | All payments |
| Cancel Payment | Cancel pending payment |
| Sign Payment | Authorize payment |
| Get Signed Payment Status | Signed payment status |

### Transfer Resource
Internal and external money transfers.

| Operation | Description |
|-----------|-------------|
| Create Transfer | Initiate transfer |
| Get Transfer | Transfer details |
| List Transfers | All transfers |
| Get Transfer Status | Check transfer status |
| Get Transfer Accounts | Eligible accounts |
| Initiate Transfer | Start transfer flow |
| Sign Transfer | Authorize transfer |

### Beneficiary Resource
Payment beneficiary management.

| Operation | Description |
|-----------|-------------|
| Create Beneficiary | Add new beneficiary |
| Get Beneficiary | Beneficiary details |
| List Beneficiaries | All beneficiaries |
| Update Beneficiary | Update details |
| Delete Beneficiary | Remove beneficiary |
| Get Beneficiary Accounts | Linked accounts |

### Consent Resource
PSD2 consent management.

| Operation | Description |
|-----------|-------------|
| Get Consents | List all consents |
| Get Consent | Single consent details |
| Get Consent Status | Check consent status |
| Revoke Consent | Revoke user consent |
| Extend Consent | Extend consent period |
| Get Sessions | Consent sessions |

### Insights Resource
Financial analytics and insights.

| Operation | Description |
|-----------|-------------|
| Get Spending Insights | Spending analysis |
| Get Income Insights | Income analysis |
| Get Cash Flow | Cash flow analytics |
| Get Budget Analysis | Budget tracking |
| Get Saving Potential | Savings recommendations |
| Get Risk Assessment | Financial risk analysis |
| Get Account Insights | Account-level insights |

### Enrichment Resource
Transaction data enrichment.

| Operation | Description |
|-----------|-------------|
| Enrich Transactions | Enrich transaction data |
| Get Enrichment | Enrichment results |
| Get Merchant Info | Merchant details |
| Get Category Suggestions | Category recommendations |
| Get Enriched Transactions | Pre-enriched transactions |

### Connect Resource (Tink Link)
Tink Link hosted UI integration.

| Operation | Description |
|-----------|-------------|
| Create Session | Start connect session |
| Get Connect URL | Get Tink Link URL |
| Get Session Status | Check session status |
| Get Authorization Grant | Get auth grant |
| Exchange Grant | Exchange for token |

### Report Resource
Financial report generation.

| Operation | Description |
|-----------|-------------|
| Create Report | Generate new report |
| Get Report | Report details |
| Get Report Data | Download report data |
| Account Verification | Verify account ownership |
| Income Verification | Verify income sources |
| Risk Report | Risk assessment report |
| Affordability Report | Loan affordability analysis |
| Transaction Report | Transaction summary |

### Webhook Resource
Webhook subscription management.

| Operation | Description |
|-----------|-------------|
| Create Webhook | Subscribe to events |
| Get Webhook | Webhook details |
| Update Webhook | Modify subscription |
| Delete Webhook | Remove webhook |
| List Webhooks | All webhooks |
| Test Webhook | Send test event |
| Get Events | List event types |

### Access Token Resource
OAuth token management.

| Operation | Description |
|-----------|-------------|
| Get Access Token | Get new token |
| Get Client Access Token | Client credentials token |
| Get User Access Token | User-level token |
| Refresh Token | Refresh expired token |
| Revoke Token | Invalidate token |
| Get Token Info | Token introspection |

### Market Resource
Market and region information.

| Operation | Description |
|-----------|-------------|
| List Markets | Available markets |
| Get Market | Market details |
| Get Currencies | Market currencies |
| Get Providers | Providers by market |

### Category Resource
Transaction categorization.

| Operation | Description |
|-----------|-------------|
| List Categories | All categories |
| Get by Code | Category by code |
| Get Primary | Primary categories |
| Get Secondary | Secondary categories |
| Get Tree | Category hierarchy |

### Statistics Resource
Aggregated financial statistics.

| Operation | Description |
|-----------|-------------|
| Get Statistics | General statistics |
| Get Account Statistics | Account-level stats |
| Get Transaction Statistics | Transaction stats |
| Get Monthly Statistics | Monthly breakdown |
| Get Category Statistics | Category analysis |

### Utility Resource
Utility and validation functions.

| Operation | Description |
|-----------|-------------|
| Get API Status | Check API health |
| Validate IBAN | Validate IBAN format |
| Get Supported Markets | List all markets |
| Get Supported Currencies | List currencies |
| Test Connection | Test API connection |

## Trigger Node

The **Tink Trigger** node listens for real-time webhook events:

### Account Events
- Account Created
- Account Updated
- Account Deleted
- Account Refreshed

### Transaction Events
- Transactions Available
- Transaction Created
- Transaction Updated
- New Transactions

### Credentials Events
- Credentials Created
- Credentials Updated
- Credentials Deleted
- Credentials Error
- Refresh Required
- Supplemental Information Required

### Balance Events
- Balance Updated
- Low Balance Alert

### Payment Events
- Payment Initiated
- Payment Signed
- Payment Executed
- Payment Failed
- Payment Cancelled

### Transfer Events
- Transfer Initiated
- Transfer Completed
- Transfer Failed

### Consent Events
- Consent Granted
- Consent Revoked
- Consent Expired

### Report Events
- Report Ready
- Report Failed

### User Events
- User Created
- User Deleted

## Usage Examples

### Account Aggregation

```javascript
// 1. Create a user
const user = await tink.user.create({
  externalUserId: 'my-app-user-123',
  market: 'SE',
  locale: 'en_US'
});

// 2. Generate Tink Link URL for bank connection
const connectUrl = await tink.connect.getConnectUrl({
  userId: user.id,
  market: 'SE',
  locale: 'en_US',
  redirectUri: 'https://myapp.com/callback'
});

// 3. After user completes bank authentication, get accounts
const accounts = await tink.account.getAccounts({
  userId: user.id
});
```

### Transaction Enrichment

```javascript
// Get enriched transactions with merchant info and categories
const transactions = await tink.enrichment.getEnrichedTransactions({
  userId: 'user-123',
  dateFrom: '2024-01-01',
  dateTo: '2024-12-31',
  includeCategories: true,
  includeMerchant: true
});

// Each transaction includes:
// - category: { primary, secondary, code }
// - merchant: { name, logo, mcc }
// - paymentType: 'CARD' | 'TRANSFER' | 'CASH' | etc.
```

### Payment Initiation

```javascript
// Create a PSD2-compliant payment
const payment = await tink.payment.create({
  userId: 'user-123',
  credentialsId: 'cred-456',
  amount: 100.00,
  currency: 'EUR',
  recipientName: 'Acme Corp',
  recipientIban: 'DE89370400440532013000',
  reference: 'Invoice 12345'
});

// Sign the payment (requires SCA)
const signedPayment = await tink.payment.sign({
  paymentId: payment.id
});

// Check payment status
const status = await tink.payment.getStatus({
  paymentId: payment.id
});
```

### Identity Verification

```javascript
// Verify user identity through their bank
const identity = await tink.identity.verifyIdentity({
  userId: 'user-123',
  credentialsId: 'cred-456'
});

// Get verified personal information
const personalInfo = await tink.identity.getPersonalInfo({
  userId: 'user-123'
});

// Result includes:
// - name: { first, last, full }
// - dateOfBirth
// - address: { street, city, postalCode, country }
// - nationalId (where available)
```

### Financial Insights

```javascript
// Get spending insights
const spending = await tink.insights.getSpendingInsights({
  userId: 'user-123',
  dateFrom: '2024-01-01',
  dateTo: '2024-12-31',
  groupBy: 'CATEGORY'
});

// Get cash flow analysis
const cashFlow = await tink.insights.getCashFlow({
  userId: 'user-123',
  period: 'LAST_6_MONTHS',
  granularity: 'MONTHLY'
});

// Get risk assessment
const risk = await tink.insights.getRiskAssessment({
  userId: 'user-123',
  riskTypes: ['CREDIT_RISK', 'INCOME_STABILITY', 'GAMBLING']
});
```

### Income Verification Report

```javascript
// Generate income verification report
const report = await tink.report.getIncomeVerification({
  userId: 'user-123',
  format: 'JSON',
  months: 12
});

// Report includes:
// - regularIncome: { amount, frequency, source }
// - incomeStreams: [{ type, amount, confidence }]
// - verificationDate
// - accountsAnalyzed
```

### Webhook Integration

```javascript
// Set up webhook for transaction notifications
const webhook = await tink.webhook.create({
  url: 'https://myapp.com/webhooks/tink',
  events: ['transactions:available', 'transaction:created'],
  secret: 'my-webhook-secret'
});

// In your Tink Trigger node, verify and process events:
// - Verify HMAC-SHA256 signature
// - Process transaction data
// - Update your application
```

## Tink Concepts

| Term | Description |
|------|-------------|
| **User** | End-user in Tink system, represents a person connecting their bank |
| **Credentials** | Bank connection, stores authentication data for a specific provider |
| **Provider** | Bank or financial institution available for connection |
| **Market** | Country or region (e.g., SE, DE, UK) |
| **Tink Link** | Hosted UI for secure bank authentication |
| **Connect Session** | Authorization flow for Tink Link |
| **Consent** | User permission for data access (PSD2 requirement) |
| **Enrichment** | Transaction enhancement with categories, merchants |
| **Insights** | Financial analytics derived from transaction data |
| **Actor** | Third-party acting on behalf of another client |
| **ASPSP** | Account Servicing Payment Service Provider (the bank) |
| **TPP** | Third Party Provider (you, using Tink) |
| **PSD2** | Payment Services Directive 2 (EU regulation) |
| **AIS** | Account Information Service |
| **PIS** | Payment Initiation Service |
| **SCA** | Strong Customer Authentication |

## Supported Markets

| Market | Country | Currency | PSD2 |
|--------|---------|----------|------|
| SE | Sweden | SEK | ✅ |
| FI | Finland | EUR | ✅ |
| NO | Norway | NOK | ✅ |
| DK | Denmark | DKK | ✅ |
| DE | Germany | EUR | ✅ |
| GB | United Kingdom | GBP | ✅ |
| NL | Netherlands | EUR | ✅ |
| BE | Belgium | EUR | ✅ |
| FR | France | EUR | ✅ |
| ES | Spain | EUR | ✅ |
| IT | Italy | EUR | ✅ |
| PT | Portugal | EUR | ✅ |
| AT | Austria | EUR | ✅ |
| IE | Ireland | EUR | ✅ |
| PL | Poland | PLN | ✅ |
| EE | Estonia | EUR | ✅ |
| LT | Lithuania | EUR | ✅ |
| LV | Latvia | EUR | ✅ |

## Error Handling

The node provides detailed error messages for common scenarios:

| Error Code | Description | Resolution |
|------------|-------------|------------|
| `INVALID_CREDENTIALS` | API credentials invalid | Check Client ID/Secret |
| `USER_NOT_FOUND` | User doesn't exist | Verify User ID |
| `CREDENTIALS_ERROR` | Bank connection failed | Re-authenticate credentials |
| `CONSENT_EXPIRED` | PSD2 consent expired | Extend or create new consent |
| `RATE_LIMITED` | Too many requests | Implement backoff strategy |
| `PROVIDER_ERROR` | Bank API error | Retry or contact support |
| `PAYMENT_REJECTED` | Payment declined | Check account balance/limits |
| `SCA_REQUIRED` | Strong authentication needed | Complete SCA flow |

## Security Best Practices

1. **Secure Credentials**: Never expose Client Secret in client-side code
2. **Webhook Verification**: Always verify webhook signatures
3. **Token Management**: Implement proper token refresh logic
4. **GDPR Compliance**: Handle PII according to regulations
5. **Consent Management**: Track and respect user consents
6. **Audit Logging**: Log all data access for compliance
7. **HTTPS Only**: Always use secure connections
8. **Rate Limiting**: Implement request throttling
9. **Error Handling**: Never expose internal errors to users
10. **Data Minimization**: Only request necessary scopes

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch mode
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix lint issues
npm run lint:fix
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Documentation**: [Tink Docs](https://docs.tink.com)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-tink/issues)
- **Community**: [n8n Community Forum](https://community.n8n.io)
- **Commercial Support**: [licensing@velobpa.com](mailto:licensing@velobpa.com)

## Acknowledgments

- [Tink](https://tink.com) for their comprehensive Open Banking platform
- [n8n](https://n8n.io) for the workflow automation platform
- The open banking community for advancing financial data access
