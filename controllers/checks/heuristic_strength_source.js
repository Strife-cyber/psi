export class HeuristicStrengthSource {
    static evaluate(password) {
        let score = 0.0;
        const length = password.length;

        // === LENGTH ===
        if (length >= 20) {
        score += 0.25;
        } else if (length >= 16) {
        score += 0.2;
        } else if (length >= 12) {
        score += 0.15;
        } else if (length >= 8) {
        score += 0.1;
        } else {
        score -= 0.2;
        }

        // === CHARACTER DIVERSITY ===
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasDigit = /[0-9]/.test(password);
        const hasSymbol = /[!@#\$%^&*(),.?":{}|<>]/.test(password);

        const varietyCount = [hasUpper, hasLower, hasDigit, hasSymbol].filter(v => v).length;
        score += varietyCount * 0.1;

        // === PENALIZE FOR SIMPLE PATTERNS ===
        if (/(.)\1{2,}/.test(password)) {
        score -= 0.2;
        }

        if (/(1234|abcd|qwer|pass|asdf)/i.test(password)) {
        score -= 0.3;
        }

        // === BONUS FOR MIXED CASE AND SPECIALS ===
        if (hasUpper && hasLower && hasSymbol && hasDigit) {
        score += 0.1;
        }

        // Clamp final score between 0.0 and 1.0
        return Math.min(1.0, Math.max(0.0, score));
    }

    _looksRandom(password) {
        const uniqueChars = new Set(password.split('')).size;
        return (uniqueChars / password.length) > 0.75;
    }
}
