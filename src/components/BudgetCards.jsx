import React, { useEffect, useState } from "react";

function BudgetCards({ transactions }) {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);

  useEffect(() => {
    let income = 0;
    let expense = 0;

    // No filtering here: transactions are already filtered from Dashboard
    transactions.forEach((txn) => {
      if (txn.transaction_type === "income" || txn.type === "income") {
        income += txn.amount;
      } else if (txn.transaction_type === "expense" || txn.type === "expense") {
        expense += txn.amount;
      }
    });

    setTotalIncome(income);
    setTotalExpense(expense);
    setRemainingAmount(income - expense);
  }, [transactions]);

  return (
    <div>
      {/* Cards */}
      <div className="grid grid-cols-3 gap-3 justify-between items-center">
        {/* Income */}
        <div className="bg-green-500 text-white p-2 max-w-32 ml-80 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-md font-semibold">Income</h3>
          <p className="text-md">Rs.{totalIncome.toFixed(2)}</p>
        </div>

        {/* Expense */}
        <div className="bg-red-500 text-white p-2 max-w-32 ml-40 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-md font-semibold">Expense</h3>
          <p className="text-md">Rs.{totalExpense.toFixed(2)}</p>
        </div>

        {/* Remaining */}
        <div className="bg-blue-600 text-white p-2 max-w-32 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-md font-semibold">Remaining</h3>
          <p className="text-md">Rs.{remainingAmount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default BudgetCards;
