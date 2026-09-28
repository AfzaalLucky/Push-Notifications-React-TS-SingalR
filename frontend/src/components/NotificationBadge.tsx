import React, { useState } from "react";
import { useNotifications } from "../contexts/NotificationContext";
import { CheckCheckIcon, ClockIcon, InboxIcon } from "./Icons";

type FoodCategory = "Bakery" | "Coffee" | "Lunch" | "Snacks";

const categories: FoodCategory[] = ["Bakery", "Coffee", "Lunch", "Snacks"];

const categoryTone: Record<FoodCategory, string> = {
  Bakery: "tone-bakery",
  Coffee: "tone-coffee",
  Lunch: "tone-lunch",
  Snacks: "tone-snacks",
};

const categoryEmojis: Record<FoodCategory, string> = {
  Bakery: "🥐",
  Coffee: "☕",
  Lunch: "🍽️",
  Snacks: "🍿",
};

const toneFor = (category?: string) =>
  category ? categoryTone[category as FoodCategory] ?? "" : "";

export const NotificationBadge: React.FC = () => {
  const { count, resetCount, notifications, markAsRead } = useNotifications();
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
    <>
      {/* Header + toolbar */}
      <div className="card__header">
        <div className="toolbar">
          <div>
            <h2 className="card__title">Notifications</h2>
            <p className="card__desc">
              {selectedCategory === "All"
                ? "All categories"
                : `Showing ${selectedCategory} only`}
            </p>
          </div>

          <div className="toolbar__actions">
            <div className="toolbar__filter">
              <label className="label" htmlFor="category-filter">
                Filter by
              </label>
              <select
                id="category-filter"
                className="select select--sm"
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(
                    e.target.value === "All"
                      ? "All"
                      : (e.target.value as FoodCategory)
                  )
                }
              >
                <option value="All">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {categoryEmojis[cat]} {cat}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="btn btn--secondary"
              onClick={() =>
                resetCount(
                  selectedCategory === "All" ? undefined : selectedCategory
                )
              }
            >
              <CheckCheckIcon size={16} />
              Mark as Read
              {categoryCount > 0 && (
                <span
                  key={categoryCount}
                  className="btn__count"
                  aria-label={`${categoryCount} unread`}
                >
                  {categoryCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category stats (click to filter) */}
        <div className="stats" role="group" aria-label="Unread by category">
          {categories.map((cat) => {
            const catCount = notifications.filter(
              (n) => !n.isRead && n.category === cat
            ).length;
            return (
              <button
                key={cat}
                type="button"
                className={`stat ${categoryTone[cat]}`}
                aria-pressed={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
              >
                <span className="stat__icon" aria-hidden="true">
                  {categoryEmojis[cat]}
                </span>
                <span>
                  <span className="stat__value">{catCount}</span>
                  <span className="stat__label">{cat}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notifications list */}
      {filteredNotifications.length > 0 ? (
        <>
          <div className="feed-head">
            <h3>Recent activity</h3>
            <span>
              {filteredNotifications.length}{" "}
              {filteredNotifications.length === 1 ? "item" : "items"}
            </span>
          </div>
          <ul className="feed">
            {filteredNotifications.map((n) => (
              <li
                key={n.id}
                className={`feed-item ${toneFor(n.category)} ${
                  n.isRead ? "feed-item--read" : "feed-item--unread"
                }`}
                {...(!n.isRead && {
                  role: "button",
                  tabIndex: 0,
                  title: "Mark as read",
                  "aria-label": `${n.title ?? "Notification"}: ${n.message ?? ""}. Mark as read`,
                  onClick: () => markAsRead(n.id),
                  onKeyDown: (e: React.KeyboardEvent) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      markAsRead(n.id);
                    }
                  },
                })}
              >
                <span className="feed-item__icon" aria-hidden="true">
                  {n.category ? categoryEmojis[n.category as FoodCategory] : "📣"}
                </span>

                <div className="feed-item__body">
                  <div className="feed-item__top">
                    <span className="feed-item__title">{n.title}</span>
                    {!n.isRead && <span className="tag tag--new">New</span>}
                  </div>
                  {n.message && <p className="feed-item__msg">{n.message}</p>}
                  <div className="feed-item__meta">
                    {n.category && <span className="tag">{n.category}</span>}
                    <time dateTime={n.createdAt}>
                      <ClockIcon size={12} />
                      {new Date(n.createdAt || "").toLocaleString()}
                    </time>
                  </div>
                </div>

                {!n.isRead && (
                  <span className="unread-dot" aria-label="Unread" />
                )}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="empty">
          <div className="empty__icon">
            <InboxIcon size={24} />
          </div>
          <p className="empty__title">No notifications yet</p>
          <p className="empty__text">You're all caught up!</p>
        </div>
      )}
    </>
  );
};
