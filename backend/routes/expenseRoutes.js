const express = require("express");
const Expense = require("../models/Expense");

const router = express.Router();

// ➤ Add Expense
router.post("/", async (req, res) => {
  const { name, amount, category } = req.body;
  try {
    const expense = new Expense({ name, amount, category });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ➤ Get All Expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ➤ Delete Expense
router.delete("/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
