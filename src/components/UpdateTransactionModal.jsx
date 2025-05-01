import { useEffect, useState } from "react";
import api from "../services/ApiUrl";

function UpdateTransactionModal({ txnId, closeModal, categories, onUpdateSuccess }) {
  const [amount, setAmount] = useState("");
  const [txnType, setTxnType] = useState("expense");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/transactions/getById/${txnId}`);
        const txn = res.data;
        setAmount(txn.amount);
        setTxnType(txn.transaction_type);
        setCategory(txn.category);
        setDescription(txn.description || "");
        setDate(txn.date);
      } catch (err) {
        console.error("Error fetching transaction:", err);
        setError("Failed to load transaction details");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (txnId) {
      fetchTransaction();
    }
  }, [txnId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Determine which category to use (new or existing)
    const finalCategory = newCategory.trim() !== "" ? newCategory : category;
    
    if (!finalCategory) {
      setError("Please select or enter a category");
      return;
    }

    try {
      setIsLoading(true);
      await api.put(`/transactions/put/${txnId}`, {
        amount,
        transaction_type: txnType,
        category: finalCategory,
        description,
        date,
      });
      
      // Call the success callback if provided
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
      
      closeModal();
    } catch (err) {
      console.error("Error updating transaction:", err);
      setError(err.response?.data?.message || "Failed to update transaction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Update Transaction</h2>
          <button 
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
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

            {/* Category Dropdown + New */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  // Clear new category input when selecting from dropdown
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

              <div className="mt-2 flex items-center">
                <input
                  type="text"
                  placeholder="Or type a new category"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newCategory}
                  onChange={(e) => {
                    setNewCategory(e.target.value);
                    // Clear dropdown selection when typing a new category
                    if (e.target.value.trim() !== "") {
                      setCategory("");
                    }
                  }}
                />
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {newCategory ? "Using custom category" : "Using selected category"}
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Description (Optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
              >
                {isLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default UpdateTransactionModal;