import { HARD_CHAT } from "./hardcodedChat";

export default function findHardAnswer(message: string) {
  const text = message.toLowerCase().trim();

  for (const group of Object.values(HARD_CHAT)) {
    if (!Array.isArray(group)) continue;

    for (const item of group) {
      if (item.q.some(q => text.includes(q))) {
        return typeof item.a === "function" ? item.a() : item.a;
      }
    }
  }

  return null; // ✅ QUAN TRỌNG
}
