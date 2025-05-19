import React, { useState, useEffect } from "react";
import api from "../services/ApiUrl";
import ConfirmModal from "./ConfirmModal";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

function TransactionTable({
  transactions,
  setTransactions,
  onUpdateClick,
  refreshTransactions,
}) {
  const [showConfirmModal, setShowConfirmModal] = useState(false); // State to show/hide the modal
  const [transactionToDelete, setTransactionToDelete] = useState(null); // Track the transaction to delete
  const notyf = new Notyf({
    duration: 3000,
    position: { x: "right", y: "top" },
    types: [
      {
        type: "success",
        background: "red",
        icon: false,
      },
    ],
  });

  const handleUpdate = (id) => {
    onUpdateClick(id); // Open modal with selected transaction
  };

  const handleDelete = async () => {
    try {
      const accessToken = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      
      await api.delete(`/transactions/delete/${transactionToDelete}`, config);

      // Update the local transactions state
      const updated = transactions.filter(
        (txn) => txn.id !== transactionToDelete
      );
      setTransactions(updated);
      notyf.success("Budget deleted successfully!");

      // Refresh the parent component's data to update filteredTransactions
      if (refreshTransactions) {
        refreshTransactions();
      }

      // Close the modal
      setShowConfirmModal(false);
      setTransactionToDelete(null);
    } catch (err) {
      console.error(
        "Failed to delete budget:",
        err.response?.data || err.message
      );
      notyf.error("Failed to delete budget.");
    }
  };

  const openConfirmModal = (id) => {
    setTransactionToDelete(id);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setTransactionToDelete(null);
  };

  return (
    <div className="bg-white p-4 rounded shadow border-2">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      {/* Add a scrollable container for the table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border w-10">#</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border break-words">Amount</th>
              <th className="p-2 border break-words">Type</th>
              <th className="p-2 border break-words">Category</th>
              <th className="p-2 border break-words">Description</th>
              <th className="p-2 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, index) => (
              <tr key={txn.id} className="hover:bg-gray-50">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border break-words">{txn.date}</td>
                <td className="p-2 border break-words">₹ {txn.amount}</td>
                <td className="p-2 border break-words">
                  {txn.transaction_type}
                </td>
                <td className="p-2 border break-words">{txn.category}</td>
                <td className="p-2 border break-words">
                  {txn.description || "-"}
                </td>
                <td className="p-2 border">
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdate(txn.id)}
                      className="bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-sky-400"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => openConfirmModal(txn.id)}
                      className="bg-rose-500 text-white px-4 py-2 rounded-full hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showConfirmModal && (
        <ConfirmModal
          message="Are you sure you want to delete this data?"
          onConfirm={handleDelete}
          onCancel={closeConfirmModal}
        />
      )}
    </div>
  );
}

export default TransactionTable;