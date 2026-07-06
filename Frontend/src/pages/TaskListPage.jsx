import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import TaskFilters from "../components/TaskFilters";
import TaskCard from "../components/TaskCard";
import TaskEditModal from "../components/TaskEditModal";
import ExportButton from "../components/ExportButton";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { RefreshCw, ClipboardList, Trash2 } from "lucide-react";

export default function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ownersList, setOwnersList] = useState([]);
  const [filters, setFilters] = useState({
    status: "All",
    priority: "All",
    owner: "All"
  });

  // Edit states
  const [editingTask, setEditingTask] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchTasks = async (currentFilters = filters) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentFilters.status !== "All") params.append("status", currentFilters.status);
      if (currentFilters.priority !== "All") params.append("priority", currentFilters.priority);
      if (currentFilters.owner !== "All") params.append("owner", currentFilters.owner);

      const response = await axiosClient.get(`/tasks?${params.toString()}`);
      setTasks(response.data.tasks);

      if (currentFilters.status === "All" && currentFilters.priority === "All" && currentFilters.owner === "All") {
        const ownerMap = {};
        response.data.tasks.forEach((task) => {
          const owner = task.owner ? task.owner.trim() : "";
          if (owner) {
            const key = owner.toLowerCase();
            const capitalized = owner
              .split(/\s+/)
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join(" ");
            if (!ownerMap[key]) {
              ownerMap[key] = capitalized;
            }
          }
        });
        const uniqueOwners = Object.values(ownerMap).sort((a, b) => a.localeCompare(b));
        setOwnersList(uniqueOwners);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load tasks from the database.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsEditOpen(true);
  };

  const handleSaveTask = async (updatedTask) => {
    try {
      await axiosClient.put(`/tasks/${updatedTask._id}`, updatedTask);
      toast.success("Task updated successfully!");
      fetchTasks();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update task.");
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axiosClient.delete(`/tasks/${id}`);
      toast.success("Task deleted successfully!");
      fetchTasks();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete task.");
    }
  };

  const handleDeleteBatch = async (meetingId, batchName) => {
    const confirmMsg = `Are you sure you want to delete the entire ${batchName} and all associated tasks? This action cannot be undone.`;
    if (!window.confirm(confirmMsg)) return;

    try {
      await axiosClient.delete(`/tasks/batch/${meetingId}`);
      toast.success(`${batchName} and all its tasks deleted successfully!`);
      fetchTasks();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete the batch.");
    }
  };

  // Helper to group tasks by their parent Meeting
  const groupTasksByMeeting = (tasksList) => {
    const groups = {};

    tasksList.forEach((task) => {
      const meeting = task.meetingId;
      const meetingIdStr = meeting?._id || "unassociated";

      if (!groups[meetingIdStr]) {
        groups[meetingIdStr] = {
          meetingInfo: meeting || null,
          tasks: []
        };
      }
      groups[meetingIdStr].tasks.push(task);
    });

    // Sort meetings chronologically (latest first), unassociated tasks go to the bottom
    return Object.values(groups).sort((a, b) => {
      if (a.meetingInfo && b.meetingInfo) {
        return new Date(b.meetingInfo.createdAt) - new Date(a.meetingInfo.createdAt);
      }
      if (!a.meetingInfo) return 1;
      if (!b.meetingInfo) return -1;
      return 0;
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-100 text-glow">Task Dashboard</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Manage, filter, edit, and export tasks extracted from your meeting notes.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchTasks()}
            type="button"
            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 border border-slate-700/60 rounded-xl transition-all cursor-pointer flex items-center justify-center"
            title="Refresh Tasks"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <ExportButton filters={filters} />
        </div>
      </div>

      {/* Filters */}
      <TaskFilters
        filters={filters}
        onFilterChange={setFilters}
        ownersList={ownersList}
      />

      {/* Tasks Content */}
      {isLoading ? (
        <Loader text="Loading your tasks dashboard..." />
      ) : tasks.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
          <div className="bg-slate-900/60 w-12 h-12 rounded-xl flex items-center justify-center mx-auto border border-white/5">
            <ClipboardList className="w-6 h-6 text-slate-500" />
          </div>
          <div className="space-y-1">
            <h3 className="text-slate-200 font-semibold text-lg">No tasks found</h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
              No tasks match your filter selections, or there are no tasks in the system. Go to the Extract tab to paste notes!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {(() => {
            const groupsArray = groupTasksByMeeting(tasks);
            const meetingGroupsCount = groupsArray.filter((g) => g.meetingInfo).length;

            return groupsArray.map((group, groupIndex) => {
              const isUnassociated = !group.meetingInfo;
              const batchNum = isUnassociated ? 0 : meetingGroupsCount - groupIndex;

              const dateStr = !isUnassociated
                ? new Date(group.meetingInfo.createdAt).toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })
                : "";

              const rawTextExcerpt = !isUnassociated && group.meetingInfo.rawText
                ? group.meetingInfo.rawText.length > 150
                  ? group.meetingInfo.rawText.substring(0, 150) + "..."
                  : group.meetingInfo.rawText
                : "";

              return (
                <div key={isUnassociated ? "unassociated" : group.meetingInfo._id} className="space-y-5 animate-in fade-in duration-300">
                  {/* Meeting Group Header */}
                  <div className="border-b border-white/5 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-1">
                      <h2 className="text-lg font-display font-bold text-indigo-300 flex items-center space-x-2">
                        {!isUnassociated && (
                          <span className="bg-indigo-500/10 px-2 py-0.5 rounded-md text-xs font-mono border border-indigo-500/20 text-indigo-400">
                            Batch #{batchNum}
                          </span>
                        )}
                        <span>{isUnassociated ? "General Tasks" : `Extracted Notes — ${dateStr}`}</span>
                      </h2>
                      {!isUnassociated && (
                        <p className="text-xs text-slate-500 mt-1 italic leading-relaxed max-w-3xl">
                          Source text: "{rawTextExcerpt}"
                        </p>
                      )}
                    </div>

                    {/* Delete Batch Button */}
                    <button
                      onClick={() => handleDeleteBatch(isUnassociated ? "unassociated" : group.meetingInfo._id, isUnassociated ? "General Tasks" : `Batch #${batchNum}`)}
                      type="button"
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/25 hover:border-rose-500/40 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer self-start sm:self-auto shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Batch</span>
                    </button>
                  </div>

                  {/* Tasks Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.tasks.map((task) => (
                      <div key={task._id}>
                        <TaskCard
                          task={task}
                          onEdit={handleEditClick}
                          onDelete={handleDeleteTask}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      )}

      {/* Edit Modal */}
      <TaskEditModal
        task={editingTask}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveTask}
      />
    </div>
  );
}
