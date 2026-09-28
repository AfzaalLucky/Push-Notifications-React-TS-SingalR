import React, { useState } from "react";
import axios from "axios";
import { AlertCircleIcon, ArrowRightIcon, CheckCircleIcon } from "./Icons";

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
  const [nameError, setNameError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const createOrder = async () => {
    if (!name.trim()) {
      setNameError("Please enter a customer name");
      return;
    }

    setIsLoading(true);
    setSubmitError("");
    try {
      await axios.post("http://localhost:5000/api/orders", {
        customerName: name,
        category: category,
      });
      setName("");
      setSuccessMessage(`Order created successfully for ${name}!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to create order:", error);
      setSubmitError("Failed to create order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        createOrder();
      }}
    >
      <div className="field">
        <label className="label" htmlFor="customer-name">
          Customer Name
        </label>
        <input
          id="customer-name"
          className="input"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError) setNameError("");
          }}
          placeholder="Enter customer name"
          autoComplete="name"
          aria-invalid={!!nameError}
          aria-describedby={nameError ? "customer-name-error" : undefined}
        />
        {nameError && (
          <span id="customer-name-error" className="field-hint" role="alert">
            {nameError}
          </span>
        )}
      </div>

      <div className="field">
        <label className="label" htmlFor="order-category">
          Category
        </label>
        <select
          id="order-category"
          className="select"
          value={category}
          onChange={(e) => setCategory(e.target.value as FoodCategory)}
        >
          <option value="Bakery">{categoryEmojis.Bakery} Bakery</option>
          <option value="Coffee">{categoryEmojis.Coffee} Coffee</option>
          <option value="Lunch">{categoryEmojis.Lunch} Lunch</option>
          <option value="Snacks">{categoryEmojis.Snacks} Snacks</option>
        </select>
      </div>

      <button
        type="submit"
        className="btn btn--primary btn--lg btn--block"
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <span className="spinner" aria-hidden="true" />
            Creating...
          </>
        ) : (
          <>
            Create Order
            <ArrowRightIcon size={16} />
          </>
        )}
      </button>

      <div className="form__status" aria-live="polite">
        {successMessage && (
          <div className="alert alert--success">
            <CheckCircleIcon size={16} />
            {successMessage}
          </div>
        )}
        {submitError && (
          <div className="alert alert--error" role="alert">
            <AlertCircleIcon size={16} />
            {submitError}
          </div>
        )}
      </div>
    </form>
  );
};
