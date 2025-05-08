import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BudgetCards from "../components/BudgetCards";
import AddBudgetModal from "../components/AddBudgetModal";
import AddCategoryModal from "../components/AddCategoryModal";
import UpdateTransactionModal from "../components/UpdateTransactionModal";
import api from "../services/ApiUrl";
import TransactionTable from "../components/TransactionTable";
import TransactionCharts from "../components/TransactionCharts";
import axios from "axios";
import { Plus, BarChart3, List } from 'lucide-react';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showUpdateTransactionModal, setShowUpdateTransactionModal] =
    useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [showCharts, setShowCharts] = useState(false);

  const toggleCharts = () => {
    setShowCharts(!showCharts); 
  };

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
      const accessToken = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const res = await axios.get(
        "http://localhost:5000/api/transactions/get",
        config
      );
      // console.log(res)
      const reversedData = [...res.data].reverse();
      // console.log(reversedData)
      setTransactions(reversedData);
      filterTransactions(
        reversedData,
        selectedMonth,
        selectedYear,
        searchQuery
      );
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

  const handleBudgetAdded = (newTransaction) => {
    setTransactions((prevTransactions) => [
      newTransaction,
      ...prevTransactions,
    ]);
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
        {/* Budget Cards */}
        <BudgetCards
          transactions={transactions.filter((txn) => {
            if (!txn.date) return false;
            const txnDateParts = txn.date.split("-");
            const txnYear = parseInt(txnDateParts[0]);
            const txnMonth = parseInt(txnDateParts[1]);
            return txnYear === selectedYear && txnMonth === selectedMonth;
          })}
        />
  
        {/* Conditionally Render Content */}
        {showCharts ? (
          // Show only charts
          <>
            <div className="flex justify-end mt-4 mb-4">
              <button
                onClick={toggleCharts}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                <List size={24} />
                Show Transactions
              </button>
            </div>
            <TransactionCharts
              transactions={filteredTransactions}
              refreshTransactions={fetchTransactions}
            />
          </>
        ) : (
          <>
            {/* Search Bar, Month Picker, and Buttons Section */}
            <div className="flex flex-wrap justify-between items-center gap-4 mt-10 mb-2">
              {/* Search Bar and Month Picker */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Search Bar */}
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
                    );
                  }}
                  className="w-full sm:w-60 p-3 border rounded"
                />
  
                {/* Month Picker */}
                <div className="w-full sm:w-auto">
                  <input
                    type="month"
                    value={`${selectedYear}-${String(selectedMonth).padStart(
                      2,
                      "0"
                    )}`}
                    onChange={handleMonthChange}
                    className="w-full sm:w-auto border rounded p-3"
                  />
                </div>
              </div>
  
              {/* Buttons Section */}
              <div className="flex items-center space-x-4">
                {/* Add Budget Button */}
                <button
                  onClick={() => setShowAddBudgetModal(true)}
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  <Plus size={18} />
                  Add Budget
                </button>
  
                {/* Show Charts Button */}
                <button
                  onClick={toggleCharts}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  {showCharts ? (
                    <>
                      <List size={18} />
                      Show Transactions
                    </>
                  ) : (
                    <>
                      <BarChart3 size={18} />
                      Show Charts
                    </>
                  )}
                </button>
              </div>
            </div>
  
            {/* Transaction Table */}
            {filteredTransactions.length > 0 ? (
              <TransactionTable
                transactions={filteredTransactions}
                setTransactions={handleTransactionsUpdate}
                refreshTransactions={fetchTransactions}
                onUpdateClick={(id) => {
                  setSelectedTransactionId(id);
                  setShowUpdateTransactionModal(true);
                }}
              />
            ) : (
              <p className="text-center text-lg">No results found.</p>
            )}
          </>
        )}
  
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
            onUpdateSuccess={fetchTransactions}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
