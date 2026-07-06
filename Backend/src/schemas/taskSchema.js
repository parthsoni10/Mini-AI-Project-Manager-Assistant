const { z } = require("zod");

const TaskSchema = z.object({
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().nullable().or(z.date()).transform((val) => {
    if (!val) return null;
    const date = new Date(val);
    return isNaN(date.getTime()) ? null : date;
  }),
  owner: z.string().nullable().optional().default("Unassigned").transform((val) => val || "Unassigned"),
  priority: z.enum(["Low", "Medium", "High"]).default("Medium"),
  sourceText: z.string().optional().default(""),
});

const TaskArraySchema = z.object({
  tasks: z.array(TaskSchema),
});

module.exports = {
  TaskSchema,
  TaskArraySchema,
};
