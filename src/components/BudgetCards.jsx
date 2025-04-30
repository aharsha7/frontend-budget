import React, { useEffect, useState } from "react";
import api from "../services/ApiUrl";
function BudgetCards() {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const res = await api.get("/transactions");
        const transactions = res.data;

        let budget = 0;
        let expense = 0;

        // Calculate total budget and total expense
        transactions.forEach((txn) => {
          if (txn.type === "income") {
            budget += txn.amount;
          } else {
            expense += txn.amount;
          }
        });

        setTotalBudget(budget);
        setTotalExpense(expense);
        setRemainingAmount(budget - expense);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    fetchBudgetData();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-3  justify-center items-center">
      {/* Total Budget */}
      <div className="bg-green-500 text-white p-1 max-w-32  space-y-1 rounded-lg shadow-md flex flex-col items-center">
        <h3 className="text-xs font-semibold">Total Budget</h3>
        <p className="text-xs ">Rs.{totalBudget.toFixed(2)}</p>
      </div>

      {/* Total Expense */}
      <div className="bg-red-500 text-white p-1 max-w-32  space-y-1 rounded-lg shadow-md flex flex-col items-center">
        <h3 className="text-xs font-semibold">Total Expense</h3>
        <p className="text-xs mt-4">Rs.{totalExpense.toFixed(2)}</p>
      </div>

      {/* Remaining Amount */}
      <div className="bg-blue-500 text-white p-1 max-w-32  space-y-1 rounded-lg shadow-md flex flex-col items-center">
        <h3 className="text-xs font-semibold">Remaining Amount</h3>
        <p className="text-xs mt-4">Rs.{remainingAmount.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default BudgetCards;
