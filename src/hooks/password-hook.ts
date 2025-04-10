import api from "./api";
import { Password } from "..";
import { useState } from "react";

const usePasswordHook = () => {
    const [ error, setError ] = useState<string | null>(null);
    const [ loading, setLoading ] = useState<boolean>(false);

    const register = async (password: string) => {
        setLoading(true);

        try {
            const response = await api.post('/password', { password });

            if (isSuccess(response.status)) {
                return response.data;
            }

            console.error("Server error during registration:", response.data);
            return false;
        } catch (error) {
            handleError("Password Registration", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const evaluate = async ( password: string) => {
        setLoading(true);

        try {
            const response = await api.post('/password/evaluate', { password });

            if (isSuccess(response.status)) {
                return response.data;
            }

            console.error("Evaluation failed with server error:", response.data);
            return false;

        } catch (error) {
            handleError("Evaluation", error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const generate = async (length: number) => {
        setLoading(true);

        try {
            const response = await api.get('/password/generate', {
                params: {
                    length
                }
            });
            if (isSuccess(response.status)) {
                return response.data?.password;
            }
            return null;
        } catch (error) {
            handleError("fetching profile", error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getAllPasswords = async () => {
        setLoading(true);

        try {
            const response = await api.get('/passwords');
            if (isSuccess(response.status)) {
                return response.data as Password[];
            }
            return null;
        } catch (error) {
            handleError("fetching profile", error);
            return null;
        } finally {
            setLoading(false);
        }
    }

    const isSuccess = (status: number) => status >= 200 && status < 300;

    const handleError = (context: string, error: unknown) => {
        const message = error instanceof Error ? error.message : "Unknown error";
        setError(`${context}: ${message}`);
        console.error(`An error occurred during ${context}:`, error);
        setTimeout(() => {
            resetError();
        }, 2000);
    };

    const resetError = () => setError(null);

    return {
        error,
        loading,
        register,
        evaluate,
        generate,
        resetError,
        getAllPasswords
    };
};

export default usePasswordHook;
