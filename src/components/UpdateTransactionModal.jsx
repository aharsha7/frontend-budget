import { useEffect, useState } from "react";
import api from "../services/ApiUrl";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

function UpdateTransactionModal({ txnId, closeModal, categories, onUpdateSuccess }) {
  const [amount, setAmount] = useState("");
  const [txnType, setTxnType] = useState("expense");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const notyf = new Notyf({
    duration: 3000,
    position: { x: "right", y: "top" },
    types: [
      {
        type: "success",
        background: "orange",
        icon: false,
      },
      {
        type: "error",
        background: "red",
        icon: false,
      },
    ],
  });

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await api.get(`/transactions/getById/${txnId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const txn = res.data;
        setAmount(txn.amount);
        setTxnType(txn.transaction_type);
        setCategory(txn.category);
        setDescription(txn.description || "");
        setDate(txn.date);
      } catch (err) {
        console.error("Error fetching transaction:", err);
        setError("Failed to load transaction details");
      }
    };

    if (txnId) {
      fetchTransaction();
    }
  }, [txnId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const finalCategory = newCategory.trim() !== "" ? newCategory : category;

    if (!finalCategory) {
      setError("Please select or enter a category");
      return;
    }

    const payload = {
      amount,
      transaction_type: txnType,
      category: finalCategory,
      description,
      date,
    };

    console.log("Updating transaction with payload:", payload);

    try {
      const response = await api.put(`/transactions/put/${txnId}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Update response:", response.data);

      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
      notyf.success("Budget updated successfully!");
      closeModal();
    } catch (err) {
      console.error("Error updating transaction:", err);
      setError(err.response?.data?.message || "Failed to update transaction");
      notyf.error("Failed to update budget.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Update Transaction</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <i class="fa-solid fa-delete-left"></i>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Transaction Type */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Transaction Type</label>
            <select
              value={txnType}
              onChange={(e) => setTxnType(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Type</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Category Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Category</label>
            <div className="mb-2">
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (e.target.value) {
                    setNewCategory("");
                  }
                }}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a Category</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="General">General</option>
                <option value="Shopping">Shopping</option>
                {categories &&
                  categories.map((cat) => (
                    <option key={cat.id || cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="mt-2">
              <label className="block text-gray-700 mb-1">
                Or Create New Category
              </label>
              <input
                type="text"
                placeholder="Type a new category"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newCategory}
                onChange={(e) => {
                  setNewCategory(e.target.value);
                  if (e.target.value.trim() !== "") {
                    setCategory("");
                  }
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center">
            
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-orange-400 text-white rounded transition-colors"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateTransactionModal;
