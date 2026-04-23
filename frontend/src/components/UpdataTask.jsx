import React, { useState } from "react";
import "../style/addtask.css";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UpdataTask() {
  const [taskData, setTaskData] = useState();
  const { id } = useParams();
  const nevigate = useNavigate();

  useEffect(() => {
    getTask(id);
  }, []);
  const getTask = async (id) => {
    let task = await fetch("http://localhost:3200/tasks/" + id, {
      method: "GET",
      credentials: "include",
    });
    task = await task.json();
    if (task.result) {
      setTaskData(task.result);
    } else {
      toast.error("Failed to load task — maybe login expired?");
    }
  };

  const updateTask = async () => {
    console.log("function called", taskData);
    let task = await fetch("http://localhost:3200/update-task", {
      credentials: "include",
      method: "put",
      body: JSON.stringify(taskData),
      headers: {
        "Content-Type": "Application/Json",
      },
    });

    task = await task.json();
    if (task.success) {
      toast.success("🔄 Task updated successfully!", {
        position: "top-center",
        autoClose: 1500,
        onClose: () => nevigate("/"),
      });
    }
  };

  return (
    <div className="container">
      <h1>Update Task</h1>

      <label htmlFor="">Title</label>
      <input
        value={taskData?.title}
        onChange={(event) =>
          setTaskData({ ...taskData, title: event.target.value })
        }
        type="text"
        name="title"
        placeholder="Enter Task Title"
      />
      <label htmlFor="">Description</label>
      <textarea
        value={taskData?.description}
        onChange={(event) =>
          setTaskData({ ...taskData, description: event.target.value })
        }
        rows={4}
        name="description"
        placeholder="Enter Task Description"
        id=""
      ></textarea>
      <button onClick={updateTask} className="submit">
        Update Task
      </button>
      <ToastContainer />
    </div>
  );
}

export default UpdataTask;
