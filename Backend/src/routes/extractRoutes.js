const express = require("express");
const router = express.Router();
const { extractTasks } = require("../controllers/extractController");

router.post("/", extractTasks);

module.exports = router;
