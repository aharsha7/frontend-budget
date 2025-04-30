import React from 'react';

const TransactionCard = ({ transaction, onDelete }) => {
  const { title, amount, category, type, date } = transaction;

  return (
    <div className={`p-4 rounded shadow flex justify-between items-center ${type === 'income' ? 'bg-green-50' : 'bg-red-50'}`}>
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-600">{category} • {new Date(date).toLocaleDateString()}</p>
      </div>
      <div className="flex items-center space-x-4">
        <span className={`text-lg font-bold ${type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
          {type === 'income' ? '+' : '-'}${parseFloat(amount).toFixed(2)}
        </span>
        <button
          onClick={onDelete}
          className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TransactionCard;
