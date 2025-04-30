import { useEffect, useState } from "react";
import api from "../services/ApiUrl";

function TransactionTable() {
  const [transactions, setTransactions] = useState([]);
  
  const handleUpdate = (txn) => {
    // Populate the AddBudgetModal form with the selected transaction's details
    setBudgetForm({
      amount: txn.amount,
      transaction_type: txn.transaction_type,
      category: txn.category,
      description: txn.description,
      date: txn.date,
    });
    openAddBudgetModal(); // Open the modal
  };

  const fetchTransactions = async () => {
    try {
      // const res = await api.get('/transactions/get');
      const res = await api.get("/transactions/get");

      console.log(res.data, "res");
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleClick = async(id) => {
    if (window.confirm("Are you sure you want to update this transaction?")) {
      try {
        await api.put(`/transactions/put/${id}`);
        fetchTransactions(); // Refresh
      } catch (err) {
        console.error(err);
      }
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await api.delete(`/transactions/delete/${id}`);
        fetchTransactions(); // Refresh
      } catch (err) {
        console.error(err);
      }
    }
  };

  // useEffect(() => {
  //   fetchTransactions();
  // }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-gray-50">
                <td className="p-2 border">{txn.date}</td>
                <td className="p-2 border">₹{txn.amount}</td>
                <td className="p-2 border">{txn.transaction_type}</td>
                <td className="p-2 border">{txn.category}</td>
                <td className="p-2 border">{txn.description || "-"}</td>
                <td className="p-2 border space-x-2">
                  <button 
                  onClick={() => handleClick(txn.id)}
                  className="text-blue-500 hover:underline">
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(txn.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionTable;
