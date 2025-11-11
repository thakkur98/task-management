import express from "express";
import Task from "../models/task.js";  // Correct
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get tasks for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create task
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const task = await Task.create({ title, description, status, user: req.user._id });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: "Error creating task", error: error.message });
  }
});

// Update task
router.put("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not authorized" });

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete task
router.delete("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not authorized" });

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;