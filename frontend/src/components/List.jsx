import React, { useEffect, useState, Fragment } from "react";
import "../style/list.css";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

function List() {
  const [taskData, setTaskData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [selectedTask, setSelectedTask] = useState([]);
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    getListData();
  }, []);

  const getListData = async () => {
    let list = await fetch("http://localhost:3200/tasks", {
      credentials: "include",
    });
    list = await list.json();
    if (list.success) {
      setTaskData(list.result);
      setOriginalData(list.result);
      calculateStatusChart(list.result);
    }
  };

  const calculateStatusChart = (tasksList) => {
    const statusCount = {
      Pending: 0,
      "In Progress": 0,
      Completed: 0,
    };

    tasksList.forEach((task) => {
      if (statusCount[task.status] !== undefined) statusCount[task.status]++;
    });

    setStatusData(
      Object.keys(statusCount).map((key) => ({
        name: key,
        value: statusCount[key],
      }))
    );
  };

  const deleteTask = async (id) => {
    let item = await fetch("http://localhost:3200/delete/" + id, {
      credentials: "include",
      method: "delete",
    });
    item = await item.json();
    if (item.success) {
      toast.error("🗑 Task deleted!", { autoClose: 1500 });
      getListData();
    }
  };

  const selectAll = (event) => {
    if (event.target.checked) {
      setSelectedTask(taskData.map((item) => item._id));
    } else {
      setSelectedTask([]);
    }
  };

  const selectSingleItem = (id) => {
    selectedTask.includes(id)
      ? setSelectedTask(selectedTask.filter((item) => item !== id))
      : setSelectedTask([id, ...selectedTask]);
  };

  const deleteMultiple = async () => {
    let res = await fetch("http://localhost:3200/delete-multiple", {
      method: "delete",
      credentials: "include",
      body: JSON.stringify(selectedTask),
      headers: { "Content-Type": "Application/Json" },
    });

    res = await res.json();
    if (res.success) {
      toast.error("🗑 Selected tasks deleted!", { autoClose: 1500 });
      getListData();
    }
  };

  const updateStatus = async (id, currentStatus) => {
    const newStatus =
      currentStatus === "Pending"
        ? "In Progress"
        : currentStatus === "In Progress"
        ? "Completed"
        : "Pending";

    let response = await fetch(`http://localhost:3200/update-status/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    let result = await response.json();
    if (result.success) {
      toast.success("Status updated!", { autoClose: 1500 });
      getListData();
    }
  };

  return (
    <div className="list-container">
      <h1 className="list">Smart Task Management System</h1>

      {/* 🔍 Filters */}

      <div className="filter-container">
        <input
          type="text"
          placeholder="Search tasks..."
          className="search-input"
          onChange={(e) => {
            const keyword = e.target.value.toLowerCase();
            setTaskData(
              originalData.filter(
                (task) =>
                  task.title.toLowerCase().includes(keyword) ||
                  task.description.toLowerCase().includes(keyword)
              )
            );
          }}
        />

        <select
          className="filter-select"
          onChange={(e) => {
            const p = e.target.value;
            if (!p) return setTaskData(originalData);
            setTaskData(originalData.filter((t) => t.priority === p));
          }}
        >
          <option value="">Filter by Priority</option>
          <option className="" value="High">
            High
          </option>
          <option className="" value="Medium">
            Medium
          </option>
          <option className="" value="Low">
            Low
          </option>
        </select>

        <select
          className="filter-select"
          onChange={(e) => {
            const s = e.target.value;
            if (!s) return setTaskData(originalData);
            setTaskData(originalData.filter((t) => t.status === s));
          }}
        >
          <option value="">Filter by Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <button onClick={deleteMultiple} className="delete-item delete-multiple">
        Delete Selected
      </button>

      {/* 🧾 Table */}
      <ul className="task-list">
        <li className="list-header">
          <input onChange={selectAll} type="checkbox" />
        </li>
        <li className="list-header">S.No</li>
        <li className="list-header">Title</li>
        <li className="list-header">Priority</li>
        <li className="list-header">Due Date</li>
        <li className="list-header">Description</li>
        <li className="list-header">Status</li>
        <li className="list-header">Action</li>

        {taskData.map((item, index) => (
          <Fragment key={item._id}>
            <li className="list-item">
              <input
                onChange={() => selectSingleItem(item._id)}
                checked={selectedTask.includes(item._id)}
                type="checkbox"
              />
            </li>

            <li className="list-item">{index + 1}</li>
            <li className="list-item">{item.title}</li>

            <li className={`list-item priority-badge ${item.priority}`}>
              {item.priority}
            </li>

            <li className="list-item">
              {item.dueDate ? (
                <span
                  className={
                    new Date(item.dueDate) < new Date() ? "overdue" : ""
                  }
                >
                  {new Date(item.dueDate).toLocaleDateString()}
                </span>
              ) : (
                "No Due Date"
              )}
            </li>

            <li className="list-item">{item.description}</li>

            <li
              className="list-item"
              onClick={() => updateStatus(item._id, item.status)}
            >
              <span
                className={`status-badge ${
                  item.status === "Completed"
                    ? "completed"
                    : item.status === "In Progress"
                    ? "progress"
                    : "pending"
                }`}
              >
                {item.status}
              </span>
            </li>

            <li className="list-item">
              <button
                onClick={() => deleteTask(item._id)}
                className="delete-item"
              >
                Delete
              </button>

              <Link to={"update/" + item._id} className="update-item">
                Update
              </Link>
            </li>
          </Fragment>
        ))}
      </ul>

      {/* 📊 Summary */}
      <div className="summary-section">
        <h2>📈 Task Summary</h2>
        <div className="summary-box">
          <p>Total Tasks: {taskData.length}</p>
          <p>
            Completed: {taskData.filter((t) => t.status === "Completed").length}
          </p>
          <p>
            Pending: {taskData.filter((t) => t.status === "Pending").length}
          </p>
          <p>
            In Progress:{" "}
            {taskData.filter((t) => t.status === "In Progress").length}
          </p>
        </div>
      </div>

      {/* 📊 Dashboard Chart Section — Pie + Bar Side by Side */}
      <div className="chart-container">
        <h2>📊 Task Status Overview</h2>

        <div className="charts-flex">
          {/* 🥧 Pie Chart */}
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  isAnimationActive={true}
                  animationDuration={800}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#ff416c", "#f9d423", "#00c851"][index % 3]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 📊 Bar Chart (Slim Bars) */}
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="value"
                  fill="#8884d8"
                  barSize={25} // 🔹 Slim Bar
                  radius={[8, 8, 0, 0]} // 🔹 Rounded top corners
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default List;
