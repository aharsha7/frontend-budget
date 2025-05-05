import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BudgetCards from "../components/BudgetCards";
import AddBudgetModal from "../components/AddBudgetModal";
import AddCategoryModal from "../components/AddCategoryModal";
import UpdateTransactionModal from "../components/UpdateTransactionModal";
import api from "../services/ApiUrl";
import TransactionTable from "../components/TransactionTable";
import TransactionCharts from "../components/TransactionCharts";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showUpdateTransactionModal, setShowUpdateTransactionModal] =
    useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      fetchTransactions();
    }
  }, [token, navigate]);

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/transactions/get");
      setTransactions(res.data);
      filterTransactions(res.data, selectedMonth, selectedYear, searchQuery);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };

  const filterTransactions = (allTransactions, month, year, query) => {
    const filteredByDate = allTransactions.filter((txn) => {
      if (!txn.date) return false;
      const txnDateParts = txn.date.split("-");
      const txnYear = parseInt(txnDateParts[0]);
      const txnMonth = parseInt(txnDateParts[1]);
      return txnYear === year && txnMonth === month;
    });

    // Apply the search query filter on already filtered by date
    const filteredBySearch = filteredByDate.filter(
      (txn) =>
        txn.category.toLowerCase().includes(query.toLowerCase()) ||
        txn.amount.toString().includes(query)
    );

    setFilteredTransactions(filteredBySearch); // Update filtered transactions
  };

  // This function updates both transactions and filtered transactions
  // when a transaction is deleted
  const handleTransactionsUpdate = (updatedTransactions) => {
    setTransactions(updatedTransactions);
    filterTransactions(
      updatedTransactions,
      selectedMonth,
      selectedYear,
      searchQuery
    );
  };

  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split("-");
    const intYear = parseInt(year);
    const intMonth = parseInt(month);
    setSelectedYear(intYear);
    setSelectedMonth(intMonth);
    filterTransactions(transactions, intMonth, intYear, searchQuery); // Apply filters when month changes
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <BudgetCards
          transactions={transactions.filter((txn) => {
            if (!txn.date) return false;
            const txnDateParts = txn.date.split("-");
            const txnYear = parseInt(txnDateParts[0]);
            const txnMonth = parseInt(txnDateParts[1]);
            return txnYear === selectedYear && txnMonth === selectedMonth;
          })}
        />
        <div className="flex justify-between items-center mt-10 mb-2">
          {/* Search Bar */}
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search category or amount..."
              value={searchQuery}
              onChange={(e) => {
                const newSearchQuery = e.target.value;
                setSearchQuery(newSearchQuery);
                filterTransactions(
                  transactions,
                  selectedMonth,
                  selectedYear,
                  newSearchQuery
                ); // Update filtered transactions as search query changes
              }}
              className="w-60 p-3 border rounded mb-4"
            />

            {/* Month Picker */}
            <div className="ml-10 mb-4">
              <input
                type="month"
                value={`${selectedYear}-${String(selectedMonth).padStart(
                  2,
                  "0"
                )}`}
                onChange={handleMonthChange}
                className="border rounded p-3"
              />
            </div>
          </div>
          {/* Add Budget Button */}
          <div className="flex items-center ml-6 mb-4">
            <button
              onClick={() => setShowAddBudgetModal(true)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Budget
            </button>
          </div>
        </div>
        {/* Render filtered transactions in the transaction table */}
        {filteredTransactions.length > 0 ? (
          <TransactionTable
            transactions={filteredTransactions} // Ensure only filtered transactions are passed here
            setTransactions={handleTransactionsUpdate} // Use the new handler function
            refreshTransactions={fetchTransactions} // Pass down refresh function
            onUpdateClick={(id) => {
              setSelectedTransactionId(id);
              setShowUpdateTransactionModal(true);
            }}
          />
        ) : (
          <p className="text-center text-lg">No results found.</p> // If no data matches the search
        )}
        <TransactionCharts transactions={filteredTransactions} />
        {/* Modals */}
        {showAddBudgetModal && (
          <AddBudgetModal
            closeModal={() => setShowAddBudgetModal(false)}
            onBudgetAdded={fetchTransactions}
          />
        )}
        {showAddCategoryModal && (
          <AddCategoryModal closeModal={() => setShowAddCategoryModal(false)} />
        )}
        {showUpdateTransactionModal && (
          <UpdateTransactionModal
            txnId={selectedTransactionId}
            closeModal={() => setShowUpdateTransactionModal(false)}
            onUpdateSuccess={fetchTransactions} // Refresh transactions after update
          />
        )}
       
      </div>
    </div>
  );
}

export default Dashboard;
