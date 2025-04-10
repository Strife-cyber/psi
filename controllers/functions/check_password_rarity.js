import { RarityScore } from "../checks/rarity_source.js";

export class CheckPasswordRarity {
    static async call(password) {
        return await RarityScore.checkRarity(password);
    }
}
