/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IDataObject } from 'n8n-workflow';

/**
 * Token Utilities for Tink
 *
 * Helper functions for managing OAuth tokens, including
 * parsing, validation, and expiration handling.
 */

export interface TokenInfo {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: Date;
  scope: string;
  refreshToken?: string;
}

export interface DecodedJwt {
  header: IDataObject;
  payload: IDataObject;
  signature: string;
}

/**
 * Parse a token response from Tink OAuth endpoint
 */
export function parseTokenResponse(response: IDataObject): TokenInfo {
  const expiresIn = (response.expires_in as number) || 3600;

  return {
    accessToken: response.access_token as string,
    tokenType: response.token_type as string || 'Bearer',
    expiresIn,
    expiresAt: new Date(Date.now() + expiresIn * 1000),
    scope: response.scope as string || '',
    refreshToken: response.refresh_token as string | undefined,
  };
}

/**
 * Check if a token is expired or about to expire
 * @param expiresAt Token expiration date
 * @param bufferSeconds Seconds before expiration to consider token expired (default: 60)
 */
export function isTokenExpired(expiresAt: Date, bufferSeconds: number = 60): boolean {
  const bufferMs = bufferSeconds * 1000;
  return Date.now() + bufferMs >= expiresAt.getTime();
}

/**
 * Decode a JWT token without verification
 * NOTE: This does not verify the token signature, only decodes it
 */
export function decodeJwt(token: string): DecodedJwt | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const header = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    const signature = parts[2];

    return { header, payload, signature };
  } catch {
    return null;
  }
}

/**
 * Extract expiration time from a JWT token
 */
export function getTokenExpiration(token: string): Date | null {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.payload.exp) {
    return null;
  }

  return new Date((decoded.payload.exp as number) * 1000);
}

/**
 * Extract scopes from a JWT token
 */
export function getTokenScopes(token: string): string[] {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.payload.scope) {
    return [];
  }

  const scopeStr = decoded.payload.scope as string;
  return scopeStr.split(' ').filter(Boolean);
}

/**
 * Check if a token has the required scope
 */
export function hasScope(token: string, requiredScope: string): boolean {
  const scopes = getTokenScopes(token);
  return scopes.includes(requiredScope);
}

/**
 * Check if a token has all required scopes
 */
export function hasAllScopes(token: string, requiredScopes: string[]): boolean {
  const scopes = getTokenScopes(token);
  return requiredScopes.every((scope) => scopes.includes(scope));
}

/**
 * Get user ID from a user token
 */
export function getUserIdFromToken(token: string): string | null {
  const decoded = decodeJwt(token);
  if (!decoded) {
    return null;
  }

  return (decoded.payload.sub as string) ||
    (decoded.payload.user_id as string) ||
    (decoded.payload.external_user_id as string) ||
    null;
}

/**
 * Get client ID from a token
 */
export function getClientIdFromToken(token: string): string | null {
  const decoded = decodeJwt(token);
  if (!decoded) {
    return null;
  }

  return (decoded.payload.client_id as string) ||
    (decoded.payload.aud as string) ||
    null;
}

/**
 * Format scope string from array
 */
export function formatScopes(scopes: string[]): string {
  return scopes.join(',');
}

/**
 * Parse scope string to array
 */
export function parseScopes(scopeString: string): string[] {
  if (!scopeString) {
    return [];
  }

  // Handle both comma-separated and space-separated scopes
  return scopeString.split(/[,\s]+/).filter(Boolean);
}

/**
 * Merge multiple scope arrays, removing duplicates
 */
export function mergeScopes(...scopeArrays: string[][]): string[] {
  const allScopes = scopeArrays.flat();
  return [...new Set(allScopes)];
}

/**
 * Calculate remaining time until token expiration in seconds
 */
export function getTimeUntilExpiration(expiresAt: Date): number {
  const remaining = expiresAt.getTime() - Date.now();
  return Math.max(0, Math.floor(remaining / 1000));
}

/**
 * Create a token info object from raw token and expiration
 */
export function createTokenInfo(
  accessToken: string,
  expiresInSeconds: number,
  scope: string,
  refreshToken?: string,
): TokenInfo {
  return {
    accessToken,
    tokenType: 'Bearer',
    expiresIn: expiresInSeconds,
    expiresAt: new Date(Date.now() + expiresInSeconds * 1000),
    scope,
    refreshToken,
  };
}
