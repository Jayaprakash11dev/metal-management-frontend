import React, { useState, useEffect } from "react";
import axios from "axios";

const PurityForm = () => {
  const [metal, setMetal] = useState("Gold");
  const [value, setValue] = useState("");
  const [purities, setPurities] = useState([]);

  const fetchPurities = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/purities", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPurities(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await axios.post(
      "http://localhost:5000/api/purities",
      { metal, value },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setValue("");
    fetchPurities();
  };

  const handleDelete = async (id) => {
  const confirm = window.confirm("Are you sure to delete this purity?");
  if (!confirm) return;

  const token = localStorage.getItem("token");
  await axios.delete(`http://localhost:5000/api/purities/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  fetchPurities();
};


  useEffect(() => {
    fetchPurities();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Add Purity</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Metal</label>
          <select
            value={metal}
            onChange={(e) => setMetal(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option>Gold</option>
            <option>Silver</option>
            <option>Platinum</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Purity Value</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g. 22K"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </form>

      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Existing Purities</h3>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {purities.map((p) => (
            <>
              <div>
                {" "}
                <li key={p._id}>
                  {p.metal} - {p.value}
                </li>
                <li>{p.activeStatus}</li>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-red-600 text-sm ml-2 hover:underline"
                >
                  Delete
                </button>
              </div>
            </>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PurityForm;
