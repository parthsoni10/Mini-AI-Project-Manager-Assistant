const Meeting = require("../models/Meeting");
const Task = require("../models/Task");
const llmService = require("../services/llmService");

const extractTasks = async (req, res, next) => {
  try {
    const { rawText } = req.body;
    if (!rawText || typeof rawText !== "string" || !rawText.trim()) {
      res.status(400);
      throw new Error("rawText is required and must be a non-empty string.");
    }

    // Call AI service
    const extractedTasks = await llmService.extractTasks(rawText);

    // Create the meeting history document
    const meeting = new Meeting({
      rawText: rawText.trim(),
      extractedTaskIds: [],
    });
    await meeting.save();

    // Map extracted tasks to Task models with meeting ID reference
    const taskDocs = extractedTasks.map(task => ({
      description: task.description,
      dueDate: task.dueDate,
      owner: task.owner
        ? task.owner.trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
        : "Unassigned",
      priority: task.priority || "Medium",
      status: "Todo",
      meetingId: meeting._id,
      sourceText: task.sourceText || ""
    }));

    // Save all tasks
    let savedTasks = [];
    if (taskDocs.length > 0) {
      savedTasks = await Task.insertMany(taskDocs);
    }

    // Update meeting with task IDs
    meeting.extractedTaskIds = savedTasks.map(t => t._id);
    await meeting.save();

    res.status(201).json({
      success: true,
      meeting,
      tasks: savedTasks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  extractTasks,
};
