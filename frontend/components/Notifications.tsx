import { Alert, AlertDescription } from "@/components/ui/alert";

interface Notification {
  id: number;
  type: string;
  message: string;
  timestamp: string;
}

interface NotificationsProps {
  notifications: Notification[];
}

export const Notifications = ({ notifications }: NotificationsProps) => {
  return (
    notifications.length > 0 && (
      <div className="p-4 space-y-2">
        {notifications.map((notification) => (
          <Alert
            key={notification.id}
            variant={notification.type === "error" ? "destructive" : "default"}
          >
            <AlertDescription className="flex items-center justify-between">
              <span>{notification.message}</span>
              <span className="text-xs text-gray-500">
                {notification.timestamp}
              </span>
            </AlertDescription>
          </Alert>
        ))}
      </div>
    )
  );
};
