/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { generationsApi, Generation } from "@/lib/api";

export function useGenerations() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGenerations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generationsApi.getGenerations(5);
      setGenerations(data.generations);
    } catch (err: any) {
      setError(err.message || "Failed to fetch generations");
      console.error("Failed to fetch generations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGenerations();
  }, []);

  return { generations, isLoading, error, refetch: fetchGenerations };
}
