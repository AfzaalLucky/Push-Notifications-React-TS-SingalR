import React, { useEffect } from 'react';
import { NotificationProvider, useNotifications } from './contexts/NotificationContext';
import { NotificationBadge } from './components/NotificationBadge';
import { Orders } from './components/Orders';
import { BellIcon, PackageIcon } from './components/Icons';

const TopBar: React.FC = () => {
  const { count } = useNotifications();

  return (
    <header className="topbar">
      <div className="topbar__inner">
        <div className="brand">
          <span className="brand__mark">
            <BellIcon size={16} />
          </span>
          <span>
            <span className="brand__name-long">Real-Time </span>Notifications
          </span>
        </div>
        <span className="live-pill" aria-live="polite">
          <span className="live-pill__dot" aria-hidden="true" />
          {count} unread
        </span>
      </div>
    </header>
  );
};

function App() {
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <NotificationProvider>
      <TopBar />

      <main className="page">
        <div className="page-header reveal">
          <span className="eyebrow">Live dashboard</span>
          <h1 className="page-title">Notifications Dashboard</h1>
          <p className="page-subtitle">
            Watch new orders arrive as they happen, filter them by category, and keep the queue clear.
          </p>
        </div>

        <div className="layout">
          <section className="card reveal reveal--2" aria-label="Notifications">
            <NotificationBadge />
          </section>

          <aside className="layout__aside reveal reveal--3">
            <section className="card" aria-labelledby="orders-title">
              <div className="card__body">
                <div className="card__icon">
                  <PackageIcon />
                </div>
                <h2 id="orders-title" className="card__title">
                  Create New Orders
                </h2>
                <p className="card__desc card__desc--lead">
                  Each new order sends a live notification to every subscribed client.
                </p>
                <Orders />
              </div>
            </section>
          </aside>
        </div>
      </main>
    </NotificationProvider>
  );
}

export default App;
