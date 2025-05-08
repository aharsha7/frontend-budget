import React, { useEffect, useState } from "react";
import { Coins, ShoppingCart, PiggyBank } from "lucide-react";

function BudgetCards({ transactions }) {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);

  useEffect(() => {
    let income = 0;
    let expense = 0;

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

  const renderValueWithArrow = (value) => {
    const isPositive = value >= 0;
    return (
      <span className={`flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {isPositive ? "↑" : "↓"} Rs.{Math.abs(value).toFixed(2)}
      </span>
    );
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-between gap-4 mt-4 w-full">
        {/* Income */}
        <div className="flex-1 min-w-[150px] p-4 rounded-lg shadow-md flex flex-col items-center">
          <Coins className="text-green-500 w-8 h-8 mb-2" />
          <h3 className="text-md font-semibold">Income</h3>
          <p className="text-md">
            {renderValueWithArrow(totalIncome)}
          </p>
        </div>

        {/* Expense */}
        <div className="flex-1 min-w-[150px] p-4 rounded-lg shadow-md flex flex-col items-center">
          <ShoppingCart className="text-red-500 w-8 h-8 mb-2" />
          <h3 className="text-md font-semibold">Expense</h3>
          <p className="text-md">
            {renderValueWithArrow(-totalExpense)}
          </p>
        </div>

        {/* Remaining */}
        <div className="flex-1 min-w-[150px] p-4 rounded-lg shadow-md flex flex-col items-center">
          <PiggyBank className="text-yellow-500 w-8 h-8 mb-2" />
          <h3 className="text-md font-semibold">Remaining</h3>
          <p className="text-md">
            {renderValueWithArrow(remainingAmount)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BudgetCards;
