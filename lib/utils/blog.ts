export function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function formatIssueNumber(createdAt: string) {
  const date = new Date(createdAt);
  const yearStart = new Date(date.getFullYear(), 0, 1);
  const diffInMs = date.getTime() - yearStart.getTime();
  const dayOfYear = Math.floor(diffInMs / 86400000) + 1;
  return `${date.getFullYear().toString().slice(-2)}${dayOfYear.toString().padStart(3, "0")}`;
}

export function formatPublishedDate(dateString: string | null) {
  const source = dateString ? new Date(dateString) : new Date();
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(source);
}

export function estimateReadMinutes(content: string) {
  const words = stripHtml(content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
