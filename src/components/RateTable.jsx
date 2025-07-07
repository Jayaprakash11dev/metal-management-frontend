import React, { useEffect, useState } from "react";
import axios from "axios";

const RateTable = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const fetchRates = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/rates/history?metal=Gold",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHistory(res.data);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load rate history.");
    }
  };

  const handleDelete = async (id) => {
  const confirm = window.confirm("Are you sure to delete this purity?");
  if (!confirm) return;

  const token = localStorage.getItem("token");
  await axios.delete(`http://localhost:5000/api/rates/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  fetchRates(); // refresh
};


  useEffect(() => {
    fetchRates();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Rate History (Gold)</h2>

      {error ? (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Purity</th>
              <th className="p-2">Rate</th>
              <th className="p-2">Date</th>
              <th className="p-2">Active Status</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((r) => (
                <tr key={r._id} className="border-t text-sm">
                  <td className="p-2">{r.purityId?.value || "—"}</td>
                  <td className="p-2">{r.rate}</td>
                  <td className="p-2">
                    {new Date(r.date).toLocaleString("en-IN")}
                  </td>
                  <td className="p-2">{r.activeStatus}</td>
                  <td>
                    <td>
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="text-red-600 text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  No rates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RateTable;
