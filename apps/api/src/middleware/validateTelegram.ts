import crypto from 'crypto';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

/**
 * Validates Telegram Mini App initData
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function validateTelegramData(initData: string, botToken: string): TelegramUser | null {
  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    
    if (!hash) return null;

    // Remove hash from data check
    urlParams.delete('hash');
    
    // Sort params alphabetically
    const params = Array.from(urlParams.entries());
    params.sort((a, b) => a[0].localeCompare(b[0]));
    
    const dataCheckString = params.map(([key, value]) => `${key}=${value}`).join('\n');
    
    // Create HMAC
    const secretKey = crypto.createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();
    
    const checkHash = crypto.createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');
    
    if (checkHash !== hash) {
      return null;
    }

    // Check auth_date is recent (within 24 hours)
    const authDate = parseInt(urlParams.get('auth_date') || '0');
    if (Date.now() / 1000 - authDate > 86400) {
      return null;
    }

    // Parse user data
    const userJson = urlParams.get('user');
    if (!userJson) return null;

    const user = JSON.parse(userJson);
    return {
      ...user,
      auth_date: authDate,
      hash
    };
  } catch (error) {
    console.error('Telegram validation error:', error);
    return null;
  }
    }
