import * as crypto from 'crypto';

export class Device {
  public static id(): string {
    return crypto.createHash('sha256').update(navigator.userAgent).digest('hex');
  }
}
