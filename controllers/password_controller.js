import models from "../models/index.js";
import { GenerateStrongPassword } from "./functions/generate_strong_password.js";
import { CheckPasswordRarity } from "./functions/check_password_rarity.js";
import { EvaluatePasswordStrength } from "./functions/evaluate_password_strength.js";

export const evaluatePassword = async (req, res) => {
    const { password } = req.body;

    try {
        const rarity = await CheckPasswordRarity.call(password);
        const strength = await EvaluatePasswordStrength.call(password);
        const passwords = await models.Password.findOne({ where: { value: password } })

        res.status(201).json({
            "rarity": rarity,
            "password": password,
            "strength": strength,
            "isUnique": !passwords
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            "error": "An error occured during password evaluation",
            "stack": error
        });
    }
};

export const generatePassword = async (req, res) => {
    const { length } = req.query;

    try {
        const password = GenerateStrongPassword.generate(length);

        res.status(200).json({
            "password": password
        });
    } catch (error) {
        res.status(500).json({
            "error": "An error occured during password generation",
            "stack": error
        });
    }
}

export const registerPassword = async (req, res) => {
    const { userId } = req.user;
    const { password } = req.body;

    try {
        if (!password) {
            return res.status(400).json({ message: 'Empty request please fill in password field' });
        }

        const rarity = await CheckPasswordRarity.call(password);
        const strength = await EvaluatePasswordStrength.call(password);
        const passwords = await models.Password.findOne({ where: { value: password } })

        const pass = await models.Password.create({
            value: password,
            isUnique: !passwords,
            rarityScore: rarity,
            strengthScore: strength,
            user: userId
        });

        return res.status(201).json({
            "message": "Password successfully registered",
            "password": pass
        });
    } catch (error) {
        return res.status(500).json({
            "error": "Could not register password",
            "stack": error
        });
    }
}

export const getUserPasswords = async (req, res) => {
    const { userId } = req.user;

    try {
        const passwords = await models.Password.findAll({
            where: { user: userId }
        });
        res.status(200).json(passwords);
    } catch (error) {
        res.status(500).json({
            "error": "Could not get user passwords.",
            "stack": error
        });
    }
}
