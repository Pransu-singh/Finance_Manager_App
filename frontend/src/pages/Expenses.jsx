import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";

const API_URL = "http://localhost:5000/api/expenses"; // Backend API URL

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [expense, setExpense] = useState({ name: "", amount: "", category: "", date: "" });
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("latest");
  const [error, setError] = useState(null);

  const categories = ["Food", "Rent", "Utilities", "Transport", "Entertainment"];

  // Fetch expenses from backend
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(API_URL);
        setExpenses(response.data);
      } catch (err) {
        console.error("Error fetching expenses:", err);
        setError("Failed to fetch expenses. Please check the server.");
      }
    };
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!expense.name || !expense.amount || !expense.category || !expense.date) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(API_URL, expense);
      setExpenses([...expenses, response.data]);
      setExpense({ name: "", amount: "", category: "", date: "" });
      setError(null);
    } catch (err) {
      console.error("Error adding expense:", err);
      setError("Failed to add expense.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setExpenses(expenses.filter((exp) => exp._id !== id));
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError("Failed to delete expense.");
    }
  };

  // Filter & Sort Expenses
  let filteredExpenses = expenses.filter((exp) =>
    filterCategory === "All" ? true : exp.category === filterCategory
  );

  let sortedExpenses = [...filteredExpenses].sort((a, b) =>
    sortOrder === "latest" ? new Date(b.date) - new Date(a.date) : a.amount - b.amount
  );

  // Calculate Total Expense per Category
  const categoryTotals = categories.map((cat) => ({
    category: cat,
    total: expenses.filter((exp) => exp.category === cat).reduce((sum, exp) => sum + Number(exp.amount), 0),
  }));

  // Chart Data
  const chartData = {
    labels: categoryTotals.map((c) => c.category),
    datasets: [
      {
        label: "Expenses",
        data: categoryTotals.map((c) => c.total),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9C27B0"],
      },
    ],
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Expense Manager</h2>

      {/* Display Error Messages */}
      {error && <p className="text-danger">{error}</p>}

      {/* Add Expense Form */}
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="mb-2">
          <label className="form-label">Expense Name</label>
          <input type="text" name="name" className="form-control" value={expense.name} onChange={handleChange} required />
        </div>

        <div className="mb-2">
          <label className="form-label">Amount ($)</label>
          <input type="number" name="amount" className="form-control" value={expense.amount} onChange={handleChange} required />
        </div>

        <div className="mb-2">
          <label className="form-label">Category</label>
          <select name="category" className="form-control" value={expense.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <label className="form-label">Date</label>
          <input type="date" name="date" className="form-control" value={expense.date} onChange={handleChange} required />
        </div>

        <button type="submit" className="btn btn-primary">Add Expense</button>
      </form>

      {/* Filters & Sorting */}
      <div className="mb-3">
        <select className="form-control mb-2" onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button className="btn btn-secondary" onClick={() => setSortOrder(sortOrder === "latest" ? "low-to-high" : "latest")}>
          Sort by {sortOrder === "latest" ? "Amount (Low to High)" : "Date (Latest First)"}
        </button>
      </div>

      {/* Expense List */}
      <ul className="list-group">
        {sortedExpenses.length === 0 ? (
          <p className="text-muted">No expenses available.</p>
        ) : (
          sortedExpenses.map((exp) => (
            <li key={exp._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{exp.name}</strong> - ${exp.amount} <span className="badge bg-secondary">{exp.category}</span> ({new Date(exp.date).toLocaleDateString()})
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(exp._id)}>Delete</button>
            </li>
          ))
        )}
      </ul>

      {/* Expense Summary Chart */}
      <div className="mt-4">
        <h4>Expense Breakdown</h4>
        <Pie data={chartData} />
      </div>
    </div>
  );
};

export default Expenses;
