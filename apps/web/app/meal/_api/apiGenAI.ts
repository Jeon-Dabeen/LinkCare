import { GoogleGenAI, Type } from '@google/genai';

// 초기화 (환경 변수에서 자동으로 GEMINI_API_KEY를 읽어옵니다)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const promptText = `[역할]\n당신은 사진 속 음식을 분석하여 영양 정보를 제공하는 AI 영양사입니다.\n\n[작업]\n제공된 이미지에서 식별 가능한 모든 음식의 이름과 대략적인 칼로리를 분석하여 지정된 JSON 스키마 형태로 반환하세요.\n\n[규칙 및 제약 조건]\n1. 한 사진에 여러 음식이 있다면 각각 분리하여 배열에 담으세요. (예: 밥과 닭갈비가 같이 있다면 각각 추출)\n2. 칼로리(kcal)는 일반적인 1인분(또는 사진에서 보이는 대략적인 양)을 기준으로 숫자가 포함된 문자열로 작성하세요. (예: '350 kcal', '120~150 kcal')\n3. 한국인들이 흔히 먹는 한식의 경우, 한국 식품의약품안전처 공공 데이터 기준에 가까운 보편적인 값을 제시하세요.\n4. 만약 사진에 음식이 전혀 없거나, 무엇인지 도저히 식별할 수 없는 물체라면 데이터를 생성하지 말고 반드시 빈 배열([])만 반환해야 합니다. 절대로 상상해서 음식을 지어내지 마세요.\n5. 하나의 요리에 포함된 세부 재료(예: 찌개 안의 고기, 두부, 채소 등)를 각각 낱개로 분리하지 말고, 완성된 **하나의 요리/메뉴 단위**로 묶어서 추출하세요. 전체 목록은 **최대 5개**까지만 허용됩니다.\n6.음식의 이름은 한글로 작성하세요.`

export async function analyzeFoodByGemini(
  imageBase64: string,
  mimeType = "image/jpeg"
) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          { text: promptText },
          {
            inlineData: {
              mimeType,
              data: imageBase64,
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
            },
            kcal: {
              type: Type.STRING,
            },
          },
          required: ["name", "kcal"],
        },
      },
    },
  });

  return JSON.parse(response.text || "[]");
}
