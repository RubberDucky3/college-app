"use client";

import { useStudentGraph } from "@/contexts/StudentGraph";
import type { Notification } from "@/types/student-graph";

interface NotificationCenterProps {
  onClose?: () => void;
}

export default function NotificationCenter({ onClose }: NotificationCenterProps) {
  const { graph, markNotificationRead, addNotification } = useStudentGraph();
  const unread = graph.notifications.filter((n) => !n.read);

  return (
    <div className="w-80 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Notifications
        </h3>
        {unread.length > 0 && (
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
            {unread.length} new
          </span>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {graph.notifications.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <div className="mb-2 text-2xl">🔔</div>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              No notifications yet
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {graph.notifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onMarkRead={markNotificationRead}
              />
            ))}
          </div>
        )}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="w-full rounded-b-xl border-t border-gray-100 px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-750"
        >
          Close
        </button>
      )}
    </div>
  );
}

function NotificationItem({
  notification,
  onMarkRead,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
}) {
  const iconMap: Record<string, string> = {
    milestone: "🎯",
    deadline: "⏰",
    suggestion: "💡",
    reminder: "🔔",
    missing: "📋",
  };

  return (
    <div
      className={`px-4 py-3 transition-colors ${
        notification.read
          ? "opacity-60"
          : "bg-blue-50/50 dark:bg-blue-900/10"
      }`}
      onClick={() => !notification.read && onMarkRead(notification.id)}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-lg">
          {iconMap[notification.type] || "📌"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {notification.title}
          </p>
          {notification.body && (
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {notification.body}
            </p>
          )}
          <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
            {new Date(notification.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        {!notification.read && (
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
        )}
      </div>
    </div>
  );
}
