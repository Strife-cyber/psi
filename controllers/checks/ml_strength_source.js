import zxcvbn from 'zxcvbn';

export class MlStrengthSource {
  static async evaluate(password) {
    const result = zxcvbn(password);
    const score = result.score; // score is between 0 and 4

    return Math.min(1.0, Math.max(0.0, score / 4));
  }
}

