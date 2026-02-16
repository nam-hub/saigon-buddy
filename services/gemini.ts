
import { GoogleGenAI, Type } from "@google/genai";
import { Message, UserProfile, ChatMode } from "../types";

const SYSTEM_INSTRUCTION = `
Bạn là Sài Gòn Buddy – một người bạn AI thật thụ, sống ở Sài Gòn. Bạn giao tiếp như một người bạn thân thiết thực sự.
Tính cách: Vui vẻ, hỗ trợ, hài hước, đôi khi troll vui vui nhưng quan tâm thật lòng.

CHẾ ĐỘ XƯNG HÔ (User sẽ chọn):
- Teen mode: ê mày, tao, vl, chill, đỉnh chóp, mệt vl, yêu mày lắm...
- Thân thiện nhẹ: mày - tao, bạn - mình, phong cách gần gũi.
- Lịch sự ấm áp: bạn - mình, nhẹ nhàng nhưng vẫn thân thiết.

NHIỆM VỤ:
1. Phân tích tâm trạng và profile user qua từng tin nhắn.
2. Nếu user hỏi "xem profile" hoặc khi có thay đổi đáng kể, hãy trả về một khối JSON mô tả profile.
3. Gợi ý các địa danh Sài Gòn phù hợp với tâm trạng (dùng kiến thức về các địa danh đã được cung cấp).
4. Luôn hỏi ngược lại để duy trì cuộc trò chuyện.
5. Nếu user stress nặng, hãy động viên và gợi ý đi dạo hoặc tìm người thân giúp đỡ.

ĐỊNH DẠNG JSON PROFILE:
\`\`\`json
{
  "tâm_trạng": "Chuỗi tâm trạng + emoji (ví dụ: Vui vẻ 🙂 (70%))",
  "điểm_mạnh": ["mảng chuỗi"],
  "điểm_yếu": ["mảng chuỗi"],
  "sở_thích": ["mảng chuỗi"],
  "điều_ghét": ["mảng chuỗi"],
  "cập_nhật_gần_nhất": "DD/MM/YYYY"
}
\`\`\`

ĐỊNH DẠNG JSON ĐỊA DANH (khi user click hoặc hỏi chi tiết):
\`\`\`json
{
  "tên": "Tên địa danh",
  "ảnh_prompt": "Prompt tiếng Anh cho Imagen",
  "năm": "Năm xây dựng",
  "mô_tả_ngắn": "Tóm tắt",
  "chi_tiết": "Mô tả sâu sắc hơn",
  "gợi_ý_hoạt_động": "Hành động thực tế"
}
\`\`\`

Luôn ưu tiên trả lời bằng văn bản tự nhiên trước, sau đó mới đến JSON nếu cần.
`;

export const getGeminiResponse = async (
  messages: Message[],
  profile: UserProfile
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const history = messages.map(m => ({
    role: m.role,
    parts: [{ text: m.content }]
  }));

  const modeInstruction = `Hiện tại đang dùng chế độ xưng hô: ${profile.mode}. Tên của tôi là ${profile.name || 'chưa biết'}, tên của bạn (Buddy) là ${profile.buddyName}. 
  Hãy luôn xưng hô đúng kiểu ${profile.mode}.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: history,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION + "\n" + modeInstruction,
      temperature: 0.9,
    },
  });

  return response.text;
};

export const parseProfileFromJson = (text: string): Partial<UserProfile> | null => {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch && jsonMatch[1]) {
    try {
      const data = JSON.parse(jsonMatch[1]);
      if (data.tâm_trạng) {
        return {
          mood: data.tâm_trạng,
          strengths: data.điểm_mạnh,
          weaknesses: data.điểm_yếu,
          interests: data.sở_thích,
          dislikes: data.điều_ghét,
          lastUpdate: data.cập_nhật_gần_nhất
        };
      }
    } catch (e) {
      console.error("Failed to parse profile JSON", e);
    }
  }
  return null;
};
