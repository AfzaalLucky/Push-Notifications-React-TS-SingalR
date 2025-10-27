import React, { useState } from "react";
import { useNotifications } from "../contexts/NotificationContext";

type FoodCategory = "Bakery" | "Coffee" | "Lunch" | "Snacks";

const categoryColors: Record<FoodCategory, string> = {
  Bakery: "#FF6B6B",
  Coffee: "#8B4513",
  Lunch: "#4ECDC4",
  Snacks: "#FFA500",
};

const categoryEmojis: Record<FoodCategory, string> = {
  Bakery: "🥐",
  Coffee: "☕",
  Lunch: "🍽️",
  Snacks: "🍿",
};

export const NotificationBadge: React.FC = () => {
  const { count, resetCount, notifications } = useNotifications();
  const [selectedCategory, setSelectedCategory] = useState<
    "All" | FoodCategory
  >("All");

  const filteredNotifications = notifications.filter(
    (n) => selectedCategory === "All" || n.category === selectedCategory
  );

  const categoryCount =
    selectedCategory === "All"
      ? count
      : notifications.filter((n) => !n.isRead && n.category === selectedCategory).length;

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px'
    }}>
      {/* Header Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <button
            onClick={() =>
              resetCount(
                selectedCategory === "All" ? undefined : selectedCategory
              )
            }
            style={{
              background: 'white',
              color: '#667eea',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            🔔 Mark as Read
          </button>
          {categoryCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: -8,
                right: -8,
                borderRadius: "50%",
                background: "#FF4757",
                color: "white",
                padding: "6px 10px",
                fontSize: 12,
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(255,71,87,0.4)',
                animation: 'pulse 2s infinite',
              }}
            >
              {categoryCount}
            </span>
          )}
        </div>

        <div>
          <label style={{ color: 'white', marginRight: '10px', fontWeight: '500' }}>
            Filter by:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(
                e.target.value === "All"
                  ? "All"
                  : (e.target.value as FoodCategory)
              )
            }
            style={{ 
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              background: 'white',
              color: '#667eea',
              outline: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <option value="All">📋 All Categories</option>
            <option value="Bakery">🥐 Bakery</option>
            <option value="Coffee">☕ Coffee</option>
            <option value="Lunch">🍽️ Lunch</option>
            <option value="Snacks">🍿 Snacks</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        {(["Bakery", "Coffee", "Lunch", "Snacks"] as FoodCategory[]).map(cat => {
          const catCount = notifications.filter(n => !n.isRead && n.category === cat).length;
          return (
            <div key={cat} style={{
              padding: '20px',
              background: categoryColors[cat],
              borderRadius: '12px',
              color: 'white',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              cursor: 'pointer',
            }}
            onClick={() => setSelectedCategory(cat)}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{categoryEmojis[cat]}</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>{catCount}</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>{cat}</div>
            </div>
          );
        })}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div
          style={{
            maxHeight: "500px",
            overflowY: "auto",
            borderRadius: "12px",
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          }}
        >
          {filteredNotifications.map((n, index) => (
            <div
              key={n.id}
              style={{
                padding: "20px",
                borderBottom: index < filteredNotifications.length - 1 ? "1px solid #f0f0f0" : "none",
                backgroundColor: n.isRead ? "#f9f9f9" : "white",
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                paddingLeft: '16px',
                borderLeft: `4px solid ${n.category ? categoryColors[n.category as FoodCategory] : '#ccc'}`,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = n.isRead ? "#f0f0f0" : "#f8f9ff";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = n.isRead ? "#f9f9f9" : "white";
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>
                      {n.category ? categoryEmojis[n.category as FoodCategory] : '📣'}
                    </span>
                    <strong style={{ 
                      fontSize: '16px',
                      color: n.isRead ? '#666' : '#333',
                      fontWeight: '600'
                    }}>
                      {n.title}
                    </strong>
                    {!n.isRead && (
                      <span style={{
                        background: '#FF4757',
                        color: 'white',
                        fontSize: '10px',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontWeight: 'bold'
                      }}>
                        NEW
                      </span>
                    )}
                  </div>
                  <div style={{ 
                    color: n.isRead ? '#999' : '#555',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    marginBottom: '8px'
                  }}>
                    {n.message}
                  </div>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <small style={{ 
                      color: "#999",
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <span style={{
                        background: n.category ? categoryColors[n.category as FoodCategory] : '#ccc',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {n.category}
                      </span>
                      <span>•</span>
                      <span>🕐 {new Date(n.createdAt || "").toLocaleString()}</span>
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
          <div style={{ fontSize: '18px', color: '#999', fontWeight: '500' }}>
            No notifications yet
          </div>
          <div style={{ fontSize: '14px', color: '#ccc', marginTop: '8px' }}>
            You're all caught up!
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};
