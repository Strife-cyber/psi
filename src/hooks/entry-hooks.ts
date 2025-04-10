import api from "./api";
import { Entry } from "..";
import { useState, useCallback } from "react";
import { 
  getAllEntries,
  getTimestamp, setEntries, setEntry,
  deleteEntry as deleteEntryDb 
} from "@/utils/index-db";

const CACHE_TTL = 5 * 60 * 1000; // Reduced from 10 to 5 minutes

// Using WeakMap for better memory management
const entryCache = new WeakMap<object, Entry>();
const timestampCache = new Map<string, number>();

const useEntryHook = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const invalidateCache = useCallback(() => {
    timestampCache.clear();
  }, []);

  const createEntry = useCallback(async (data: { 
    title: string; 
    description: string; 
    passwordId: number 
  }) => {
    setLoading(true);
    try {
      const response = await api.post("/entry", data);
      if (isSuccess(response.status)) {
        const entry = response.data as Entry;
        await setEntry(entry);
        invalidateCache();
        return entry;
      }
      console.error("Failed to create entry:", response.data);
      return null;
    } catch (error) {
      handleError("Create Entry", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [invalidateCache]);

  const getEntries = useCallback(async () => {
    setLoading(true);
    try {
      const timestamp = timestampCache.get('entries') ?? await getTimestamp('entries');
      if (timestamp && Date.now() - timestamp < CACHE_TTL) {
        const cached = await getAllEntries();
        if (cached?.length) return cached;
      }

      const response = await api.get("/entries");
      if (isSuccess(response.status)) {
        const entries = response.data as Entry[];
        await setEntries(entries);
        timestampCache.set('entries', Date.now());
        return entries;
      }
      return null;
    } catch (error) {
      handleError("Get Entries", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getEntryById = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const key = `entry_${id}`;
      const timestamp = timestampCache.get(key) ?? await getTimestamp(key);
      const cachedEntry = entryCache.get({ id });
      
      if (timestamp && Date.now() - timestamp < CACHE_TTL && cachedEntry) {
        return cachedEntry;
      }

      const response = await api.get(`/entry/${id}`);
      if (isSuccess(response.status)) {
        const entry = response.data as Entry;
        await setEntry(entry);
        entryCache.set({ id }, entry);
        timestampCache.set(key, Date.now());
        return entry;
      }
      return null;
    } catch (error) {
      handleError("Get Entry By ID", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEntry = useCallback(async (
    id: number,
    data: { title?: string; description?: string; passwordId?: number }
  ) => {
    setLoading(true);
    try {
      const response = await api.put(`/entry/${id}`, data);
      if (isSuccess(response.status)) {
        const updatedEntry = response.data as Entry;
        await setEntry(updatedEntry);
        entryCache.set({ id }, updatedEntry);
        timestampCache.set(`entry_${id}`, Date.now());
        timestampCache.set('entries', Date.now());
        return updatedEntry;
      }
      console.error("Failed to update entry:", response.data);
      return null;
    } catch (error) {
      handleError("Update Entry", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEntry = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const response = await api.delete(`/entry/${id}`);
      if (isSuccess(response.status)) {
        await deleteEntryDb(id);
        entryCache.delete({ id });
        timestampCache.set('entries', Date.now());
        return response.data;
      }
      console.error("Failed to delete entry:", response.data);
      return null;
    } catch (error) {
      handleError("Delete Entry", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const isSuccess = (status: number) => status >= 200 && status < 300;

  const handleError = useCallback((context: string, error: unknown) => {
    const message = error instanceof Error ? error.message : "Unknown error";
    setError(`${context}: ${message}`);
    console.error(`An error occurred during ${context}:`, error);
    setTimeout(() => setError(null), 2000);
  }, []);

  return {
    error,
    loading,
    createEntry,
    getEntries,
    getEntryById,
    updateEntry,
    deleteEntry,
    resetError: () => setError(null),
  };
};

export default useEntryHook;
