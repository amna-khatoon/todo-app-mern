import express from "express";
import { connection, collectionName } from "./dbconfig.js";
import cors from "cors";
import jsonwebtoken from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { ObjectId } from "bson";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

// Middleware for JWT verify
function verifyJWTtoken(req, resp, next) {
  const token = req.cookies["token"];
  jsonwebtoken.verify(token, "Google", (error, decoded) => {
    if (error) {
      return resp.status(401).send({
        msg: "invalid token",
        success: false,
      });
    }
    next();
  });
}

// ---------------- TASK ROUTES ----------------

// Add Task
app.post("/add-task", verifyJWTtoken, async (req, resp) => {
  const db = await connection();
  const collection = await db.collection(collectionName);

  const newTask = {
    ...req.body,
    status: req.body.status || "Pending",
    priority: req.body.priority || "Medium",
    dueDate: req.body.dueDate || null,
    createdAt: new Date(),
  };

  const result = await collection.insertOne(newTask);
  return resp.send({ message: "new task added", success: true, result });
});

// Get Tasks with Filters
app.get("/tasks", verifyJWTtoken, async (req, resp) => {
  const db = await connection();
  const collection = await db.collection(collectionName);
  const { status, priority, sort } = req.query;

  let query = {};
  if (status) query.status = status;
  if (priority) query.priority = priority;

  let sortOption = {};
  if (sort === "dueDate") sortOption.dueDate = 1;
  if (sort === "priority") sortOption.priority = 1;

  const result = await collection.find(query).sort(sortOption).toArray();
  resp.send({ message: "tasks fetched", success: true, result });
});

// Delete Task
app.delete("/delete/:id", verifyJWTtoken, async (req, resp) => {
  const db = await connection();
  const collection = await db.collection(collectionName);

  const result = await collection.deleteOne({
    _id: new ObjectId(req.params.id),
  });
  resp.send({ message: "task deleted", success: true, result });
});

// Get Task by ID
app.get("/tasks/:id", verifyJWTtoken, async (req, resp) => {
  const db = await connection();
  const collection = await db.collection(collectionName);

  const result = await collection.findOne({ _id: new ObjectId(req.params.id) });
  resp.send({ message: "task fetched", success: true, result });
});

// Update Task
app.put("/update-task", verifyJWTtoken, async (req, resp) => {
  const db = await connection();
  const collection = await db.collection(collectionName);

  const { _id, ...fields } = req.body;
  const result = await collection.updateOne(
    { _id: new ObjectId(_id) },
    { $set: fields }
  );

  resp.send({ message: "task updated", success: true, result });
});

// Delete Multiple Tasks
app.delete("/delete-multiple", verifyJWTtoken, async (req, resp) => {
  const db = await connection();
  const deleteIds = req.body.map((id) => new ObjectId(id));
  const collection = await db.collection(collectionName);

  const result = await collection.deleteMany({ _id: { $in: deleteIds } });
  resp.send({ message: "multiple tasks deleted", success: true, result });
});

// Update Task Status
app.put("/update-status/:id", verifyJWTtoken, async (req, res) => {
  const { status } = req.body;
  const db = await connection();
  const collection = await db.collection(collectionName);

  const result = await collection.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { status } }
  );
  res.send({ success: true, message: "status updated", result });
});

// Signup
app.post("/signup", async (req, resp) => {
  const userData = req.body;

  if (!userData.email || !userData.password)
    return resp.send({ success: false, msg: "Missing fields" });

  const db = await connection();
  const collection = await db.collection("users");
  const result = await collection.insertOne(userData);

  jsonwebtoken.sign(
    userData,
    "Google",
    { expiresIn: "30d" },
    (error, token) => {
      resp.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });
      resp.send({ success: true, msg: "signup done", token });
    }
  );
});

// Login
app.post("/login", async (req, resp) => {
  const { email, password } = req.body;
  const db = await connection();
  const collection = await db.collection("users");

  const user = await collection.findOne({ email, password });
  if (!user) return resp.send({ success: false, msg: "Invalid credentials" });

  jsonwebtoken.sign(user, "Google", { expiresIn: "30d" }, (error, token) => {
    resp.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
    resp.send({ success: true, msg: "login done", token });
  });
});

// Update Profile (Name Only)
app.put("/update-profile", verifyJWTtoken, async (req, resp) => {
  const { email, name } = req.body;
  const db = await connection();
  const users = await db.collection("users");

  const result = await users.updateOne({ email }, { $set: { name } });
  resp.send({ success: true, msg: "profile updated", result });
});

// Change Password
app.put("/change-password", verifyJWTtoken, async (req, resp) => {
  const { email, oldPassword, newPassword } = req.body;
  const db = await connection();
  const users = await db.collection("users");

  const user = await users.findOne({ email });
  if (!user || user.password !== oldPassword)
    return resp.send({ success: false, message: "Incorrect old password" });

  const result = await users.updateOne(
    { email },
    { $set: { password: newPassword } }
  );
  resp.send({ success: true, message: "Password updated", result });
});

// Logout
app.get("/logout", verifyJWTtoken, (req, resp) => {
  resp.clearCookie("token");
  resp.send({ success: true, message: "Logged out" });
});

// Server Start
app.listen(3200, () => {
  console.log("Server Running On Port 3200");
});
