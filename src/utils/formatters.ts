export const formatRisk = (score: number): "Low"|"Medium"|"High"|"Critical" => {
  if (score < 25) return "Low"; if (score < 50) return "Medium";
  if (score < 75) return "High"; return "Critical";
};
export const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { year:"numeric",month:"short",day:"numeric" });
export const formatRelativeTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff/60000);
  if (mins < 1) return "just now"; if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins/60); if (hrs < 24) return `${hrs}hr ago`;
  return `${Math.floor(hrs/24)}d ago`;
};
