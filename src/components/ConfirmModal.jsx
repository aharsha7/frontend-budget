import React from "react";

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center rounded-lg bg-gray-600 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-sm shadow-lg">
        <h2 className="text-xl text-center font-semibold mb-4">Confirm Delete ?</h2>
        <p className="text-lg mb-4">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;