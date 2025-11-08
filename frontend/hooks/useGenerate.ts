/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from "react";
import { generationsApi, Generation, ApiError } from "@/lib/api";

const MAX_RETRIES = 3;

export function useGenerate(onSuccess?: (generation: Generation) => void) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const generate = async (image: File, prompt: string, style: string) => {
    setIsGenerating(true);
    setError(null);
    setRetryCount(0);

    const attemptGeneration = async (attempt: number): Promise<Generation | null> => {
      try {
        abortControllerRef.current = new AbortController();
        const generation = await generationsApi.createGeneration(
          image,
          prompt,
          style,
          abortControllerRef.current.signal
        );
        return generation;
      } catch (err: any) {
        if (err.name === "AbortError") {
          throw new Error("Generation cancelled");
        }

        const apiError = err as ApiError;

        // Handle model overload with retry
        if (apiError.error === "MODEL_OVERLOADED" && attempt < MAX_RETRIES) {
          setRetryCount(attempt);
          // Exponential backoff: 1s, 2s, 4s
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          return attemptGeneration(attempt + 1);
        }

        throw err;
      }
    };

    try {
      const generation = await attemptGeneration(1);
      if (generation) {
        setIsGenerating(false);
        setRetryCount(0);
        onSuccess?.(generation);
        return generation;
      }
    } catch (err: any) {
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to generate image");
      setIsGenerating(false);
      throw err;
    }
  };

  const abort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
      setError("Generation cancelled");
      setRetryCount(0);
    }
  };

  return {
    generate,
    abort,
    isGenerating,
    error,
    retryCount,
    maxRetries: MAX_RETRIES,
  };
}
