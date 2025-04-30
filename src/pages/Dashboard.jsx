import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BudgetCards from "../components/BudgetCards";
import AddBudgetModal from "../components/AddBudgetModal";
import AddCategoryModal from "../components/AddCategoryModal";
import UpdateTransactionModal from "../components/UpdateTransactionModal";
import api from "../services/ApiUrl";
import TransactionTable from "../components/TransactionTable";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showUpdateTransactionModal, setShowUpdateTransactionModal] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/"); // Redirect to login if no token is found
    }
  }, [token, navigate]);

  const refreshTransactions = async () => {
    try {
      const res = await api.get("/transactions/get");
      setTransactions(res.data); // Update state with the latest transactions
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };

  const openAddBudgetModal = () => setShowAddBudgetModal(true);
  const closeAddBudgetModal = () => setShowAddBudgetModal(false);

  const openAddCategoryModal = () => setShowAddCategoryModal(true);
  const closeAddCategoryModal = () => setShowAddCategoryModal(false);

  const openUpdateTransactionModal = (id) => {
    setSelectedTransactionId(id);
    setShowUpdateTransactionModal(true);
  };

  const closeUpdateTransactionModal = () =>
    setShowUpdateTransactionModal(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="max-w-2xl mx-auto mb-6">
          <BudgetCards />
        </div>

        <div className="flex justify-end mb-5">
          <button
            onClick={openAddBudgetModal}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Budget
          </button>
        </div>

        <TransactionTable
          transactions={transactions}
          setTransactions={setTransactions}
        />

        {/* Modals */}
        {showAddBudgetModal && (
          <AddBudgetModal
            closeModal={closeAddBudgetModal}
            onBudgetAdded={refreshTransactions} // Pass the refresh function here
            setTransactions={setTransactions}
          />
        )}
        {showAddCategoryModal && (
          <AddCategoryModal closeModal={closeAddCategoryModal} />
        )}
        {showUpdateTransactionModal && (
          <UpdateTransactionModal
            txnId={selectedTransactionId}
            closeModal={closeUpdateTransactionModal}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;