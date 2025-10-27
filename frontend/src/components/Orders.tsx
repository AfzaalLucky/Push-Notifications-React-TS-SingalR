import React, { useState } from "react";
import axios from "axios";

type FoodCategory = "Bakery" | "Coffee" | "Lunch" | "Snacks";

const categoryEmojis: Record<FoodCategory, string> = {
  Bakery: "🥐",
  Coffee: "☕",
  Lunch: "🍽️",
  Snacks: "🍿",
};

export const Orders: React.FC = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<FoodCategory>("Bakery");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const createOrder = async () => {
    if (!name.trim()) {
      alert("Please enter a customer name");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/orders", {
        customerName: name,
        category: category,
      });
      setName("");
      setSuccessMessage(`✅ Order created successfully for ${name}!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to create order:", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px',
        maxWidth: '500px'
      }}>
        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#2c3e50',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            Customer Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter customer name"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '15px',
              outline: 'none',
              transition: 'border-color 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#2c3e50',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as FoodCategory)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '15px',
              outline: 'none',
              cursor: 'pointer',
              background: 'white',
              transition: 'border-color 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
          >
            <option value="Bakery">{categoryEmojis.Bakery} Bakery</option>
            <option value="Coffee">{categoryEmojis.Coffee} Coffee</option>
            <option value="Lunch">{categoryEmojis.Lunch} Lunch</option>
            <option value="Snacks">{categoryEmojis.Snacks} Snacks</option>
          </select>
        </div>

        <button 
          onClick={createOrder}
          disabled={isLoading}
          style={{
            padding: '14px 28px',
            background: isLoading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: isLoading ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)',
          }}
          onMouseOver={(e) => {
            if (!isLoading) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
            }
          }}
          onMouseOut={(e) => {
            if (!isLoading) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            }
          }}
        >
          {isLoading ? '⏳ Creating...' : '🚀 Create Order'}
        </button>

        {successMessage && (
          <div style={{
            padding: '12px 16px',
            background: '#d4edda',
            color: '#155724',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid #c3e6cb',
            animation: 'slideIn 0.3s ease'
          }}>
            {successMessage}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
