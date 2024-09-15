import crypto from 'crypto';

/**
 * Generates a random hexadecimal key.
 *
 * @return {string} A randomly generated 20-byte hexadecimal string.
 */
export function generateKey() {
  return crypto.randomBytes(20).toString('hex');
}
