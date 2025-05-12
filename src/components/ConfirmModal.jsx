import React from "react";

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center rounded-lg bg-gray-600 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-sm shadow-lg relative">
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fa-solid fa-delete-left"></i>
          </button>
        </div>
        <h3 className="text-xl text-center font-semibold mb-4">
          Confirm Delete?
        </h3>

        <p className="text-lg mb-4">{message}</p>
        <div className="flex justify-center">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
