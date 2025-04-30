import { useState } from "react";
import api from "../services/ApiUrl";
function AddCategoryModal({ closeModal, onCategoryAdded }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/transactions/categories", { name });
      if (onCategoryAdded) {
        onCategoryAdded(); // Refresh categories in parent
      }
      closeModal();
    } catch (err) {
      console.error(err);
      setError("Failed to add category. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Add Category</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1">
              Category Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

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
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCategoryModal;
