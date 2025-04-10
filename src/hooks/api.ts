import axios from "axios"
import Cookies from "js-cookie"
import { enc } from "crypto-js"
import { encrypt, decrypt } from "crypto-js/aes"

const ENCRYPTION_KEY = import.meta.env.VITE_APP_ENCRYPTION_KEY || '';

export const registerToken = (token: string) => {
    try {
        const encrypted = encrypt(token, ENCRYPTION_KEY).toString();
        Cookies.set('token', encrypted, {
            expires: 1,
            secure: true,
            sameSite: 'strict'
        });
    } catch (error) {
        console.log("Error while registering cookie: ", error);
    }
}

export const getToken = (): string | undefined => {
    try {
        const encrypted = Cookies.get('token');
        if (encrypted) {
            try {
                const decrypted = decrypt(encrypted, ENCRYPTION_KEY).toString(enc.Utf8);
                return decrypted;
            } catch (error) {
                console.log('Failed to decrypt cookie: ', error);           
            }
        }
    } catch (error) {
        console.log("Error during cookie collection", error);
    }
    return undefined;
}

export const clearToken = () => {
    try {
        Cookies.remove('token', { secure: true, sameSite: 'Strict' });
    } catch (error) {
        console.log("Error while clearing cookie: ", error);
    }
}

// Create the Axios instance
const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    },
});

// Attach interceptor to automatically include Bearer token if available
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
