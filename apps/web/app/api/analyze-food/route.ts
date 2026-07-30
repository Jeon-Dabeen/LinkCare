import { NextRequest, NextResponse } from "next/server";
import { analyzeFoodByGemini } from "@/app/meal/_api/apiGenAI";

export async function POST(req: NextRequest) {
  try {
    const {
      imageBase64,
      mimeType = "image/jpeg",
    } = await req.json();

    if (!imageBase64) {
      return NextResponse.json(
        { success: false, message: "이미지가 없어요" },
        { status: 400 }
      );
    }

    const foods = await analyzeFoodByGemini(
      imageBase64,
      mimeType
    );

    return NextResponse.json(foods);
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      {
        message: "분석 실패",
      },
      {
        status: 500,
      }
    );
  }
}