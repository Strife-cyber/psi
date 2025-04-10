import { randomUUID } from 'crypto';

export class GenerateStrongPassword {
  static _upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  static _lowerCase = 'abcdefghijklmnopqrstuvwxyz';
  static _digits = '0123456789';
  static _symbols = '!@#$%^&*()-_=+[]{};:,.<>?';
  static _allChars = GenerateStrongPassword._upperCase +
                     GenerateStrongPassword._lowerCase +
                     GenerateStrongPassword._digits +
                     GenerateStrongPassword._symbols;

  static generate(length = 20) {
    const rand = crypto.getRandomValues(new Uint8Array(length * 2));
    const uuid = randomUUID().replace(/-/g, ''); // UUID without dashes

    const buffer = [];

    // Ensure at least one of each category
    buffer.push(this._upperCase[Math.floor(Math.random() * this._upperCase.length)]);
    buffer.push(this._lowerCase[Math.floor(Math.random() * this._lowerCase.length)]);
    buffer.push(this._digits[Math.floor(Math.random() * this._digits.length)]);
    buffer.push(this._symbols[Math.floor(Math.random() * this._symbols.length)]);

    // Fill the rest
    while (buffer.length < length) {
      const nextChar = this._allChars[Math.floor(Math.random() * this._allChars.length)];

      if (
        buffer.length >= 2 &&
        buffer[buffer.length - 1] === nextChar &&
        buffer[buffer.length - 2] === nextChar
      ) {
        continue; // avoid 3 repeated chars
      }

      buffer.push(nextChar);
    }

    // UUID-based transposition
    const uuidOffsets = uuid.split('').map(c => parseInt(c, 16) || 0);
    const chars = [...buffer];
    const transposed = new Array(chars.length).fill('');

    for (let i = 0; i < chars.length; i++) {
      const newPos = (i + uuidOffsets[i % uuidOffsets.length]) % chars.length;
      if (!transposed[newPos]) {
        transposed[newPos] = chars[i];
      }
    }

    // Fill empty positions
    for (let i = 0; i < transposed.length; i++) {
      if (transposed[i] === '') {
        transposed[i] = chars.shift();
      }
    }

    // Final shuffle
    for (let i = transposed.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [transposed[i], transposed[j]] = [transposed[j], transposed[i]];
    }

    return transposed.join('');
  }
}
