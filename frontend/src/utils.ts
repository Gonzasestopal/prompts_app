import { format } from "date-fns";

export function fmt(dt: string) {
  try {
    return format(new Date(dt), "yyyy-MM-dd HH:mm");
  } catch {
    return dt;
  }
}
