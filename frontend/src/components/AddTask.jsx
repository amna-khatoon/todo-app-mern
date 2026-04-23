import React, { useState } from "react";
import "../style/addtask.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddTask() {
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    status: "Pending",
  });

  const handleAddTask = async () => {
    if (!taskData.title || !taskData.dueDate) {
      toast.error("❌ Title and Due Date required!", {
        position: "top-center",
      });
      return;
    }

    let result = await fetch("http://localhost:3200/add-task", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(taskData),
      headers: { "Content-Type": "application/json" },
    });

    result = await result.json();

    if (result.success) {
      toast.success("✅ Task added successfully!", {
        position: "top-center",
        autoClose: 1500,
        onClose: () => navigate("/"),
      });
    } else {
      toast.error("⚠ Something went wrong!");
    }
  };

  return (
    <div className="container">
      <h1>Add Task</h1>

      <label>Task Title</label>
      <input
        type="text"
        placeholder="Enter Task Title"
        value={taskData.title}
        onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
        required
      />

      <label>Description</label>
      <textarea
        rows={4}
        placeholder="Describe the task..."
        value={taskData.description}
        onChange={(e) =>
          setTaskData({ ...taskData, description: e.target.value })
        }
      />

      {/* Priority */}
      <label>Priority</label>
      <select
        value={taskData.priority}
        onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      {/* Due Date */}
      <label>Due Date</label>
      <input
        type="date"
        value={taskData.dueDate}
        onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
        required
      />

      {/* Status */}
      <label>Status</label>
      <select
        value={taskData.status}
        onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
      >
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <button onClick={handleAddTask} className="submit">
        Save Task
      </button>

      <ToastContainer />
    </div>
  );
}

export default AddTask;
