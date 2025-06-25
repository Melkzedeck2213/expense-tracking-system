"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import SubmitButton from "./SubmitButton";
import ClearButton from "./ClearButton";

const defaultCategories = [
  "Food",
  "Electricity",
  "Clothes",
  "Entertainment",
  "Water Bill",
  "Rent",
  "Other",
];

export default function ExpenseForm() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // error tracking
  const [nameError, setNameError] = useState("");
  const [amountError, setAmountError] = useState("");

  const isValidName = (value) => /^[a-zA-Z0-9\s.,'-]{2,50}$/.test(value.trim());
  const isValidAmount = (value) => !isNaN(value) && parseFloat(value) > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setNameError("");
    setAmountError("");

    let hasError = false;

    if (!isValidName(name)) {
      setNameError("Use 2–50 characters. No weird symbols.");
      hasError = true;
    }

    if (!isValidAmount(amount)) {
      setAmountError("Amount must be a positive number.");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage("Failed to get user.");
      setLoading(false);
      return;
    }

    const finalCategory = category === "Other" ? customCategory : category;

    const { error } = await supabase.from("expenses").insert([
      {
        user_id: user.id,
        name: name.trim(),
        amount: parseFloat(amount),
        category: finalCategory.trim(),
      },
    ]);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      clearForm();
      setMessage("Expense added!");
      {
        /**Clear the sucess message afer 2 secs */
      }
      setTimeout(() => {
        setMessage("");
      }, 2000);
    }

    setLoading(false);
  };

  const clearForm = () => {
    setName("");
    setCategory("");
    setCustomCategory("");
    setAmount("");
    setNameError("");
    setAmountError("");
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block mb-1 font-medium">Expense Name</label>
        <input
          type="text"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          className={`w-full border px-3 py-2 rounded ${
            nameError ? "border-red-500" : ""
          }`}
        />
        {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">Category</label>
        <select
          value={category}
          required
          onChange={(e) => setCategory(e.target.value)}
          className="select select-bordered w-full bg-base-100 text-base-content"
        >
          <option value="">-- Select --</option>
          {defaultCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {category === "Other" && (
        <div>
          <label className="block mb-1 font-medium">Custom Category</label>
          <input
            type="text"
            value={customCategory}
            required
            onChange={(e) => setCustomCategory(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      )}

      <div>
        <label className="block mb-1 font-medium">Amount</label>
        <input
          type="number"
          value={amount}
          required
          onChange={(e) => setAmount(e.target.value)}
          className={`w-full border px-3 py-2 rounded ${
            amountError ? "border-red-500" : ""
          }`}
          min="0.01"
          step="0.01"
        />
        {amountError && (
          <p className="text-red-500 text-sm mt-1">{amountError}</p>
        )}
      </div>

      <div className="flex flex-row gap-4">
        <SubmitButton text="Add expense" isSubmitting={loading} />
        <ClearButton onClick={clearForm} />
      </div>

      {message && <p className="mt-2 text-sm text-green-500">{message}</p>}
    </form>
  );
}
