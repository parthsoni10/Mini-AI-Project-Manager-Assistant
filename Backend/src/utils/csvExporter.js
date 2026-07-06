const exportToCsv = (tasks) => {
  const headers = ["Description", "Due Date", "Owner", "Priority", "Status", "Created At"];
  
  const rows = tasks.map(task => {
    // Escape double quotes inside string fields
    const cleanDescription = (task.description || "").replace(/"/g, '""');
    const cleanOwner = (task.owner || "Unassigned").replace(/"/g, '""');
    
    const dueDateStr = task.dueDate 
      ? new Date(task.dueDate).toISOString().split('T')[0] 
      : "None";
      
    const createdAtStr = task.createdAt 
      ? new Date(task.createdAt).toISOString().split('T')[0] 
      : "";

    return [
      `"${cleanDescription}"`,
      `"${dueDateStr}"`,
      `"${cleanOwner}"`,
      `"${task.priority || "Medium"}"`,
      `"${task.status || "Todo"}"`,
      `"${createdAtStr}"`
    ];
  });

  return [headers.join(","), ...rows.map(row => row.join(","))].join("\r\n");
};

module.exports = { exportToCsv };
