const Task = require("../models/Task");
const Meeting = require("../models/Meeting");
const { exportToCsv } = require("../utils/csvExporter");

const getAllTasks = async (req, res, next) => {
  try {
    const { owner, status, priority } = req.query;
    const filter = {};

    if (owner && owner !== "All" && owner.trim() !== "") {
      filter.owner = { $regex: new RegExp("^" + owner.trim() + "$", "i") };
    }
    if (status && status !== "All" && status.trim() !== "") {
      filter.status = status;
    }
    if (priority && priority !== "All" && priority.trim() !== "") {
      filter.priority = priority;
    }

    const tasks = await Task.find(filter).populate("meetingId").sort({ createdAt: -1 });
    res.json({ success: true, tasks });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }
    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { description, dueDate, owner, priority, status } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (owner !== undefined) {
      task.owner = owner
        ? owner.trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
        : "Unassigned";
    }
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;

    const updatedTask = await task.save();
    res.json({ success: true, task: updatedTask });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }
    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const exportCsv = async (req, res, next) => {
  try {
    const { owner, status, priority } = req.query;
    const filter = {};

    if (owner && owner !== "All" && owner.trim() !== "") {
      filter.owner = { $regex: new RegExp("^" + owner.trim() + "$", "i") };
    }
    if (status && status !== "All" && status.trim() !== "") {
      filter.status = status;
    }
    if (priority && priority !== "All" && priority.trim() !== "") {
      filter.priority = priority;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    const csvContent = exportToCsv(tasks);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="tasks.csv"');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

const deleteBatch = async (req, res, next) => {
  try {
    const { meetingId } = req.params;

    if (meetingId === "unassociated") {
      await Task.deleteMany({ $or: [{ meetingId: null }, { meetingId: { $exists: false } }] });
    } else {
      // Delete all tasks associated with this meeting ID
      await Task.deleteMany({ meetingId });
      // Delete the meeting history document
      await Meeting.findByIdAndDelete(meetingId);
    }

    res.json({ success: true, message: "Batch and all associated tasks deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  exportCsv,
  deleteBatch,
};
