import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

interface EncryptedData {
  encrypted: string;
  iv: string;
  tag: string;
}

export class DataEncryption {
  /**
   * Encrypt sensitive data like rates, earnings, phone numbers
   */
  static encrypt(text: string): EncryptedData {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
    cipher.setAAD(Buffer.from('invoicepatch-sensitive-data'));
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    };
  }

  /**
   * Decrypt sensitive data
   */
  static decrypt(encryptedData: EncryptedData): string {
    const { encrypted, iv, tag } = encryptedData;
    
    const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
    decipher.setAAD(Buffer.from('invoicepatch-sensitive-data'));
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  /**
   * Hash sensitive data for comparison (one-way)
   */
  static hash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Encrypt financial data specifically
   */
  static encryptFinancialData(data: {
    dayRate?: number;
    hourlyRate?: number;
    totalEarned?: number;
    truckRate?: number;
    subsistence?: number;
  }): Record<string, EncryptedData> {
    const encrypted: Record<string, EncryptedData> = {};
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        encrypted[key] = this.encrypt(value.toString());
      }
    });
    
    return encrypted;
  }

  /**
   * Decrypt financial data
   */
  static decryptFinancialData(encryptedData: Record<string, EncryptedData>): Record<string, number> {
    const decrypted: Record<string, number> = {};
    
    Object.entries(encryptedData).forEach(([key, value]) => {
      decrypted[key] = parseFloat(this.decrypt(value));
    });
    
    return decrypted;
  }

  /**
   * Mask sensitive data for logging
   */
  static maskSensitiveData(data: string, visibleChars: number = 4): string {
    if (data.length <= visibleChars) {
      return '*'.repeat(data.length);
    }
    
    const masked = '*'.repeat(data.length - visibleChars);
    return masked + data.slice(-visibleChars);
  }

  /**
   * Generate secure session token
   */
  static generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}

/**
 * PII (Personally Identifiable Information) Protection
 */
export class PIIProtection {
  private static readonly PII_PATTERNS = [
    // Phone numbers
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    // Email addresses
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    // Social Insurance Numbers (Canadian)
    /\b\d{3}[-\s]?\d{3}[-\s]?\d{3}\b/g,
    // Credit card numbers
    /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g
  ];

  /**
   * Scrub PII from logs and error messages
   */
  static scrubPII(text: string): string {
    let scrubbed = text;
    
    this.PII_PATTERNS.forEach(pattern => {
      scrubbed = scrubbed.replace(pattern, '[REDACTED]');
    });
    
    return scrubbed;
  }

  /**
   * Validate if data contains PII
   */
  static containsPII(text: string): boolean {
    return this.PII_PATTERNS.some(pattern => pattern.test(text));
  }
}

export default DataEncryption; 