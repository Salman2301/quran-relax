export function obj2str(obj: Record<string, string|number|boolean>): string {
  if (typeof obj !== "object") return "";
  return Object.entries(obj).map(([key, value]) => `${key}:${value}`).join(";");
}
