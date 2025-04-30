import React from "react";
import api from "../services/ApiUrl";

function TransactionTable({ transactions, setTransactions, onUpdateClick }) {
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await api.delete(`/transactions/delete/${id}`);
        const updated = transactions.filter((txn) => txn.id !== id);
        setTransactions(updated);
      } catch (err) {
        console.error(err);
      }
    }
  };
  

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse table-fixed">

          <thead>
            <tr className="bg-gray-100">
            <th className="p-2 border w-40">Date</th>
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
                <td className="p-2 border">₹ {txn.amount}</td>
                <td className="p-2 border">{txn.transaction_type}</td>
                <td className="p-2 border">{txn.category}</td>
                <td className="p-2 border">{txn.description || "-"}</td>
                <td className="p-2 border space-x-2">
                  <button
                  type="button"
                    onClick={() => onUpdateClick(txn.id)}
                    className=" bg-blue-500 text-white px-4 py-2 rounded-full"
                  >
                    Update
                  </button>
                  <button 
                  type="button"
                    onClick={() => handleDelete(txn.id)}
                    className=" bg-red-500 text-white px-4 py-2 rounded-full"
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
