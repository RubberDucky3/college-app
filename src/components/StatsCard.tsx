interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  color?: "blue" | "green" | "purple" | "orange";
}

const COLOR_MAP = {
  blue: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  green: "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300",
  purple: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  orange: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
};

export default function StatsCard({
  title,
  value,
  subtitle,
  color = "blue",
}: StatsCardProps) {
  return (
    <div
      className={`rounded-xl border p-4 ${COLOR_MAP[color]}`}
    >
      <p className="text-xs font-medium opacity-75">{title}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {subtitle && (
        <p className="mt-0.5 text-xs opacity-70">{subtitle}</p>
      )}
    </div>
  );
}
