import { useState } from "react";

import { generateConversion, type ValidationResponse } from "../services/conversionsApi";

export function useValidationPreviewPage({
  validation,
  onGenerated,
}: {
  validation?: ValidationResponse;
  onGenerated: (conversionId: number, result: Awaited<ReturnType<typeof generateConversion>>) => void;
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!validation) return;

    setIsGenerating(true);
    setError(null);
    try {
      const response = await generateConversion({
        clientId: validation.clientId,
        period: validation.period,
        salesFile: validation.sales
          ? {
              name: validation.sales.fileName,
              path: validation.sales.filePath,
              size: validation.sales.sizeBytes,
            }
          : undefined,
        purchasesFile: validation.purchases
          ? {
              name: validation.purchases.fileName,
              path: validation.purchases.filePath,
              size: validation.purchases.sizeBytes,
            }
          : undefined,
      });
      onGenerated(response.conversionId, response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al generar la conversion");
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    error,
    generate,
  };
}
