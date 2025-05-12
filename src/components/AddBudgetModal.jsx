import { useEffect, useState } from "react";
import api from "../services/ApiUrl";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

function BudgetModal({ closeModal, onBudgetAdded, onBudgetUpdated, editData = null }) {
  const isEditMode = !!editData;
  const notyf = new Notyf({ duration: 3000, position: { x: "right", y: "top" } });

  const [budgetForm, setBudgetForm] = useState({
    amount: "",
    transaction_type: "expense",
    category: "",
    newCategory: "",
    description: "",
    date: "",
  });

  const [categories, setCategories] = useState([]);
  const [showCategoryError, setShowCategoryError] = useState(false);

  useEffect(() => {
    if (isEditMode && editData) {
      setBudgetForm({
        amount: editData.amount,
        transaction_type: editData.transaction_type,
        category: editData.category,
        newCategory: "",
        description: editData.description || "",
        date: editData.date,
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBudgetForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedCategory = budgetForm.category?.trim();
    const typedCategory = budgetForm.newCategory?.trim();

    if (!selectedCategory && !typedCategory) {
      setShowCategoryError(true);
      return;
    }
    setShowCategoryError(false);

    const finalCategory = typedCategory || selectedCategory;

    const amountValue = parseFloat(budgetForm.amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      notyf.error("Amount must be a positive number.");
      return;
    }

    const budgetData = {
      amount: amountValue,
      transaction_type: budgetForm.transaction_type,
      category: finalCategory,
      description: budgetForm.description?.trim(),
      date: budgetForm.date,
    };

    console.log("Sending data:", budgetData); // Debugging

    try {
      const accessToken = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      if (isEditMode) {
        await api.put(`/transactions/put/${editData.id}`, budgetData, config);
        onBudgetUpdated && onBudgetUpdated();
        notyf.success("Budget updated successfully!");
      } else {
        await api.post("/transactions/post", budgetData, config);
        onBudgetAdded && onBudgetAdded();
        notyf.success("Budget added successfully!");
      }
      closeModal();
    } catch (error) {
      console.error("Failed to submit budget:", error.response?.data || error.message);
      notyf.error(`Failed to ${isEditMode ? "update" : "add"} budget.`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4 relative">
          {isEditMode ? "Update Budget" : "Add Budget"}
          <button
            onClick={closeModal}
            className="absolute right-0 top-0 text-gray-500 hover:text-gray-700"
          >
            <i className="fa-solid fa-delete-left"></i>

          </button>
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Date */}
          <div className="mb-4">
            <label className="block">Date</label>
            <input
              type="date"
              name="date"
              value={budgetForm.date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label className="block">Amount</label>
            <input
              type="number"
              name="amount"
              value={budgetForm.amount}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
              min="0"
              step="1"
            />
          </div>

          {/* Transaction Type */}
          <div className="mb-4">
            <label className="block">Transaction Type</label>
            <select
              name="transaction_type"
              value={budgetForm.transaction_type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block mb-1">Category</label>
            <select
              name="category"
              value={budgetForm.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            >
              <option value="">Select a Category</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="General">General</option>
              <option value="Shopping">Shopping</option>
              {categories.map((cat) => (
                <option key={cat.id || cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            {showCategoryError && (
              <p className="text-red-500 text-sm mb-2">
                Please select or type a category.
              </p>
            )}
            <input
              type="text"
              name="newCategory"
              placeholder="Or type a new category"
              className="w-full p-2 border border-gray-300 rounded"
              value={budgetForm.newCategory}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block">Description (Optional)</label>
            <textarea
              name="description"
              value={budgetForm.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center">
            
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {isEditMode ? "Update Budget" : "Add Budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BudgetModal;
