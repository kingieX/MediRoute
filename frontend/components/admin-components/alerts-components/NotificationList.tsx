import { Alert, AlertDescription } from "@/components/ui/alert";
import React from "react";

const NotificationList = ({ notifications }) => {
  if (notifications.length === 0) {
    return null;
  }

  return (
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
  );
};

export default NotificationList;
