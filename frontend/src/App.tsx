import React, { useEffect } from 'react';
import { NotificationProvider } from './contexts/NotificationContext';
import { NotificationBadge } from './components/NotificationBadge';
import { Orders } from './components/Orders';

function App() {
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <NotificationProvider>
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '40px 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h1 style={{
            textAlign: 'center',
            color: '#2c3e50',
            fontSize: '42px',
            fontWeight: '700',
            marginBottom: '40px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            🔔 Real-Time Notifications Dashboard
          </h1>
          
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}>
            <NotificationBadge />
          </div>
          
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{
              color: '#2c3e50',
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '20px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              📦 Create New Orders
            </h2>
            <Orders />
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
}

export default App;
