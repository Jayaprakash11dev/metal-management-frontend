// import React from "react";
// import PurityForm from "../components/PurityForm";
// import RateForm from "../components/RateForm";
// import RateTable from "../components/RateTable";

// const Dashboard = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 p-6">
//       <h1 className="text-3xl font-bold text-center mb-8">Metal Rate Dashboard</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
//         <PurityForm />
//         <RateForm />
//       </div>

//       <RateTable />
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Plus,
  Edit3,
  Trash2,
  Shield,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  User,
  Search,
  Filter,
  Download,
  Eye,
  EyeOff,
  Coins,
  Award,
  DollarSign,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Mock data - replace with your actual API calls
const mockPurities = [
  { _id: "1", metal: "Gold", value: "22K", activeStatus: "Active" },
  { _id: "2", metal: "Gold", value: "24K", activeStatus: "Active" },
  { _id: "3", metal: "Silver", value: "92.5%", activeStatus: "Active" },
  { _id: "4", metal: "Platinum", value: "95%", activeStatus: "Deactive" },
];

const mockRates = [
  {
    _id: "1",
    metal: "Gold",
    purityId: { value: "22K" },
    rate: 6250,
    date: "2025-01-07T10:30:00Z",
    activeStatus: "Active",
  },
  {
    _id: "2",
    metal: "Gold",
    purityId: { value: "24K" },
    rate: 6850,
    date: "2025-01-07T10:25:00Z",
    activeStatus: "Active",
  },
  {
    _id: "3",
    metal: "Silver",
    purityId: { value: "92.5%" },
    rate: 85,
    date: "2025-01-07T10:20:00Z",
    activeStatus: "Active",
  },
  {
    _id: "4",
    metal: "Platinum",
    purityId: { value: "95%" },
    rate: 3200,
    date: "2025-01-07T10:15:00Z",
    activeStatus: "Deactive",
  },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [purities, setPurities] = useState([]);
  const [rates, setRates] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const [purityForm, setPurityForm] = useState({ metal: "Gold", value: "" });
  const [rateForm, setRateForm] = useState({
    metal: "Gold",
    purityId: "",
    rate: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMetal, setFilterMetal] = useState("All");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const stats = [
    { title: "Total Metals", value: "3", icon: Coins, color: "bg-blue-500" },
    {
      title: "Active Rates",
      value: rates.filter((r) => r.activeStatus === "Active").length,
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      title: "Purities",
      value: purities.length,
      icon: Award,
      color: "bg-purple-500",
    },
    {
      title: "Today's Updates",
      value: "12",
      icon: DollarSign,
      color: "bg-orange-500",
    },
  ];

  useEffect(() => {
    loadPurities();
    loadRates();
  }, []);

  const loadPurities = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/purities", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPurities(res.data);
    } catch (err) {
      console.error("Failed to load purities");
    }
  };

  const loadRates = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/rates/history?metal=Gold",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRates(res.data);
    } catch (err) {
      console.error("Failed to load rates");
    }
  };

  const handlePuritySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/purities", purityForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPurityForm({ metal: "Gold", value: "" });
      loadPurities();
    } catch (err) {
      alert("Failed to add purity");
    }
  };

  const handleRateSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        metal: rateForm.metal,
        purityId: rateForm.purityId,
        rate: Number(rateForm.rate),
      };
      await axios.post("http://localhost:5000/api/rates", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRateForm({ metal: "Gold", purityId: "", rate: "" });
      loadRates();
    } catch (err) {
      alert("Failed to add rate");
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    try {
      if (type === "purity") {
        await axios.delete(`/purities/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        loadPurities();
      } else {
        await axios.delete(`/rates/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        loadRates();
      }
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const filteredRates = rates.filter((rate) => {
    const matchesSearch =
      rate.purityId.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rate.metal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterMetal === "All" || rate.metal === filterMetal;
    return matchesSearch && matchesFilter;
  });

  const StatCard = ({ stat }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
        </div>
        <div className={`${stat.color} p-3 rounded-xl`}>
          <stat.icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const PurityCard = ({ purity }) => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
            <Coins className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{purity.metal}</h3>
            <p className="text-sm text-gray-600">{purity.value}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              purity.activeStatus === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {purity.activeStatus}
          </span>
          <button
            onClick={() => handleDelete(purity._id, "purity")}
            className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const logoutFunction = () =>{
    localStorage.removeItem("token")
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MetalCore</h1>
              <p className="text-xs text-gray-600">Management System</p>
            </div>
          </div>
        </div>

        <nav className="mt-6">
          <div className="px-4 space-y-2">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "purities", label: "Manage Purities", icon: Award },
              { id: "rates", label: "Metal Rates", icon: TrendingUp },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors" onClick={logoutFunction}>
            <LogOut className="w-5 h-5"  />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : ""
        }`}
      >
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                >
                  <Settings className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeTab === "overview" && "Dashboard Overview"}
                  {activeTab === "purities" && "Manage Purities"}
                  {activeTab === "rates" && "Metal Rates"}
                  {activeTab === "settings" && "Settings"}
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                  <Bell className="w-6 h-6 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <User className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <StatCard key={index} stat={stat} />
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-amber-500" />
                  Recent Rate Updates
                </h3>
                <div className="space-y-3">
                  {rates.slice(0, 5).map((rate) => (
                    <div
                      key={rate._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <Coins className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {rate.metal} - {rate.purityId.value}
                          </p>
                          <p className="text-sm text-gray-600">
                            Rate: ₹{rate.rate}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          rate.activeStatus === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {rate.activeStatus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "purities" && (
            <div className="space-y-6">
              {/* Add Purity Form */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-amber-500" />
                  Add New Purity
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Metal Type
                      </label>
                      <select
                        value={purityForm.metal}
                        onChange={(e) =>
                          setPurityForm({
                            ...purityForm,
                            metal: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="Gold">Gold</option>
                        <option value="Silver">Silver</option>
                        <option value="Platinum">Platinum</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Purity Value
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 22K, 24K, 92.5%"
                        value={purityForm.value}
                        onChange={(e) =>
                          setPurityForm({
                            ...purityForm,
                            value: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handlePuritySubmit}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Purity</span>
                  </button>
                </div>
              </div>

              {/* Existing Purities */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">
                  Existing Purities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {purities.map((purity) => (
                    <PurityCard key={purity._id} purity={purity} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "rates" && (
            <div className="space-y-6">
              {/* Add Rate Form */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-amber-500" />
                  Add New Rate
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Metal Type
                      </label>
                      <select
                        value={rateForm.metal}
                        onChange={(e) =>
                          setRateForm({ ...rateForm, metal: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="Gold">Gold</option>
                        <option value="Silver">Silver</option>
                        <option value="Platinum">Platinum</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Purity
                      </label>
                      <select
                        value={rateForm.purityId}
                        onChange={(e) =>
                          setRateForm({ ...rateForm, purityId: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="">Select Purity</option>
                        {purities
                          .filter((p) => p.metal === rateForm.metal)
                          .map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.value}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rate (₹)
                      </label>
                      <input
                        type="number"
                        placeholder="Enter rate"
                        value={rateForm.rate}
                        onChange={(e) =>
                          setRateForm({ ...rateForm, rate: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleRateSubmit}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-lg  hover:from-amber-600 hover:to-orange-700   transition-all duration-200 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Rate</span>
                  </button>
                </div>
              </div>

              {/* Rates Table */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Rate History</h3>
                  <div className="flex items-center space-x-4">
                    <select
                      value={filterMetal}
                      onChange={(e) => setFilterMetal(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="All">All Metals</option>
                      <option value="Gold">Gold</option>
                      <option value="Silver">Silver</option>
                      <option value="Platinum">Platinum</option>
                    </select>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Metal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Purity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRates.map((rate) => (
                        <tr key={rate._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                                <Coins className="w-4 h-4 text-yellow-600" />
                              </div>
                              <span className="font-medium text-gray-900">
                                {rate.metal}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {rate.purityId.value}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ₹{rate.rate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(rate.date).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                rate.activeStatus === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {rate.activeStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleDelete(rate._id, "rate")}
                              className="text-red-600 hover:text-red-900 hover:bg-red-50 p-1 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Settings</h3>
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
