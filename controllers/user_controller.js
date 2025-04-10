import bcrypt from 'bcrypt';
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import models from '../models/index.js';

dotenv.config();

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name, !email, !password) {
            return res.status(400).json({
                "error": "All fields are required."
            })
        }

        const existingUser = await models.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use.' });
        }

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
        const user = await models.User.create({ name, email, password: hashedPassword });
        
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({
            error: "User could not be created",
            stack: error
        });
    }
}

export const getAllUsers = async (_, res) => {
    try {
        const users = await models.User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ 
            error: 'Internal server error.',
            stack: error 
        });
    }
};

export const getUserById = async (req, res) => {
    const { userId } = req.user;

    try {
        const id = userId;
        const user = await models.User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ 
            message: 'Internal server error.',
            stack: error 
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Check if user exists
        const user = await models.User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET, // Use the secret from .env
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' } // Use expiry from .env
        );

        res.status(200).json({ message: 'Login successful.', token });
    } catch (error) {
        console.error(`[LOGIN ERROR]: ${error.message}`, error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

export const logout = async (req, res) => {
    try {
        // No backend session to clear, just inform the client to discard the token
        res.status(200).json({ message: 'Logout successful.' });
    } catch (error) {
        console.error(`[LOGOUT ERROR]: ${error.message}`, error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
