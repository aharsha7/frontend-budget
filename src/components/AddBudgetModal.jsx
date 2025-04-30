import { useEffect, useState } from "react";
import api from "../services/ApiUrl";

function AddBudgetModal({ closeModal, onBudgetAdded, setTransactions }) {
  const [budgetForm, setBudgetForm] = useState({
    amount: "",
    transaction_type: "expense",
    category: "",
    customCategory: "",
    description: "",
    date: "",
  });

  const [categories, setCategories] = useState([]);
  const [addData, setAddData] = useState([]);

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const res = await api.get("/transactions/categories");
  //       setCategories(res.data);
  //     } catch (error) {
  //       console.error("Failed to fetch categories", error);
  //     }
  //   };
  //   fetchCategories();
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBudgetForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const finalCategory = budgetForm.newCategory?.trim()
      ? budgetForm.newCategory.trim()
      : budgetForm.category;
  
    if (!finalCategory) {
      alert("Please select or type a category");
      return;
    }
  
    const budgetData = {
      amount: parseFloat(budgetForm.amount),
      transaction_type: budgetForm.transaction_type,
      category: finalCategory,
      description: budgetForm.description,
      date: budgetForm.date,
    };
  
    try {
      const res = await api.post("/transactions/post", budgetData);
      setAddData(res.data);
      if (setTransactions) {
        setTransactions((prev) => [...prev, res.data]);
      }
      if (onBudgetAdded) {
        onBudgetAdded(res.data);
      }
      closeModal();
    } catch (error) {
      console.error("Failed to add budget:", error);
    }
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Add Budget</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="date" className="block">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={budgetForm.date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="amount" className="block">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={budgetForm.amount}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="transaction_type" className="block">
              Transaction Type
            </label>
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

          <div className="mb-4">
            <label htmlFor="category" className="block mb-1">
              Category
            </label>

            <select
              name="category"
              id="category"
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

            <input
              type="text"
              placeholder="Or type a new category"
              className="w-full p-2 border border-gray-300 rounded"
              value={budgetForm.newCategory || ""}
              onChange={(e) =>
                setBudgetForm((prev) => ({
                  ...prev,
                  newCategory: e.target.value,
                }))
              }
            />
          </div>

          {/* Input field for custom category
          <div className="mb-4">
            <label htmlFor="customCategory" className="block">
              Or Add New Category
            </label>
            <input
              type="text"
              name="customCategory"
              value={budgetForm.customCategory}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Type new category..."
            />
          </div> */}

          <div className="mb-4">
            <label htmlFor="description" className="block">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={budgetForm.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBudgetModal;
