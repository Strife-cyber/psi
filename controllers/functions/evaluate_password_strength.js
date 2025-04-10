import { MlStrengthSource } from "../checks/ml_strength_source.js";
import { HeuristicStrengthSource } from "../checks/heuristic_strength_source.js";

export class EvaluatePasswordStrength {
    static async call(password) {
        let heuristicScore = HeuristicStrengthSource.evaluate(password);
        let mlScore = await MlStrengthSource.evaluate(password);
        return (heuristicScore + mlScore) / 2;
    }
}