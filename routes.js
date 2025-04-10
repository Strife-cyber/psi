import express from "express";
import jwt from "jsonwebtoken";

import * as userController from "./controllers/user_controller.js";
import * as entryController from "./controllers/entry_controller.js";
import * as passwordController from "./controllers/password_controller.js";

const routes = express.Router();

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Token is required for authentication.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(`[JWT ERROR]: ${error.message}`);
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
}

routes.post('/login', userController.login);
routes.post('/register', userController.register);
routes.post('/logout', authenticateJWT, userController.logout);

routes.get('/user', authenticateJWT, userController.getUserById);

routes.post('/password', authenticateJWT, passwordController.registerPassword);
routes.get('/passwords', authenticateJWT, passwordController.getUserPasswords);
routes.get('/password/generate', authenticateJWT, passwordController.generatePassword);
routes.post('/password/evaluate', authenticateJWT, passwordController.evaluatePassword);

routes.post('/entry', authenticateJWT, entryController.createEntry);
routes.get('/entries', authenticateJWT, entryController.getUserEntries);
routes.get('/entry/:id', authenticateJWT, entryController.getEntryById);
routes.put('/entry/:id', authenticateJWT, entryController.updateEntry);
routes.delete('/entry/:id', authenticateJWT, entryController.deleteEntry);

export default routes;
