
import { fileToBase64 } from "@/utils/fileToBase64";

export interface AnalyzeFoodResult {
  name: string;
  kcal: string;
}

export async function analyzeFood(
    file: File
): Promise<AnalyzeFoodResult[]> {
    const base64 = await fileToBase64(file);

    const res = await fetch("/api/analyze-food", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
            imageBase64: base64,
            mimeType: file.type,
        }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message ?? "분석에 실패했습니다.");
    }

    return res.json();
}