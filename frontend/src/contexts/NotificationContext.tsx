import React, { createContext, useContext, useEffect, useState } from "react";
import { createHubConnection } from "../services/signalr";
import axios from "axios";

type FoodCategory = "Bakery" | "Coffee" | "Lunch" | "Snacks";

type NotificationItem = {
  id: string;
  title?: string;
  message?: string;
  createdAt?: string;
  payload?: string;
  category?: FoodCategory;
  isRead?: boolean;
};

const NotificationContext = createContext({
  count: 0,
  notifications: [] as NotificationItem[],
  resetCount: async (category?: string) => {},
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [count, setCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    // fetch initial count
    axios
      .get("http://localhost:5000/api/notifications/count")
      .then((res) => setCount(res.data.count))
      .catch(() => setCount(0));

    // connect to signalr
    const conn = createHubConnection();

    // conn.start()
    //   .then(() => console.log('SignalR connected'))
    //   .catch(err => console.error(err));

    conn.start().then(() => {
      // Subscribe to multiple categories
      ["Bakery", "Coffee", "Lunch", "Snacks"].forEach((cat) => {
        conn.invoke("SubscribeCategory", cat);
      });
    });

    conn.on("NewOrder", (payload: NotificationItem) => {
      // increment UI badge
      setCount((prev) => prev + 1);
      setNotifications((prev) => [payload, ...prev]);

      // Show system/browser notification if permitted
      if (Notification.permission === "granted") {
        const n = new Notification(payload.title || "Notification", {
          body: payload.message || "",
        });
        n.onclick = () => {
          window.focus();
        };
      }
    });

    // Listen for server notifications that items were marked read
    conn.on("NotificationsMarkedRead", (data: { category?: string }) => {
      const category = data?.category;
      if (!category || category === "") {
        // all marked
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setCount(0);
        return;
      }

      // mark only that category locally
      setNotifications((prev) => {
        const updated = prev.map((n) => {
          if (!n.isRead && n.category === category) {
            return { ...n, isRead: true };
          }
          return n;
        });
        return updated;
      });
      
      // Recalculate total unread count
      setNotifications((prev) => {
        const unreadCount = prev.filter(n => !n.isRead).length;
        setCount(unreadCount);
        return prev;
      });
    });

    // cleanup
    return () => {
      conn.stop();
    };
  }, []);

  const resetCount = async (category?: string) => {
    try {
      if (category && category !== "All") {
        // mark only the provided category on the server
        await axios.post(
          "http://localhost:5000/api/notifications/markByCategory",
          null,
          { params: { category } }
        );
        // SignalR will handle the local state update via NotificationsMarkedRead event
      } else {
        // mark all
        await axios.post("http://localhost:5000/api/notifications/markAllRead");
        // SignalR will handle the local state update via NotificationsMarkedRead event
      }
    } catch (err) {
      console.error("Failed to mark notifications as read", err);
    }
  };

  return (
    <NotificationContext.Provider value={{ count, notifications, resetCount }}>
      {children}
    </NotificationContext.Provider>
  );
};
