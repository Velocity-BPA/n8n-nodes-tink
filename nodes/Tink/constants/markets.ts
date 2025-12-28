/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Tink Markets
 *
 * Tink supports open banking connections across multiple European markets.
 * Each market has different regulations, providers, and capabilities.
 *
 * PSD2 markets are subject to EU Payment Services Directive 2 regulations,
 * requiring strong customer authentication (SCA) and consent management.
 */

export interface TinkMarket {
  code: string;
  name: string;
  currency: string;
  locale: string;
  psd2: boolean;
  paymentInitiation: boolean;
  accountInformation: boolean;
}

export const TINK_MARKETS: Record<string, TinkMarket> = {
  AT: {
    code: 'AT',
    name: 'Austria',
    currency: 'EUR',
    locale: 'de_AT',
    psd2: true,
    paymentInitiation: true,
    accountInformation: true,
  },
  BE: {
    code: 'BE',
    name: 'Belgium',
    currency: 'EUR',
    locale: 'nl_BE',
    psd2: true,
    paymentInitiation: true,
    accountInformation: true,
  },
  DK: {
    code: 'DK',
    name: 'Denmark',
    currency: 'DKK',
    locale: 'da_DK',
    psd2: true,
    paymentInitiation: true,
    accountInformation: true,
  },
  EE: {
    code: 'EE',
    name: 'Estonia',
    currency: 'EUR',
    locale: 'et_EE',
    psd2: true,
    paymentInitiation: true,
    accountInformation: true,
  },
  FI: {
    code: 'FI',
    name: 'Finland',
    currency: 'EUR',
    locale: 'fi_FI',
    psd2: true,
    paymentInitiation: true,
    accountInformation: true,
  },
  FR: {
    code: 'FR',
    name: 'France',
    currency: 'EUR',
    locale: 'fr_FR',
    psd2: true,
    paymentInitiation: true,
    accountInformation: true,
  },
  DE: {
    code: 'DE',
    name: 'Germany',
    currency: 'EUR',
    locale: 'de_DE',
    psd2: true,
    paymentInitiation: true,
    accountInformation: true,
  },
  IE: {
    code: 'IE',
    name: 'Ireland',
    currency: 'EUR',
    locale: 'en_IE',
    psd2: true,
    paymentInitiation: true,
    accountInformation: true,
  },
  IT: {
    code: 'IT',
    name: 'Italy',
    currency: 'EUR',
    locale: 'it_IT',
    psd2: true,
    paymentInitiation: true,
    accountInformation: true,
  },
  LV: {
    code: 'LV',
    name: 'Latvia',
    currency: 'EUR',
    locale: 'lv_LV',
    psd2: true,
    paymentInitiation: true,
    accountInformation: true,
  },
  LT: {
    code: 'LT',
    name: 'Lithuania',
    currency: 'EUR',
    locale: 'lt_LT',
    psd2: true,
    paymentInitiation: true,
    accountInformation: true,
  },
  NL: {
    code: 'NL',
    name: 'Netherlands',
    currency: 'EUR',
    locale: 'nl_NL',
    psd2: true,
    paymentInitiation: true,
    accountInformation: true,
  },
  NO: {
    code: 'NO',
    name: 'Norway',
    currency: 'NOK',
    locale: 'nb_NO',
    psd2: false,
    paymentInitiation: true,
    accountInformation: true,
  },
  PL: {
    code: 'PL',
    name: 'Poland',
    currency: 'PLN',
    locale: 'pl_PL',
    psd2: true,
    paymentInitiation: true,
    accountInformation: true,
  },
  PT: {
    code: 'PT',
    name: 'Portugal',
    currency: 'EUR',
    locale: 'pt_PT',
    psd2: true,
    paymentInitiation: true,
    accountInformation: true,
  },
  ES: {
    code: 'ES',
    name: 'Spain',
    currency: 'EUR',
    locale: 'es_ES',
    psd2: true,
    paymentInitiation: true,
    accountInformation: true,
  },
  SE: {
    code: 'SE',
    name: 'Sweden',
    currency: 'SEK',
    locale: 'sv_SE',
    psd2: true,
    paymentInitiation: true,
    accountInformation: true,
  },
  GB: {
    code: 'GB',
    name: 'United Kingdom',
    currency: 'GBP',
    locale: 'en_GB',
    psd2: true,
    paymentInitiation: true,
    accountInformation: true,
  },
};

export const MARKET_OPTIONS = Object.entries(TINK_MARKETS).map(([code, market]) => ({
  name: `${market.name} (${code})`,
  value: code,
  description: `Currency: ${market.currency}, PSD2: ${market.psd2 ? 'Yes' : 'No'}`,
}));

export const CURRENCY_BY_MARKET: Record<string, string> = Object.entries(TINK_MARKETS).reduce(
  (acc, [code, market]) => {
    acc[code] = market.currency;
    return acc;
  },
  {} as Record<string, string>,
);
