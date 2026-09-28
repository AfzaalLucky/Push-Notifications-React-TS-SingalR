import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
  markAsRead: async (id: string) => {},
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [count, setCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Latest notifications, readable from callbacks without re-subscribing
  const notificationsRef = useRef<NotificationItem[]>([]);
  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  // Mark a single notification read locally (safe to call more than once)
  const markLocalRead = useCallback((id: string) => {
    const target = notificationsRef.current.find((n) => n.id === id);
    if (!target || target.isRead) return;

    // update the ref right away so a duplicate call before re-render is a no-op
    notificationsRef.current = notificationsRef.current.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setCount((prev) => Math.max(0, prev - 1));
  }, []);

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

    // Listen for a single notification being marked read (e.g. from another tab)
    conn.on("NotificationMarkedRead", (data: { id?: string }) => {
      if (data?.id) markLocalRead(data.id);
    });

    // cleanup
    return () => {
      conn.stop();
    };
  }, [markLocalRead]);

  const markAsRead = async (id: string) => {
    // update the UI immediately; SignalR echo is ignored if already read
    markLocalRead(id);
    try {
      await axios.post(`http://localhost:5000/api/notifications/${id}/markRead`);
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

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
    <NotificationContext.Provider value={{ count, notifications, resetCount, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
