import React, { useState } from "react";

const SearchFilter = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = data.filter(
    (item) =>
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.amount.toString().includes(searchQuery)
  );

  return (
    <div className="p-4 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Search category or amount..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded mb-4 font-black"
      />

      <table className="w-full border border-collapse">
        <thead>
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Category</th>
            <th className="border px-2 py-1">Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <tr key={item.id}>
                <td className="border px-2 py-1">{item.id}</td>
                <td className="border px-2 py-1">{item.category}</td>
                <td className="border px-2 py-1">{item.amount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border px-2 py-1 text-center" colSpan="3">
                No results found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SearchFilter;
