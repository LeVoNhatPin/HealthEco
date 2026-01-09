export function getApiUrl() {
  const url = process.env.NEXT_PUBLIC_API_URL;

  if (!url) {
    // ⚠️ CHỈ WARN – KHÔNG THROW
    if (process.env.NODE_ENV === "development") {
      console.warn("⚠️ NEXT_PUBLIC_API_URL is not defined");
    }
    return "";
  }

  return url;
}
