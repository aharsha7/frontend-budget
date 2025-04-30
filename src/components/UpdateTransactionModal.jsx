import { useState, useEffect } from "react";
import api from "../services/ApiUrl";

function UpdateTransactionModal({ closeModal, txnId }) {
  const [amount, setAmount] = useState("");
  const [txnType, setTxnType] = useState("expense");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      await api.get(`/transactions/put/${txnId}`, {
        amount,
        type: txnType,
        category_id: categoryId,
        description,
      });
      closeModal(); 
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Update Transaction</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="amount" className="block">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="txnType" className="block">
              Transaction Type
            </label>
            <select
              id="txnType"
              value={txnType}
              onChange={(e) => setTxnType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block">
              Category
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select a Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 text-white p-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Update Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateTransactionModal;
