// Tách chuỗi ghi chú/lý do (review_note) theo ";" thành từng dòng riêng.
export function splitNotes(text?: string | null): string[] {
  if (!text) return [];
  return text
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}
