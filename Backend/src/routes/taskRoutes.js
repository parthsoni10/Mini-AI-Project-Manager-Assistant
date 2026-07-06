const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  exportCsv,
  deleteBatch,
} = require("../controllers/taskController");

router.get("/", getAllTasks);
router.get("/export/csv", exportCsv);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/batch/:meetingId", deleteBatch);
router.delete("/:id", deleteTask);

module.exports = router;
