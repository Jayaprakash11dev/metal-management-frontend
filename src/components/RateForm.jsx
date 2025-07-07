import React, { useState, useEffect } from "react";
import axios from "axios";

const RateForm = () => {
  const [metal, setMetal] = useState("Gold");
  const [purityId, setPurityId] = useState("");
  const [rate, setRate] = useState("");
  const [purities, setPurities] = useState([]);

  const token = localStorage.getItem("token");

  const fetchPurities = async () => {
    const res = await axios.get("http://localhost:5000/api/purities", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPurities(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(
      "http://localhost:5000/api/rates",
      { metal, purityId, rate: Number(rate) },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setRate("");
  };

  useEffect(() => {
    fetchPurities();
  }, [metal]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Add Metal Rate</h2>
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
          <label className="block mb-1 font-medium">Purity</label>
          <select
            value={purityId}
            onChange={(e) => setPurityId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select</option>
            {purities
              .filter((p) => p.metal === metal)
              .map((p) => (
                <option key={p._id} value={p._id}>
                  {p.value}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Rate</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter rate"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit Rate
        </button>
      </form>
    </div>
  );
};

export default RateForm;
